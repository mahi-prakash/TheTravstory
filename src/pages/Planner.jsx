import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap
} from "react-leaflet";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Search,
  Plane,
  Hotel,
  Utensils,
  Camera,
  MapPin,
  Plus,
  ChevronDown,
  Trash2,
  Navigation,
  Clock,
  Star,
  ArrowLeft,
  Calendar,
  Tag,
  DollarSign
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet Icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// --- Mock Data ---

const initialDays = {
  "day-1": {
    id: "day-1",
    title: "Day 1: Arrival & Classics",
    date: "Oct 12",
    color: "#0284c7",
    items: [
      {
        id: "item-1",
        type: "flight",
        title: "Landing at CDG",
        time: "10:00 AM",
        location: "Charles de Gaulle Airport",
        coords: [49.0097, 2.5479],
        img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600",
        category: "Transit",
        cost: "N/A",
        duration: "1h 30m",
        bestTime: "Morning",
        tags: ["Travel", "Airport"],
        desc: "Arrival at Paris Charles de Gaulle. Proceed to baggage claim and take the RER B train to the city center."
      },
      {
        id: "item-2",
        type: "hotel",
        title: "Check-in at Le Littré",
        time: "12:00 PM",
        location: "Hotel Le Littré",
        coords: [48.8431, 2.3248],
        img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600",
        category: "Stay",
        cost: "€250/night",
        duration: "Check-in",
        bestTime: "After 2 PM",
        tags: ["Luxury", "Comfort"],
        desc: "A charming 4-star hotel located in the 6th arrondissement, between Saint-Germain-des-Prés and Montparnasse."
      },
      {
        id: "item-3",
        type: "food",
        title: "Lunch at Angelina",
        time: "01:30 PM",
        location: "Angelina Paris",
        coords: [48.8653, 2.3292],
        img: "https://images.unsplash.com/photo-1554679665-f5537f187268?q=80&w=600",
        category: "Food",
        cost: "€40-60",
        duration: "1h 30m",
        bestTime: "Lunch",
        tags: ["Famous", "Hot Chocolate", "Pastry"],
        desc: "Famous tearoom known for its signature hot chocolate 'L'Africain' and Mont-Blanc pastry. A must-visit classic."
      },
      {
        id: "item-4",
        type: "activity",
        title: "Louvre Museum",
        time: "03:00 PM",
        location: "Musée du Louvre",
        coords: [48.8606, 2.3376],
        img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=900&auto=format&fit=crop",
        category: "Landmark",
        cost: "€17",
        duration: "3h+",
        bestTime: "Early Morning or Late Night",
        tags: ["Art", "History", "Museum"],
        desc: "The world's largest art museum and a historic monument in Paris. Home to the Mona Lisa and thousands of other masterpieces."
      },
    ],
  },
  "day-2": {
    id: "day-2",
    title: "Day 2: Bohemian Vibes",
    date: "Oct 13",
    color: "#0284c7",
    items: [
      {
        id: "item-5",
        type: "food",
        title: "Brunch at Carette",
        time: "10:00 AM",
        location: "Carette",
        coords: [48.8637, 2.2872],
        img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600",
        category: "Food",
        cost: "€30-50",
        duration: "1h 30m",
        bestTime: "Morning",
        tags: ["Brunch", "Macarons", "View"],
        desc: "Elegant café serving delicious brunch and pastries. Great view of Trocadéro."
      },
      {
        id: "item-6",
        type: "activity",
        title: "Montmartre Walk",
        time: "11:30 AM",
        location: "Montmartre",
        coords: [48.8867, 2.3431],
        img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=60",
        category: "Adventure",
        cost: "Free",
        duration: "2h",
        bestTime: "Anytime",
        tags: ["Walking", "Views", "Art"],
        desc: "Explore the artistic hilltop district of Montmartre, famous for its cobbled streets, artists, and the Sacré-Cœur."
      },
    ],
  },
  "day-3": {
    id: "day-3",
    title: "Day 3: Shopping & Seine",
    date: "Oct 14",
    color: "#0284c7",
    items: [],
  },
};

