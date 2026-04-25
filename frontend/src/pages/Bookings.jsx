// src/pages/Bookings.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../components/common/Card";
import { Plane, Hotel, Car, Calendar, Sparkles, Map, ArrowLeft, Star, MapPin, Search, ChevronDown, Clock, Bed, Ticket } from "lucide-react";
import { useTrip } from "../context/TripContext";
import { api } from "../services/api";

const Bookings = () => {
    const navigate = useNavigate();
    const { trips, updateTrip } = useTrip();
    const [activeTab, setActiveTab] = useState("Final Plan");
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [bookedItemIds, setBookedItemIds] = useState([101, 201, 301, 401]);
    const [tripImages, setTripImages] = useState({});

    // Filter trips that have an itinerary (the ones ready for bookings)
    const availableTrips = trips.filter(t => t.itinerary);

    // Dynamic Image Fetching & Caching with API Tracking
    useEffect(() => {
        const loadImages = async () => {
            const newImages = { ...tripImages };
            let updatedCount = 0;

            for (const trip of availableTrips) {
                // Rate Control: Check if we already have it
                if (trip.image && !newImages[trip.id]) {
                    newImages[trip.id] = trip.image;
                    updatedCount++;
                    continue;
                }

                if (!trip.image && !newImages[trip.id]) {
                    // Centralized Call
                    const photo = await api.unsplash.fetchPhoto(trip.destination || trip.title);
                    if (photo) {
                        newImages[trip.id] = photo;
                        updatedCount++;
                        // Persist to DB
                        api.trips.update(trip.id, { image: photo }, updateTrip);
                    }
                }
            }

            if (updatedCount > 0) {
                setTripImages(newImages);
            }
        };

        if (availableTrips.length > 0) {
            loadImages();
        }
    }, [availableTrips.length]);

    const toggleBooking = (id) => {
        setBookedItemIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const tabs = ["Final Plan", "Explore and Book", "Confirmed"];

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedTrip(null);
    };

    return (
        <div className="bg-slate-50/50 min-h-full">
            <div className="max-w-[1400px] mx-auto px-10 sm:px-16 lg:px-20 pt-6 pb-8 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Your Bookings</h1>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                            Manage all your flights, hotels, and reservations in one place.
                        </p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex items-center justify-center space-x-8 border-b border-slate-200 w-full max-w-2xl mx-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => handleTabChange(tab)}
                                className={`relative pb-3 text-sm font-medium transition-colors duration-300 ${activeTab === tab
                                    ? "text-sky-600"
                                    : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTabIndicator"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-t-full"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <AnimatePresence mode="wait">
                    {activeTab === "Confirmed" && (
                        <motion.div
                            key="confirmed"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-8"
                        >
                            <Card className="mx-14 p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px] border-dashed border-2 border-slate-200 bg-sky-50/20 rounded-[32px]">
                                <div className="bg-white p-6 rounded-full shadow-md ring-1 ring-sky-100">
                                    <Plane className="w-12 h-12 text-[#0081C9]" />
                                </div>
                                <div className="max-w-md space-y-2">
                                    <h2 className="text-2xl font-bold text-[#0B1527]">
                                        No upcoming trips
                                    </h2>
                                    <p className="text-slate-500 font-medium">
                                        You haven't booked any trips yet. When you do, they'll appear here
                                        organized by date.
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate("/explore")}
                                    className="px-8 py-4 bg-[#0081C9] text-white font-bold rounded-2xl hover:bg-[#0071B8] transition shadow-xl shadow-blue-100 hover:shadow-blue-200 transform active:scale-95 duration-200"
                                >
                                    Start Exploring
                                </button>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { icon: Hotel, color: "sky", label: "Hotels", count: "0 Active" },
                                    { icon: Car, color: "emerald", label: "Transport", count: "0 Active" },
                                    { icon: Calendar, color: "violet", label: "Past Trips", count: "History" },
                                ].map((item, idx) => (
                                    <Card key={idx} className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group border-transparent hover:border-slate-200">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-4 bg-${item.color}-50 rounded-2xl group-hover:bg-${item.color}-100 transition-colors duration-300`}>
                                                <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg group-hover:text-primary transition-colors">
                                                    {item.label}
                                                </h4>
                                                <p className="text-sm text-slate-500 font-medium">{item.count}</p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "Final Plan" && (
                        <motion.div
                            key="final-plan"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {!selectedTrip ? (
                                <Card className="mx-14 p-8 min-h-[400px] border border-slate-100 shadow-xl bg-white rounded-[32px]">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-sky-500" />
                                            Trips Ready for Processing
                                        </h2>
                                        <p className="text-slate-500 text-sm">Confirm and book your final itineraries</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {availableTrips.map((trip) => (
                                            <motion.div
                                                key={trip.id}
                                                whileHover={{ y: -8 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setSelectedTrip(trip)}
                                                className="cursor-pointer group h-full"
                                            >
                                                <Card className="overflow-hidden border border-slate-200 hover:border-sky-200 hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                                                    <div className="h-48 overflow-hidden relative">
                                                        <img
                                                            src={tripImages[trip.id] || trip.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop"}
                                                            alt={trip.title}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80" />
                                                        <div className="absolute bottom-4 left-4 text-white">
                                                            <h3 className="font-bold text-lg mb-0.5">{trip.title}</h3>
                                                            <div className="flex items-center gap-2 text-xs font-medium text-white/90">
                                                                <Calendar className="w-3 h-3" />
                                                                {trip.destination}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 flex-1 bg-white">
                                                        <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                                                            <span className="bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">{trip.suggestions?.flights?.length || 0} Flights</span>
                                                            <span className="bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">{trip.suggestions?.hotels?.length || 0} Hotels</span>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                </Card>
                            ) : (
                                <div className="flex flex-col xl:flex-row gap-8 items-start">
                                    {/* LEFT COLUMN: SUGGESTIONS */}
                                    <div className="flex-1 w-full min-w-0 space-y-6">
                                        {/* Header Card */}
                                        {(() => {
                                            const suggestions = selectedTrip.suggestions || { flights: [], hotels: [], transport: [] };
                                            const completedCount = [
                                                (suggestions.flights || []).some(f => bookedItemIds.includes(f.id)),
                                                (suggestions.hotels || []).some(h => bookedItemIds.includes(h.id)),
                                                (suggestions.transport || []).some(t => bookedItemIds.includes(t.id)),
                                                bookedItemIds.includes(401)
                                            ].filter(Boolean).length;

                                            return (
                                                <Card className="p-6 rounded-[28px] border border-slate-100 shadow-sm bg-white sticky top-6 z-30">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-5">
                                                            <button
                                                                onClick={() => setSelectedTrip(null)}
                                                                className="p-3 hover:bg-slate-50 border border-slate-200/60 rounded-2xl transition-all group shadow-sm bg-white flex items-center justify-center"
                                                            >
                                                                <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
                                                            </button>
                                                            <div>
                                                                <div className="flex items-center gap-3 mb-0.5">
                                                                    <h2 className="text-2xl font-black text-[#0B1527] tracking-tight">
                                                                        {selectedTrip.title}
                                                                    </h2>
                                                                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2.5 py-1 rounded-lg border border-emerald-100 uppercase tracking-wider">
                                                                        Final Plan
                                                                    </span>
                                                                </div>
                                                                <p className="text-slate-400 text-sm font-medium">{selectedTrip.destination} · Build your perfect trip</p>
                                                            </div>
                                                        </div>

                                                        <div className="hidden md:flex flex-col items-end gap-1.5">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-sm font-bold text-slate-900">{completedCount} of 4 completed</span>
                                                                <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${(completedCount / 4) * 100}%` }}
                                                                        className="h-full bg-emerald-500 rounded-full"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Booking Progress</p>
                                                        </div>
                                                    </div>
                                                </Card>
                                            );
                                        })()}

                                        {/* FLIGHT SECTION */}
                                        <Card className="p-7 rounded-[28px] border border-slate-100 shadow-sm bg-white">
                                            <div id="section-travel" className="scroll-mt-24">
                                                <div className="flex items-baseline justify-between mb-6">
                                                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                                        <Plane className="w-5 h-5 text-[#0081C9]" />
                                                        Find Your Flight
                                                    </h3>
                                                    <span className="text-xs font-bold text-[#0081C9] bg-sky-50 px-2 py-0.5 rounded-md">Step 1 of 3</span>
                                                </div>
                                                <div className="space-y-4">
                                                    {(() => {
                                                        const flights = selectedTrip.suggestions?.flights || [];
                                                        const confirmed = flights.filter(f => bookedItemIds.includes(f.id));
                                                        const suggestions = flights.filter(f => !bookedItemIds.includes(f.id));

                                                        return (
                                                            <>
                                                                {confirmed.length > 0 && confirmed.map(flight => (
                                                                    <Card key={flight.id} className="p-4 border-emerald-500 bg-emerald-50/20 flex gap-4 items-center">
                                                                        <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                                                            <Plane className="w-5 h-5" />
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <div className="flex justify-between items-center">
                                                                                <div>
                                                                                    <p className="text-xs font-bold text-emerald-600 uppercase">Booked Flight</p>
                                                                                    <h4 className="font-bold text-slate-900">{flight.airline} · {flight.time}</h4>
                                                                                </div>
                                                                                <button onClick={() => toggleBooking(flight.id)} className="text-xs font-medium text-slate-400 hover:text-red-500">
                                                                                    Change
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </Card>
                                                                ))}
                                                                {suggestions.length > 0 && (
                                                                    <div className="space-y-4">
                                                                        {confirmed.length > 0 && (
                                                                            <div className="flex items-center gap-2 px-1">
                                                                                <div className="h-px bg-slate-100 flex-1"></div>
                                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Other AI Suggestions</span>
                                                                                <div className="h-px bg-slate-100 flex-1"></div>
                                                                            </div>
                                                                        )}
                                                                        <div className="grid grid-cols-1 gap-3">
                                                                            {suggestions.map((flight, idx) => (
                                                                                <div key={flight.id} className={`p-4 rounded-2xl border transition-all flex items-center justify-between group ${confirmed.length === 0 && idx === 0 ? 'bg-sky-50/30 border-sky-100 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                                                                                    <div className="flex items-center gap-4">
                                                                                        <div className="text-center min-w-[60px]">
                                                                                            <p className="text-sm font-bold text-slate-900">{flight.time?.split(' - ')[0] || "TBD"}</p>
                                                                                            <p className="text-[10px] font-medium text-slate-400">Departure</p>
                                                                                        </div>
                                                                                        <div className="h-px w-8 bg-slate-200" />
                                                                                        <div>
                                                                                            <div className="flex items-center gap-2">
                                                                                                <p className="font-bold text-slate-800 text-sm">{flight.airline}</p>
                                                                                                {confirmed.length === 0 && idx === 0 && <span className="bg-sky-100 text-sky-600 text-[9px] font-bold px-1.5 py-0.5 rounded">AI PICK</span>}
                                                                                            </div>
                                                                                            <p className="text-xs text-slate-500">{flight.duration} · Non-stop</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-4">
                                                                                        <p className="font-bold text-slate-900">{flight.price}</p>
                                                                                        <button onClick={() => toggleBooking(flight.id)} className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:shadow-lg transition-all active:scale-95">
                                                                                            Select
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </Card>

                                        {/* HOTEL SECTION */}
                                        <Card className="p-7 rounded-[28px] border border-slate-100 shadow-sm bg-white">
                                            <div id="section-stay" className="scroll-mt-24">
                                                <div className="flex items-baseline justify-between mb-6">
                                                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                                        <Bed className="w-5 h-5 text-indigo-500" />
                                                        Pick your stay
                                                    </h3>
                                                    <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">Step 2 of 3</span>
                                                </div>
                                                <div className="space-y-4">
                                                    {(() => {
                                                        const hotels = selectedTrip.suggestions?.hotels || [];
                                                        const confirmed = hotels.filter(h => bookedItemIds.includes(h.id));
                                                        const suggestions = hotels.filter(h => !bookedItemIds.includes(h.id));

                                                        return (
                                                            <>
                                                                {confirmed.length > 0 && confirmed.map(hotel => (
                                                                    <Card key={hotel.id} className="p-0 border-emerald-500 bg-emerald-50/20 flex overflow-hidden">
                                                                        <img src={hotel.image} className="w-32 h-24 object-cover" alt="" />
                                                                        <div className="flex-1 p-4">
                                                                            <div className="flex justify-between items-start">
                                                                                <div>
                                                                                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Booked Hotel</p>
                                                                                    <h4 className="font-bold text-slate-900">{hotel.name}</h4>
                                                                                    <p className="text-xs text-slate-500">{hotel.rating} Stars · 4 Nights</p>
                                                                                </div>
                                                                                <button onClick={() => toggleBooking(hotel.id)} className="text-xs font-medium text-slate-400 hover:text-red-500">
                                                                                    Change
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </Card>
                                                                ))}
                                                                {suggestions.length > 0 && (
                                                                    <div className="space-y-4">
                                                                        {confirmed.length > 0 && (
                                                                            <div className="flex items-center gap-2 px-1">
                                                                                <div className="h-px bg-slate-100 flex-1"></div>
                                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Other AI Suggestions</span>
                                                                                <div className="h-px bg-slate-100 flex-1"></div>
                                                                            </div>
                                                                        )}
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                            {suggestions.map((hotel, idx) => (
                                                                                <div key={hotel.id} className={`p-3 rounded-2xl border transition-all flex gap-4 group ${confirmed.length === 0 && idx === 0 ? 'bg-indigo-50/30 border-indigo-100' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
                                                                                    <img src={hotel.image} className="w-20 h-20 rounded-xl object-cover" alt="" />
                                                                                    <div className="flex-1">
                                                                                        <div className="flex items-center gap-1.5 mb-0.5">
                                                                                            <h4 className="font-bold text-slate-800 text-sm truncate">{hotel.name}</h4>
                                                                                            {confirmed.length === 0 && idx === 0 && <span className="bg-indigo-100 text-indigo-600 text-[8px] font-bold px-1 py-0.5 rounded shadow-sm">TOP CHOICE</span>}
                                                                                        </div>
                                                                                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-2">
                                                                                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                                                            {hotel.rating} · {hotel.price}
                                                                                        </div>
                                                                                        <button onClick={() => toggleBooking(hotel.id)} className="w-full py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:shadow-lg transition-all active:scale-95">
                                                                                            Select Hotel
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </Card>
                                    </div>

                                    {/* RIGHT COLUMN: ITINERARY SUMMARY */}
                                    <div className="w-full xl:w-[480px] flex-shrink-0">
                                        <div className="sticky top-6">
                                            <Card className="rounded-[32px] border border-slate-100 shadow-2xl bg-white max-h-[calc(100vh-48px)] flex flex-col overflow-hidden">
                                                {/* Header */}
                                                <div className="p-6 pb-2 shrink-0 bg-white shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] z-20">
                                                    <div className="mb-2 pl-2">
                                                        <h3 className="font-extrabold text-[#0B1527] text-[28px] tracking-tight mb-1">Itinerary</h3>
                                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{selectedTrip.destination}</p>
                                                    </div>
                                                </div>

                                                {/* Scrollable Body */}
                                                <div className="flex-1 overflow-y-auto p-8 pt-4 no-scrollbar space-y-6">
                                                    {(() => {
                                                        const itinerary = selectedTrip.itinerary || { days: [] };
                                                        const dayEntries = Array.isArray(itinerary.days)
                                                            ? itinerary.days.map((d, i) => [i, d])
                                                            : Object.entries(itinerary.days || {});

                                                        return dayEntries.map(([dayKey, day], dayIdx) => (
                                                            <Card key={dayKey} className="p-0 border-slate-50 bg-[#F8FAFC]/30 rounded-[32px] overflow-hidden">
                                                                {/* Day Header */}
                                                                <div className="sticky top-0 bg-white/80 backdrop-blur-md p-4 pb-2 flex items-center justify-between transition-all z-10 border-b border-slate-50 shadow-sm">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-full bg-[#0081C9] text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-blue-100">{dayIdx + 1}</div>
                                                                        <div>
                                                                            <h4 className="font-bold text-[#0B1527] text-sm">{day.title || `Day ${dayIdx + 1}`}</h4>
                                                                            <p className="text-[10px] text-slate-400 font-medium">{(day.activities || day.items || []).length} stops</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="w-7 h-7 flex items-center justify-center bg-white border border-slate-50 rounded-full text-slate-400 shadow-sm">
                                                                        <ChevronDown className="w-4 h-4" />
                                                                    </div>
                                                                </div>

                                                                {/* Stop Cards */}
                                                                <div className="p-4 pt-4 space-y-3">
                                                                    {(day.activities || day.items || []).map((item, i) => (
                                                                        <div key={i} className="group bg-white p-2.5 rounded-[20px] border border-slate-50 shadow-sm hover:shadow-md transition-all flex gap-3.5 cursor-pointer">
                                                                            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105 duration-500">
                                                                                <img 
                                                                                    src={item.img || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop"} 
                                                                                    alt={item.title} 
                                                                                    className="w-full h-full object-cover" 
                                                                                />
                                                                            </div>
                                                                            <div className="flex-1 flex flex-col justify-center min-w-0">
                                                                                <h5 className="font-bold text-[#0B1527] text-[15px] truncate">{item.title}</h5>
                                                                                <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 w-fit rounded-md text-slate-500 mt-1">
                                                                                    <Clock className="w-3 h-3" />
                                                                                    <span className="text-[11px] font-bold">{item.time || "TBD"}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </Card>
                                                        ));
                                                    })()}
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === "Explore and Book" && (
                        <motion.div
                            key="explore-book"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-8"
                        >
                            <Card className="mx-14 p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px] border-dashed border-2 border-slate-200 bg-sky-50/20 rounded-[32px]">
                                <div className="bg-white p-6 rounded-full shadow-md ring-1 ring-sky-100">
                                    <Search className="w-12 h-12 text-[#0081C9]" />
                                </div>
                                <div className="max-w-md space-y-2">
                                    <h2 className="text-2xl font-bold text-[#0B1527]">
                                        Explore and Book
                                    </h2>
                                    <p className="text-slate-500 font-medium">
                                        Browse all available activities and book them individually.
                                    </p>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Bookings;
