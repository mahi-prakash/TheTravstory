import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useUser } from "./UserContext";
import { fetchPhoto } from "../utils/unsplash";

const TripContext = createContext(null);

const API_URL = "http://localhost:5000/api";

export const TripProvider = ({ children }) => {
  const { token } = useUser();
  // 🏛️ STATE
  const [trips, setTrips] = useState([]);
  const [activeTripId, setActiveTripId] = useState(localStorage.getItem("activeTripId"));
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // 🗺️ PERSISTENT ITINERARY CACHE
  const [itineraryCache, setItineraryCache] = useState({});

  // Sync activeTripId to storage
  useEffect(() => {
    if (activeTripId) {
      localStorage.setItem("activeTripId", activeTripId);
    }
  }, [activeTripId]);

  // Fetch trips
  useEffect(() => {
    if (token) {
      fetchTrips();
    } else {
      setTrips([]);
      setActiveTripId(null);
      setItineraryCache({});
      localStorage.removeItem("activeTripId");
    }
  }, [token]);

  // 🔥 AUTO-SCAN ITINERARY ON TRIP SELECTION
  useEffect(() => {
    if (activeTripId && token) {
      // If we already have it in cache, maybe don't re-scan? 
      // Actually, let's re-scan to ensure freshness, but keep show loading.
      fetchAndScanMessages(activeTripId);
    }
  }, [activeTripId, token]);

  const enhanceItineraryWithImages = async (itineraryData) => {
    if (!itineraryData?.days) return itineraryData;
    
    // 🛡️ Normalized entries to avoid .map crash on objects
    const dayEntries = Array.isArray(itineraryData.days)
      ? itineraryData.days.map((d, i) => [`day-${i+1}`, d])
      : Object.entries(itineraryData.days);

    const enhancedDaysArray = await Promise.all(
      dayEntries.map(async ([dayId, day]) => {
        const enhancedActivities = await Promise.all(
          (day.activities || day.items || []).map(async (activity) => {
            if (activity.img) return activity;
            const query = `${activity.title} ${activity.location || ""}`.trim();
            const imageUrl = await fetchPhoto(query);
            return {
              ...activity,
              img: imageUrl || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop",
            };
          }),
        );
        return [dayId, { ...day, activities: enhancedActivities }];
      }),
    );

    // If original was an object, return an object. 
    if (!Array.isArray(itineraryData.days)) {
      return { ...itineraryData, days: Object.fromEntries(enhancedDaysArray) };
    }
    
    return { ...itineraryData, days: enhancedDaysArray.map(pair => pair[1]) };
  };

  const updateAiItinerary = async (id, ai_itinerary) => {
    if (!id || !ai_itinerary) return;
    try {
      await fetch(`${API_URL}/trips/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ai_itinerary }),
      });
      // Update local trips state
      setTrips(prev => prev.map(t => t.id === id ? { ...t, ai_itinerary } : t));
    } catch (err) {
      console.error("Failed to save AI itinerary to DB", err);
    }
  };

  const updateTripItinerary = async (id, itinerary) => {
    if (!id || !itinerary) return;
    try {
      const res = await fetch(`${API_URL}/trips/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itinerary }),
      });
      if (!res.ok) return;
      const data = await res.json();
      
      // Update local trips state to include the new itinerary
      setTrips(prev => prev.map(t => t.id === id ? { ...t, itinerary: data.trip.itinerary } : t));
      
      // 🔥 SYNC CACHE: Ensure local cache matches the DB update
      setItineraryCache(prev => ({ ...prev, [id]: data.trip.itinerary }));
    } catch (err) {
      console.error("Failed to save itinerary to DB", err);
    }
  };

  const fetchAndScanMessages = async (id) => {
    if (!id || !token) return;
    
    const tripInList = (trips || []).find(t => t.id === id);
    
    // 🔥 LOADING GUARD: If trips are still fetching, wait. 
    if (loading && (!trips || trips.length === 0)) {
        return;
    }

    const cachedItin = itineraryCache[id];
    const isCached = cachedItin?.days && (
      Array.isArray(cachedItin.days) 
        ? cachedItin.days.length > 0 
        : Object.keys(cachedItin.days).length > 0
    );

    const hasDbItinerary = tripInList?.itinerary?.days && (
      Array.isArray(tripInList.itinerary.days) 
        ? tripInList.itinerary.days.length > 0 
        : Object.keys(tripInList.itinerary.days).length > 0
    );

    if (isCached || hasDbItinerary) {
        if (hasDbItinerary && !isCached) {
          saveItineraryToCache(id, tripInList.itinerary);
        }
        return;
    }

    console.log(`📡 [TripContext] Scanning history for Trip: ${id}`);
    
    try {
      const res = await fetch(`${API_URL}/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const messages = data.messages || [];

      let recovered = null;
      for (const msg of [...messages].reverse()) {
        const text = msg.content || "";
        const match = text.match(/\[ITINERARY\]([\s\S]*?)\[\/ITINERARY\]/i) || 
                      text.match(/(\{[\s\S]*"days"[\s\S]*\})/i);
        if (match) {
          try {
            let json = match[1] || match[0];
            const start = json.indexOf("{");
            const end = json.lastIndexOf("}");
            if (start !== -1 && end !== -1) json = json.slice(start, end + 1);
            recovered = JSON.parse(json);
            if (recovered.days) break;
          } catch (e) {}
        }
      }

      if (recovered) {
        console.log(`📦 [TripContext] Saving recovered itinerary for trip ${id}`);
        
        const dayObject = {};
        if (Array.isArray(recovered.days)) {
          recovered.days.forEach((day, idx) => {
            const dayId = `day-${idx + 1}`;
            dayObject[dayId] = { ...day, id: dayId };
          });
          recovered.days = dayObject;
        }

        const enhanced = await enhanceItineraryWithImages(recovered);
        saveItineraryToCache(id, enhanced);
        updateAiItinerary(id, enhanced);
      }
    } catch (error) {
      console.error(`❌ [TripContext] Scan failed:`, error);
    }
  };

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/trips`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      const safeTrips = (data.trips || []).filter(t => t && t.id);
      
      // 🔥 PRE-CACHE EXISTING VALID ITINERARIES
      setItineraryCache(prev => {
        const merged = { ...prev };
        let updated = false;
        safeTrips.forEach(t => {
          const hasItin = t.itinerary?.days && (
            Array.isArray(t.itinerary.days) 
              ? t.itinerary.days.length > 0 
              : Object.keys(t.itinerary.days).length > 0
          );

          const hasAiItin = t.ai_itinerary?.days && (
            Array.isArray(t.ai_itinerary.days) 
              ? t.ai_itinerary.days.length > 0 
              : Object.keys(t.ai_itinerary.days).length > 0
          );

          if ((hasItin || hasAiItin) && !merged[t.id]) {
             merged[t.id] = t.itinerary || t.ai_itinerary;
             updated = true;
          }
        });
        return updated ? merged : prev;
      });

      setTrips(safeTrips);

      // 🔥 FIX: Only set active trip if NOT already set
      if (!activeTripId) {
        const savedId = localStorage.getItem("activeTripId");
        if (savedId && safeTrips.some(t => t.id === savedId)) {
          setActiveTripId(savedId);
        } else if (safeTrips.length > 0) {
          setActiveTripId(safeTrips[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (payload) => {
    try {
      const res = await fetch(`${API_URL}/trips`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) return null;
      const data = await res.json();
      if (!data?.trip?.id) return null;

      setTrips((prev) => [data.trip, ...prev]);
      setActiveTripId(data.trip.id);
      return data.trip;
    } catch (err) { return null; }
  };

  const addItemToTrip = async (tripId, dayId, item) => {
    if (!tripId || !dayId || !item) return;
    
    // Get current itinerary from cache
    const itinerary = itineraryCache[tripId] || { days: {} };
    const newItinerary = JSON.parse(JSON.stringify(itinerary));
    
    // Safety check for days object
    if (!newItinerary.days) newItinerary.days = {};

    // Ensure the specific day exists
    if (!newItinerary.days[dayId]) {
      newItinerary.days[dayId] = {
        id: dayId,
        title: dayId.replace("day-", "Day "),
        activities: []
      };
    }

    // Standardize activities list
    if (!newItinerary.days[dayId].activities) {
        newItinerary.days[dayId].activities = newItinerary.days[dayId].items || [];
    }

    // Add new item with unique ID
    const newItem = {
      ...item,
      id: `item-${Date.now()}`,
      time: item.time || "TBD"
    };

    newItinerary.days[dayId].activities.push(newItem);
    
    // 🔥 SYNC: Update local cache and persist to database
    saveItineraryToCache(tripId, newItinerary);
    await updateTripItinerary(tripId, newItinerary);
  };

  const saveItineraryToCache = (id, itinerary) => {
    if (!id) return;
    setItineraryCache(prev => ({ ...prev, [id]: itinerary }));
  };

  const setActiveTrip = (tripId) => {
    setActiveTripId(tripId || null);
  };

  const deleteTrip = async (tripId) => {
    if (!tripId) return;
    try {
      const res = await fetch(`${API_URL}/trips/${tripId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete trip");
      
      setTrips(prev => prev.filter(t => t.id !== tripId));
      
      setItineraryCache(prev => {
        const newCache = { ...prev };
        delete newCache[tripId];
        return newCache;
      });

      if (activeTripId === tripId) {
        setActiveTripId(null);
        localStorage.removeItem("activeTripId");
      }
    } catch (err) {
      console.error("Delete trip failed:", err);
    }
  };

  const activeTrip = (trips || []).find((t) => t?.id === activeTripId) || null;

  // 🔥 PERSISTENCE & AUTO-SYNC EFFECT
  useEffect(() => {
    if (activeTripId) {
      localStorage.setItem("activeTripId", activeTripId);
      // If we don't have this trip in cache, fetch it!
      if (!itineraryCache[activeTripId]) {
         fetchAndScanMessages(activeTripId);
      }
    }
  }, [activeTripId]);

  return (
    <TripContext.Provider
      value={{
        trips,
        activeTripId,
        activeTrip,
        loading,
        createTrip,
        setActiveTrip,
        fetchTrips,
        itineraryCache,
        saveItineraryToCache,
        addItemToTrip,
        deleteTrip,
        updateTripItinerary,
        updateAiItinerary,
        updateTrip: async (id, payload) => {
          if (!id || !payload) return;
          try {
            const res = await fetch(`${API_URL}/trips/${id}`, {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });
            if (!res.ok) return;
            const data = await res.json();
            setTrips(prev => prev.map(t => t.id === id ? { ...t, ...data.trip } : t));
            if (payload.itinerary) {
              setItineraryCache(prev => ({ ...prev, [id]: data.trip.itinerary }));
            }
          } catch (err) {
            console.error("Failed to update trip", err);
          }
        },
        isGenerating,
        setIsGenerating
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => useContext(TripContext);