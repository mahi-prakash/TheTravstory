import { useState } from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Heart, Bookmark, Grid, MessageCircle } from "lucide-react";

/* ------------------------------------------------------------------ */
/* DATA */
/* ------------------------------------------------------------------ */

const thumbnails = [
  "/place2.jpg",
  "/place3.webp",
  "/place4.webp",
  "/place5.jpg",
];

const reels = [
  {
    image: "/place1.jpg",
    location: "Kyoto, Japan",
    author: "@nomad_jess",
    caption:
      "Found the hidden shrine behind the bamboo forest. Literally zen. #hiddenjapan #kyoto",
  },
  {
    image: "/place2.jpg",
    location: "Osaka, Japan",
    author: "@foodie_sam",
    caption: "Street food heaven 🍜🔥 #osaka #foodtrip",
  },
  {
    image: "/place3.webp",
    location: "Tokyo, Japan",
    author: "@citywalks",
    caption: "Neon nights never disappoint 🌃 #tokyo",
  },
];

const filters = [
  "All places",
  "Near today",
  "Hidden gems",
  "Fiestas",
  "Food Only",
  "On My Route",
];

/* ------------------------------------------------------------------ */
/* LEFT WALL FILTER RAIL */
/* ------------------------------------------------------------------ */

function ExploreFilters() {
  const [active, setActive] = useState("All places");
  const [onMyRoute, setOnMyRoute] = useState(false);

  return (
    <div className="fixed left-46 top-1/2 -translate-y-1/2 z-30 mt-15">
      {/* BACK CARD */}
      <div className="absolute -inset-x-4 -inset-y-6 rounded-[28px] bg-white backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.18)]" />

      {/* FILTER CONTENT */}
      <div className="relative flex flex-col gap-5 px-4 py-8">
        {filters.map((item) => {
          const isActive = active === item;

          /* TOGGLE : ON MY ROUTE */
          if (item === "On My Route") {
            return (
              <div
                key={item}
                className="flex items-center justify-between gap-4 text-[16px] font-medium text-gray-600"
              >
                <span>On My Route</span>

                <button
                  onClick={() => setOnMyRoute(!onMyRoute)}
                  className={`relative w-11 h-6 rounded-full transition ${
                    onMyRoute ? "bg-sky-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      onMyRoute ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            );
          }

          /* CHECKBOX FILTER */
          return (
            <button
              key={item}
              onClick={() => setActive(item)}
              className="flex items-center gap-3 text-[15px] font-medium text-gray-500 hover:text-sky-600 transition"
            >
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                  isActive
                    ? "bg-sky-600 border-sky-600 text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {isActive && <Check size={14} strokeWidth={3} />}
              </div>

              <span className={isActive ? "text-sky-600" : ""}>
                {item}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MAIN PAGE */
/* ------------------------------------------------------------------ */

export default function ExplorePage() {
  return (
    <div className="min-h-screen w-full">
    <div className="relative w-full min-h-screen px-24">
      {/* LEFT FILTERS */}
      <ExploreFilters />

      {/* MAIN FLOATING CARD */}
      <div
        className="
          relative
          mx-auto
          max-w-[1200px]
          translate-x-[45px]
          translate-y-[-5px]
          bg-white/70
          backdrop-blur-xl
          rounded-[44px]
          shadow-[0_40px_120px_rgba(0,0,0,0.18)]
          px-20
          py-8
        "
      >
        <div className="flex items-start justify-center gap-16">
          {/* LEFT MINI THUMBNAILS */}
          <div className="flex flex-col items-center pt-18 text-gray-400">
            <span className="text-xs mb-4">Swipe / scroll</span>

            {thumbnails.map((src, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-[14px] bg-white/60 shadow" />

                  <div className="relative w-12 h-14 rounded-xl overflow-hidden">
                    <img
                      src={src}
                      alt="thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {i !== thumbnails.length - 1 && (
                  <div className="flex flex-col gap-1 py-2">
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CENTER REEL */}
          <div className="relative -mt-2">
            <div className="absolute -inset-3 rounded-[40px] bg-white/60 shadow" />

            {/* SCROLL CONTAINER */}
            <div
              className="
                relative
                w-[360px]
                h-[560px]
                overflow-y-scroll
                overflow-x-hidden
                snap-y
                snap-mandatory
                no-scrollbar
                scroll-smooth
                overscroll-contain
              "
            >
              {reels.map((reel, index) => (
                <motion.div
                  key={index}
                  className="
                    snap-start
                    snap-always
                    relative
                    w-full
                    h-[560px]
                    rounded-[32px]
                    overflow-hidden
                    shadow-[0_30px_80px_rgba(0,0,0,0.25)]
                  "
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* IMAGE */}
                  <img
                    src={reel.image}
                    alt={reel.location}
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* GRADIENT */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* LOCATION */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 rounded-full text-xs">
                    {reel.location}
                  </div>

                  {/* INDEX */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 text-white rounded-full text-xs">
                    {index + 1} / {reels.length}
                  </div>

                  {/* CAPTION */}
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <p className="text-xs opacity-80">{reel.author}</p>
                    <p className="text-sm">{reel.caption}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex flex-col gap-6 mt-40">
            <Action icon={<Heart />} label="12.4k" />
            <Action icon={<Bookmark />} label="84" />
            <Action icon={<MessageCircle />} label="Save to trip" />
            <Action icon={<Grid />} />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ACTION BUTTON */
/* ------------------------------------------------------------------ */

function Action({ icon, label }) {
  return (
    <div className="flex items-center gap-3 text-gray-600 hover:text-gray-900 cursor-pointer transition">
      <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
        {icon}
      </div>

      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