const savedPlaces = [
  {
    id: "saved-1",
    name: "Eiffel Tower Area",
    type: "activity",
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=900&auto=format&fit=crop",
    coords: [48.8584, 2.2945],
    category: "Landmark",
    cost: "€26",
    duration: "2-3h",
    bestTime: "Sunset",
    tags: ["Iconic", "View", "Romance"],
    desc: "The Iron Lady. Visit the summit for breathtaking views of Paris."
  },
  {
    id: "saved-2",
    name: "Le Marais",
    type: "activity",
    rating: 4.7,
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600",
    coords: [48.8575, 2.3592],
    category: "District",
    cost: "Free",
    duration: "3h+",
    bestTime: "Afternoon",
    tags: ["Shopping", "Food", "History"],
    desc: "A historic district in Paris known for its boutiques, galleries, and diverse dining scene."
  },
  {
    id: "saved-3",
    name: "Seine Cruise",
    type: "activity",
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1499856871940-a09627c6d7db?q=80&w=600",
    coords: [48.8590, 2.2940],
    category: "Adventure",
    cost: "€15",
    duration: "1h",
    bestTime: "Evening",
    tags: ["Boat", "Scenic", "Relaxing"],
    desc: "Enjoy a scenic boat tour along the Seine River, passing by many of the city's top monuments."
  },
];

const nearbyPlaces = [
  {
    id: "nearby-1",
    name: "Café de Flore",
    type: "food",
    rating: 4.5,
    img: "https://images.unsplash.com/photo-1550966871-3ed3c622bc13?q=80&w=600",
    coords: [48.8541, 2.3331],
    category: "Food",
    cost: "€20-40",
    duration: "1h",
    bestTime: "Morning",
    tags: ["Coffee", "History", "People Watching"],
    desc: "One of the oldest coffeehouses in Paris, famous for its famous clientele."
  },
  {
    id: "nearby-2",
    name: "Luxembourg Gardens",
    type: "activity",
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1558296236-8c7a65956037?q=80&w=600",
    coords: [48.8462, 2.3371],
    category: "Nature",
    cost: "Free",
    duration: "1-2h",
    bestTime: "Afternoon",
    tags: ["Park", "Relax", "Gardens"],
    desc: "A beautiful 17th-century park & palace, perfect for a relaxing stroll or a picnic."
  },
];

// --- Helpers ---

const getItemIcon = (type) => {
  switch (type) {
    case "flight": return Plane;
    case "hotel": return Hotel;
    case "food": return Utensils;
    case "activity": return Camera;
    default: return MapPin;
  }
};

const createCustomIcon = (number, color) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); color: white; font-weight: 800; font-size: 14px;">${number}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

function MapUpdater({ locations }) {
  const map = useMap();
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(l => l.coords));
      map.fitBounds(bounds, { padding: [100, 100], maxZoom: 14 });
    }
  }, [locations, map]);
  return null;
}

// --- Main Component ---

