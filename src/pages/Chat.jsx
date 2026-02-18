import React, { useState } from "react";
import { Send, Plane, MapPin, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";

import { derivedSelectedPlaces } from "../data/placesFromItinerary";
import { itinerary } from "../data/itinerary";


const messagesInit = [
  {
    id: 1,
    from: "bot",
    text:
      "Yo, I'm your Vibe AI. Tell me what kind of energy you’re looking for. " +
      "Chaotic? Chill? Luxury? Or just ‘survive the weekend’?",
  },
];


const nearbyPlaces = [
  {
    id: 1,
    name: "Eiffel Tower Area",
    desc: "Iconic views, cafés, evening walks",
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Montmartre",
    desc: "Art streets, cafés, city views",
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Le Marais",
    desc: "Boutiques, food, historic vibes",
    img: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Eiffel Tower Area",
    desc: "Iconic views, cafés, evening walks",
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Eiffel Tower Area",
    desc: "Iconic views, cafés, evening walks",
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=900&auto=format&fit=crop",
  },
];

export default function Chat() {
  const [activeDay, setActiveDay] = useState("All days");
  const [activePlaceId, setActivePlaceId] = useState(
    derivedSelectedPlaces[0].id
  );
  const [activeNearbyId, setActiveNearbyId] = useState(nearbyPlaces[0].id);
  const [messages, setMessages] = useState(messagesInit);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("itinerary");
  const [placeIndex, setPlaceIndex] = useState(0);

  const places = itinerary.days;
  const currentPlace = places[placeIndex];
  const currentNearby = nearbyPlaces.find((p) => p.id === activeNearbyId);
  const selectedPlace = derivedSelectedPlaces.find(
    (p) => p.id === activePlaceId
  );

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((m) => [...m, { id: m.length + 1, from: "user", text: input }]);
    setInput("");
  };
  const handleNewChat = () => {
    setMessages(messagesInit);
    setInput("");
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="h-full w-full bg-white flex flex-col"
    >
      <header className="h-8 flex items-center" />

      <main className="flex-1 w-full px-20">
        <div
          className="h-full grid gap-8"
          style={{ gridTemplateColumns: "64% 36%" }}
        >
          {/* CHAT */}
          <section>
            <div className="h-[570px] rounded-[32px] bg-white shadow-2xl border border-slate-100 flex flex-col">
              {/* HEADER */}
              <div className="px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold">
                    Travixo
                  </div>
                  <div>
                    <div className="font-semibold">Trap Vibe AI</div>
                    <div className="text-[12px] text-slate-500 font-semibold">
                      Knows vibes, not visas
                    </div>
                  </div>
                </div>

                {/* NEW CHAT BUTTON */}
                <button
                  onClick={handleNewChat}
                  className="text-m font-semibold border text-white bg-sky-600 hover:text-sky-700 hover:bg-sky-50 px-3 py-1 rounded-full transition"
                >
                  + New Chat
                </button>
              </div>

              {/* MESSAGES */}
              <div className="flex-1 px-8 overflow-y-auto">
                <div className="inline-block max-w-[75%] rounded-2xl bg-sky-50 px-5 py-4 text-sm shadow">
                  {messages[0].text}
                </div>
              </div>

              {/* INPUT */}
              <form onSubmit={send} className="px-10 pb-8">
                <div className="flex items-center gap-3 bg-sky-50 rounded-full px-6 py-3 shadow-inner">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe your vibe"
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                  <button
                    type="submit"
                    className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* ITINERARY */}
          <aside>
            <div className="h-[570px] rounded-[32px] bg-white shadow-2xl border border-slate-100 flex flex-col relative">
              {/* TABS */}
              <div className="px-11 pt-6 flex justify-between">
                <div className="flex gap-2 text-s font-semibold">
                  <button
                    onClick={() => setActiveTab("itinerary")}
                    className={`px-5 py-1.5 rounded-full border transition-all duration-200 ${activeTab === "itinerary"
                      ? "bg-slate-900 text-white border-sky-500"
                      : "bg-white text-slate-800 border-sky-200 hover:bg-sky-100 hover:border-sky-400"
                      }`}
                  >
                    Live Itinerary
                  </button>

                  <button
                    onClick={() => setActiveTab("places")}
                    className={`px-4 py-1.5 rounded-full border transition-all duration-200 ${activeTab === "places"
                      ? "bg-slate-900 text-white border-sky-500"
                      : "bg-white text-slate-600 border-sky-200 hover:bg-sky-100 hover:border-sky-400"
                      }`}
                  >
                    Places
                  </button>

                  <button
                    onClick={() => setActiveTab("nearby")}
                    className={`px-4 py-1.5 rounded-full border transition-all duration-200 ${activeTab === "nearby"
                      ? "bg-slate-900 text-white border-sky-500"
                      : "bg-white text-slate-600 border-sky-200 hover:bg-sky-100 hover:border-sky-400"
                      }`}
                  >
                    Explore Nearby
                  </button>
                </div>
              </div>

              {/* LIVE ITINERARY TAB */}
              <AnimatePresence mode="wait">
                {activeTab === "itinerary" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute top-[70px] left-1/2 -translate-x-1/2 w-[85%] z-20"
                  >
                    {/* DAY FILTER — OUTSIDE CARD */}
                    <div
                      className="
          sticky top-[-16px] z-30
          mb-4
          px-2
          py-3
          bg-white
          rounded-2xl
          shadow-sm
          flex gap-2
          overflow-x-auto no-scrollbar
        "
                    >
                      {[
                        "All days",
                        "Day 1",
                        "Day 2",
                        "Day 3",
                        "Day 4",
                        "Day 5",
                      ].map((day) => (
                        <button
                          key={day}
                          onClick={() => setActiveDay(day)}
                          className={`px-4 py-1.5 text-xs font-semibold rounded-full border whitespace-nowrap transition ${activeDay === day
                            ? "bg-sky-600 text-white border-sky-500"
                            : "bg-white text-slate-600 border-slate-300 hover:border-sky-400"
                            }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>

                    {/* BIG FLOATING CARD */}
                    <div className="rounded-3xl bg-white shadow-2xl px-6 py-5 space-y-4 max-h-[55vh] overflow-y-auto no-scrollbar">
                      {/* ITINERARY ITEMS */}
                      {itinerary.days.map((d) => {
                        const Icon = d.icon;

                        return (
                          <motion.div
                            key={d.id}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="flex gap-4 items-stretch"
                          >
                            {/* TIMELINE */}
                            <div className="flex flex-col items-center">
                              <div
                                className="
                    h-4 w-4
                    rounded-full
                    border-2 border-sky-600
                    bg-transparent
                    flex items-center justify-center
                  "
                              >
                                {d.id === 1 && (
                                  <Plane size={10} className="text-sky-600" />
                                )}
                              </div>

                              {d.id !== itinerary.days.length && (
                                <div className="flex-1 w-px border-l-2 border-dotted border-sky-300 mt-1" />
                              )}
                            </div>

                            {/* CARD */}
                            <motion.div
                              whileHover={{ y: -4 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                              }}
                              className="
                  relative
                  flex items-center gap-4
                  w-full
                  rounded-2xl
                  bg-white
                  px-6 py-2
                  shadow-xl
                  border border-slate-100
                  hover:shadow-2xl
                  transition-all
                "
                            >
                              {/* LEFT CONTENT */}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 text-[11px] text-sky-600 font-medium uppercase tracking-wide">
                                  <Icon size={14} /> {d.time}
                                </div>

                                <div className="font-semibold text-[15px] text-slate-800 mt-1">
                                  {d.title}
                                </div>

                                <div className="text-xs text-slate-400">
                                  {d.place}
                                </div>
                              </div>

                              {/* RIGHT IMAGE */}
                              <img
                                src={d.img}
                                alt={d.title}
                                className="
                    h-16 w-16
                    rounded-2xl
                    object-cover
                    shadow-lg
                    ring-4 ring-white
                    translate-y-[-2px]
                  "
                              />
                            </motion.div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* PLACES TAB */}
              <AnimatePresence mode="wait">
                {activeTab === "places" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute top-[90px] left-1/2 -translate-x-1/2 w-[85%] z-20"
                  >
                    <div className="rounded-3xl bg-white shadow-2xl px-6 py-1">
                      <div className="flex justify-between mb-3">
                        <p className="text-sm font-semibold">
                          Places from this plan
                        </p>
                        <p className="text-xs text-sky-700 font-semibold">
                          As planned · Day {currentPlace.id}
                        </p>
                      </div>

                      <div className="relative">
                        {/* LEFT */}
                        <button
                          onClick={() =>
                            setPlaceIndex((i) => Math.max(i - 1, 0))
                          }
                          disabled={placeIndex === 0}
                          className="
    absolute left-[-50px] top-1/2 -translate-y-1/2
    h-9 w-9 rounded-full
    bg-sky-600
    flex items-center justify-center
    shadow-md
    transition
    hover:bg-sky-700
    disabled:opacity-90
  "
                        >
                          <ChevronLeft size={20} className="text-white" />
                        </button>

                        <button
                          onClick={() =>
                            setPlaceIndex((i) =>
                              Math.min(i + 1, places.length - 1)
                            )
                          }
                          disabled={placeIndex === places.length - 1}
                          className="
    absolute right-[-50px] top-1/2 -translate-y-1/2
    h-9 w-9 rounded-full
    bg-sky-600
    flex items-center justify-center
    shadow-md
    transition
    hover:bg-sky-700
    disabled:opacity-40
  "
                        >
                          <ChevronRight size={20} className="text-white" />
                        </button>

                        <AnimatePresence mode="wait">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="relative mb-3"
                          >
                            {/* IMAGE */}
                            <img
                              src={selectedPlace.img}
                              alt={selectedPlace.name}
                              className="h-[160px] w-full object-cover rounded-2xl"
                            />

                            {/* IMAGE DESCRIPTION */}
                            <div
                              className="absolute bottom-0 left-0 right-0
                    rounded-b-2xl
                    bg-gradient-to-t from-black/60 to-transparent
                    px-4 py-3"
                            >
                              <p className="text-sm font-semibold text-white">
                                {selectedPlace.name}
                              </p>
                              <p className="text-xs text-white/80">
                                {selectedPlace.desc}
                              </p>
                            </div>
                          </motion.div>
                        </AnimatePresence>

                        {/* OTHER PLACES */}
                        <div className="mt-4 space-y-2 max-h-[240px] overflow-y-auto pr-1 no-scrollbar">
                          {derivedSelectedPlaces
                            .filter((p) => p.id !== activePlaceId)
                            .slice(0, 4)
                            .map((p) => (
                              <motion.button
                                key={p.id}
                                onClick={() => setActivePlaceId(p.id)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.96 }}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition"
                              >
                                <img
                                  src={p.img}
                                  alt={p.name}
                                  className="h-12 w-12 rounded-lg object-cover"
                                />
                                <div className="text-left">
                                  <p className="text-xs font-semibold text-slate-800">
                                    {p.name}
                                  </p>
                                  <p className="text-[11px] text-slate-500">
                                    {p.desc}
                                  </p>
                                </div>
                              </motion.button>
                            ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* EXPLORE NEARBY TAB */}
              <AnimatePresence mode="wait">
                {activeTab === "nearby" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute top-[90px] left-1/2 -translate-x-1/2 w-[85%] z-20"
                  >
                    <div className="rounded-3xl bg-white shadow-2xl px-6 py-1">
                      {/* HEADER */}
                      <div className="flex justify-between mb-3">
                        <p className="text-sm font-semibold">Explore nearby</p>
                        <p className="text-xs text-sky-700 font-semibold">
                          Optional · Day {currentPlace.id}
                        </p>
                      </div>

                      <div className="relative">
                        {/* LEFT */}
                        <button
                          onClick={() =>
                            setPlaceIndex((i) => Math.max(i - 1, 0))
                          }
                          disabled={placeIndex === 0}
                          className="
    absolute left-[-50px] top-1/2 -translate-y-1/2
    h-9 w-9 rounded-full
    bg-sky-600
    flex items-center justify-center
    shadow-md
    transition
    hover:bg-sky-700
    disabled:opacity-90
  "
                        >
                          <ChevronLeft size={20} className="text-white" />
                        </button>

                        {/* RIGHT */}
                        <button
                          onClick={() =>
                            setPlaceIndex((i) =>
                              Math.min(i + 1, places.length - 1)
                            )
                          }
                          disabled={placeIndex === places.length - 1}
                          className="
    absolute right-[-50px] top-1/2 -translate-y-1/2
    h-9 w-9 rounded-full
    bg-sky-600
    flex items-center justify-center
    shadow-md
    transition
    hover:bg-sky-700
    disabled:opacity-40
  "
                        >
                          <ChevronRight size={20} className="text-white" />
                        </button>

                        {/* MAIN IMAGE */}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeNearbyId}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="relative mb-3"
                          >
                            {/* IMAGE */}
                            <img
                              src={currentNearby.img}
                              alt={currentNearby.name}
                              className="h-[160px] w-full object-cover rounded-2xl"
                            />

                            {/* IMAGE DESCRIPTION */}
                            <div
                              className="absolute bottom-0 left-0 right-0
                    rounded-b-2xl
                    bg-gradient-to-t from-black/60 to-transparent
                    px-4 py-3"
                            >
                              <p className="text-sm font-semibold text-white">
                                {currentNearby.name}
                              </p>
                              <p className="text-xs text-white/80">
                                {currentNearby.desc}
                              </p>
                            </div>
                          </motion.div>
                        </AnimatePresence>

                        {/* OTHER NEARBY OPTIONS */}
                        <div className="mt-4 space-y-2 max-h-[240px] overflow-y-auto pr-1 no-scrollbar">
                          {nearbyPlaces
                            .filter((p) => p.id !== currentNearby.id)
                            .slice(0, 4)
                            .map((p) => (
                              <motion.button
                                key={p.id}
                                onClick={() => setActiveNearbyId(p.id)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.96 }}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition"
                              >
                                <img
                                  src={p.img}
                                  alt={p.name}
                                  className="h-12 w-12 rounded-lg object-cover"
                                />
                                <div className="text-left">
                                  <p className="text-xs font-semibold text-slate-800">
                                    {p.name}
                                  </p>
                                  <p className="text-[11px] text-slate-500">
                                    {p.desc}
                                  </p>
                                </div>
                              </motion.button>
                            ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-white rounded-b-[32px]" />
            </div>
          </aside>
        </div>
      </main>
    </motion.div>
  );
}