export default function Planner() {
  const [days, setDays] = useState(initialDays);
  const [dayOrder, setDayOrder] = useState(["day-1", "day-2", "day-3"]);
  const [selectedDayId, setSelectedDayId] = useState("all");
  const [activeTab, setActiveTab] = useState("saved");
  const [collapsedDays, setCollapsedDays] = useState({});
  const [selectedPlace, setSelectedPlace] = useState(null);

  const toggleCollapse = (dayId) => {
    setCollapsedDays(prev => ({ ...prev, [dayId]: !prev[dayId] }));
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const day = days[source.droppableId];
      const newItems = Array.from(day.items);
      const [moved] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, moved);
      setDays({ ...days, [source.droppableId]: { ...day, items: newItems } });
    } else {
      const sourceDay = days[source.droppableId];
      const destDay = days[destination.droppableId];
      const sourceItems = Array.from(sourceDay.items);
      const destItems = Array.from(destDay.items);
      const [moved] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, moved);
      setDays({
        ...days,
        [source.droppableId]: { ...sourceDay, items: sourceItems },
        [destination.droppableId]: { ...destDay, items: destItems },
      });
    }
  };

  const addToDay = (place, dayId) => {
    if (!dayId) return;
    const newItem = {
      id: `item-${Date.now()}`,
      title: place.name,
      type: place.type,
      time: "TBD",
      location: place.name,
      coords: place.coords,
      img: place.img,
      category: place.category,
      cost: place.cost,
      duration: place.duration,
      bestTime: place.bestTime,
      tags: place.tags || [],
      desc: place.desc
    };

    setDays(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        items: [...prev[dayId].items, newItem]
      }
    }));
  };

  // Map Data Logic
  const mapMarkers = [];
  const mapPolylines = [];
  const visibleDays = selectedDayId === "all" ? dayOrder : [selectedDayId];

  visibleDays.forEach(dayId => {
    const day = days[dayId];
    const coords = [];
    day.items.forEach((item, index) => {
      mapMarkers.push({ ...item, dayColor: day.color, number: index + 1, dayId });
      coords.push(item.coords);
    });
    if (coords.length > 1) {
      mapPolylines.push({ coords, color: day.color, dayId });
    }
  });

  return (
    <div className="h-screen bg-slate-50 font-sans grid grid-cols-[450px_1fr_400px] gap-6 p-6 overflow-hidden">

      <DragDropContext onDragEnd={onDragEnd}>

        {/* --- LEFT CARD: ITINERARY --- */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl flex flex-col overflow-hidden h-[calc(100vh-20px)] relative z-10"
        >
          {/* Fixed Header */}
          <div className="p-6 pb-2 shrink-0 bg-white/50 backdrop-blur-md z-20">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-4">Itinerary</h2>

            {/* Day Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide items-center">
              <button
                onClick={() => setSelectedDayId("all")}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm border ${selectedDayId === "all"
                  ? "bg-sky-600 text-white border-sky-600 shadow-md transform scale-105"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
              >
                All Days
              </button>
              {dayOrder.map(dayId => {
                const day = days[dayId];
                const isActive = selectedDayId === dayId;
                return (
                  <button
                    key={dayId}
                    onClick={() => setSelectedDayId(dayId)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm border ${isActive ? "text-white shadow-md transform scale-105" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    style={isActive ? { backgroundColor: day.color, borderColor: day.color } : {}}
                  >
                    {day.date}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable Timeline */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 pb-6 no-scrollbar">
            <div className="space-y-6 pt-2">
              {visibleDays.map(dayId => {
                const day = days[dayId];
                const isCollapsed = collapsedDays[dayId];

                return (

                  <div key={dayId} className="relative bg-white/60 border border-white/60 p-4 rounded-[28px] shadow-sm mb-4 backdrop-blur-sm transition-all hover:bg-white/80 hover:shadow-md">

                    {/* Day Header */}
                    <div
                      onClick={() => toggleCollapse(dayId)}
                      className="flex items-center gap-3 mb-2 cursor-pointer group"
                    >
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold shadow-md shadow-slate-200 transition-transform group-hover:scale-105"
                        style={{ backgroundColor: day.color }}
                      >
                        {day.items.length}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 text-sm leading-tight truncate">{day.title}</h3>
                        <p className="text-[10px] text-slate-500 font-bold mt-0.5">{day.date} • {day.items.length} stops</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:bg-slate-50 transition-colors">
                        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isCollapsed ? "-rotate-90" : ""}`} />
                      </div>
                    </div>

                    {/* Droppable Area */}
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pt-2"
                        >
                          <Droppable droppableId={dayId}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`rounded-3xl transition-all min-h-[60px] ${snapshot.isDraggingOver ? "bg-slate-50/50 ring-2 ring-dashed ring-slate-300/50" : ""
                                  }`}
                              >
                                {day.items.map((item, index) => {
                                  return (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={{ ...provided.draggableProps.style }}
                                          onClick={() => setSelectedPlace(item)}
                                          className={`group relative flex gap-3 bg-white rounded-2xl p-2.5 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all mb-2 cursor-pointer ${snapshot.isDragging ? "rotate-2 scale-105 z-50 shadow-2xl ring-2 ring-sky-400" : ""
                                            } ${selectedPlace?.id === item.id ? "ring-2 ring-sky-400 shadow-md" : ""}`}
                                        >
                                          {/* Image Thumbnail */}
                                          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-100 relative shadow-inner">
                                            {item.img ? (
                                              <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <MapPin size={18} />
                                              </div>
                                            )}
                                          </div>

                                          {/* Content */}
                                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <h4 className="font-bold text-slate-800 text-xs truncate leading-tight">{item.title}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                              <span className="flex items-center gap-1 text-[9px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100">
                                                <Clock size={9} /> {item.time}
                                              </span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.location}</p>
                                          </div>

                                          <button
                                            className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1 rounded-full text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              // Functionality for delete would go here
                                            }}
                                          >
                                            <Trash2 size={12} />
                                          </button>
                                        </div>
                                      )}
                                    </Draggable>
                                  );
                                })}
                                {provided.placeholder}

                                {day.items.length === 0 && (
                                  <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-slate-200/60 rounded-2xl bg-slate-50/50">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-2">
                                      <Plus size={16} />
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Drag places here</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </Droppable>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              <button className="w-full py-3 rounded-2xl border border-dashed border-slate-300 text-slate-400 hover:text-sky-600 hover:border-sky-300 hover:bg-sky-50 transition-all font-bold text-xs flex items-center justify-center gap-2">
                <Plus size={14} /> Add Day
              </button>
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/90 to-transparent rounded-b-[32px]" />
        </motion.div>

        {/* --- CENTER CARD: DYNAMIC EXPERIENCE VIEW --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/60 backdrop-blur-2xl rounded-[40px] shadow-2xl border border-white/50 h-[calc(100vh-70px)] p-8 flex flex-col z-0 relative group/center"
        >
          <AnimatePresence mode="wait">
            {selectedPlace ? (
              // --- PLACE MODE ---
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex flex-col bg-slate-100/50 rounded-[32px] overflow-hidden p-3"
              >
                <div className="w-full h-full flex flex-col bg-white rounded-[24px] overflow-hidden shadow-sm ring-1 ring-black/5">
                  {/* 1. VISUAL HEADER (Fixed Top) */}
                  <div className="h-[40%] shrink-0 relative group/image">
                    <img src={selectedPlace.img} className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105" />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

                    {/* Back Button */}
                    <div className="absolute top-6 left-6 z-50">
                      <button
                        onClick={() => setSelectedPlace(null)}
                        className="bg-white/90 backdrop-blur-md hover:bg-white text-slate-800 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-lg border border-white/50 flex items-center gap-2 group/btn"
                      >
                        <ArrowLeft size={16} className="group-hover/btn:-translate-x-1 transition-transform" /> Back
                      </button>
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-sm">
                          {selectedPlace.category || "Place"}
                        </span>
                      </div>
                      <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-none mb-2 drop-shadow-md">
                        {selectedPlace.title}
                      </h1>
                      <p className="text-white/90 text-sm font-medium flex items-center gap-2 drop-shadow-sm">
                        <MapPin size={14} className="text-sky-400 fill-sky-400" /> {selectedPlace.location}
                      </p>
                    </div>
                  </div>

                  {/* 2. SCROLLABLE CONTENT (Cards Layout) */}
                  <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
                    <div className="space-y-4 pb-16">

                      {/* Description Card */}
                      <div>
                        <div className="flex items-center justify-between mb-3 px-1">
                          <h3 className="text-[11px] font-extrabold text-sky-600 uppercase tracking-widest">Overview</h3>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-bold shadow-md hover:bg-slate-800 transition-all group/nav">
                            <Navigation size={10} className="group-hover/nav:-translate-y-0.5 transition-transform" /> Get Directions
                          </button>
                        </div>
                        <div className="bg-white p-4 rounded-[24px] shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] border border-slate-100/50">
                          <p className="text-slate-600 text-[15px] leading-relaxed font-medium">
                            {selectedPlace.desc || "Experience the unique atmosphere of this location. Perfect for travelers looking to immerse themselves in local culture and history. A true gem in the heart of the city."}
                          </p>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Cost */}
                        <div className="bg-white p-4 rounded-[24px] shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] border border-slate-100/50 flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center shrink-0 border border-sky-100">
                            <DollarSign size={20} />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Cost</h4>
                            <p className="text-base font-bold text-slate-800">{selectedPlace.cost || "Free"}</p>
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="bg-white p-4 rounded-[24px] shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] border border-slate-100/50 flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0 border border-purple-100">
                            <Clock size={20} />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Duration</h4>
                            <p className="text-base font-bold text-slate-800">{selectedPlace.duration || "1-2h"}</p>
                          </div>
                        </div>

                        {/* Best Time */}
                        <div className="bg-white p-4 rounded-[24px] shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] border border-slate-100/50 flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100">
                            <Calendar size={20} />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Best Time</h4>
                            <p className="text-base font-bold text-slate-800">{selectedPlace.bestTime || "Anytime"}</p>
                          </div>
                        </div>

                        {/* Type */}
                        <div className="bg-white p-4 rounded-[24px] shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] border border-slate-100/50 flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100">
                            <Tag size={20} />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Type</h4>
                            <p className="text-base font-bold text-slate-800">{selectedPlace.category || "General"}</p>
                          </div>
                        </div>
                      </div>

                      {/* CTAs - Removed as requested */}
                      <div className="pt-2"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              // --- MAP MODE ---
              <motion.div
                key="map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex flex-col bg-slate-100/50 rounded-[32px] overflow-hidden p-3"
              >
                <div className="w-full h-full flex flex-col bg-white rounded-[24px] overflow-hidden shadow-sm ring-1 ring-black/5">
                  {/* 1. VISUAL CARD (Map) */}
                  <div className="flex-1 relative z-0">
                    <MapContainer
                      center={[48.8566, 2.3522]}
                      zoom={13}
                      className="w-full h-full outline-none"
                      zoomControl={false}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                      />
                      {mapPolylines.map((route, idx) => (
                        <Polyline
                          key={`${route.dayId}-${idx}`}
                          positions={route.coords}
                          pathOptions={{ color: route.color, opacity: 0.8, weight: 4, dashArray: '1, 8' }}
                        />
                      ))}
                      {mapMarkers.map((marker, idx) => (
                        <Marker
                          key={`${marker.dayId}-${marker.id}`}
                          position={marker.coords}
                          icon={createCustomIcon(marker.number, marker.dayColor)}
                          eventHandlers={{ click: () => setSelectedPlace(marker) }}
                        />
                      ))}
                      <MapUpdater locations={mapMarkers} />
                    </MapContainer>

                    {/* Map Controls */}
                    <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
                      <button className="w-9 h-9 bg-white rounded-xl shadow-md text-slate-600 flex items-center justify-center hover:bg-slate-50 font-bold border border-slate-100 transition-transform active:scale-95">+</button>
                      <button className="w-9 h-9 bg-white rounded-xl shadow-md text-slate-600 flex items-center justify-center hover:bg-slate-50 font-bold border border-slate-100 transition-transform active:scale-95">-</button>
                    </div>
                  </div>

                  {/* 2. SUMMARY SECTION (Below) */}
                  <div className="bg-white p-5 shrink-0 border-t border-slate-200 z-10 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200">
                          <MapPin size={24} />
                        </div>
                        <div>
                          <h2 className="text-lg font-extrabold text-sky-800">Paris Trip</h2>
                          <p className="text-xs text-slate-500 font-bold mt-0.5">3 Days • 14.2 km</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Stops</span>
                          <span className="text-sm font-extrabold text-slate-800">{days["day-1"].items.length + days["day-2"].items.length + days["day-3"].items.length}</span>
                        </div>
                        <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Days</span>
                          <span className="text-sm font-extrabold text-slate-800">3</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* --- RIGHT CARD: EXPLORE --- */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl flex flex-col overflow-hidden h-[calc(100vh-48px)] z-10"
        >
          {/* Header & Tabs */}
          <div className="p-6 pb-2 shrink-0 bg-white/50 backdrop-blur-md z-20">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Explore</h2>

            <div className="relative group mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-medium outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all shadow-sm"
              />
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl">
              {['saved', 'nearby', 'search'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all duration-300 ${activeTab === tab
                    ? "bg-white text-sky-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Places List */}
          <div className="flex-1 overflow-y-auto px-4 pb-6 no-scrollbar">
            <div className="space-y-4 pt-2">
              {(activeTab === "saved" ? savedPlaces : nearbyPlaces).map((place, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={place.id}
                  onClick={() => setSelectedPlace(place)}
                  className="group bg-white rounded-[24px] p-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-100 cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-32 w-full rounded-2xl overflow-hidden mb-3 group-hover:shadow-md transition-shadow">
                    <img src={place.img} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm flex items-center gap-1">
                      <Star size={10} className="text-amber-500 fill-amber-500" /> {place.rating}
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-white text-[10px] font-bold">
                      {place.category}
                    </div>
                  </div>

                  <div className="px-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-sky-600 transition-colors">{place.name}</h4>
                      {/* Add Action */}
                      <div className="relative group/add" onClick={(e) => e.stopPropagation()}>
                        <button className="w-8 h-8 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center hover:bg-sky-600 hover:text-white transition-all shadow-sm">
                          <Plus size={16} />
                        </button>
                        <div className="absolute right-0 top-8 bg-white rounded-xl shadow-xl border border-slate-100 p-1 w-28 hidden group-hover/add:block z-50">
                          {dayOrder.map(id => (
                            <button
                              key={id}
                              onClick={() => addToDay(place, id)}
                              className="w-full text-left px-2 py-1.5 text-[10px] font-bold text-slate-600 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition-colors"
                            >
                              {days[id].title.split(':')[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">{place.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

      </DragDropContext>
    </div>
  );
}
