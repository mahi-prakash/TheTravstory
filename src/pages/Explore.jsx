// src/pages/Explore.jsx
import React, { useState } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { mockFeed } from "../data/mockFeed";
import { useTrip } from "../context/TripContext";

const locations = ["All places", "Japan", "France"];
const types = ["All types", "Café", "Hotel", "Hidden gem", "City"];

const Explore = () => {
  const [selectedLocation, setSelectedLocation] = useState("All places");
  const [selectedType, setSelectedType] = useState("All types");
  const { activeTrip } = useTrip();

  const filtered = mockFeed.exploreReels.filter((item) => {
    const locationOk =
      selectedLocation === "All places" ||
      item.locationTag === selectedLocation;
    const typeOk =
      selectedType === "All types" ||
      item.type.toLowerCase() === selectedType.toLowerCase();
    return locationOk && typeOk;
  });

  return (
    <div className="max-w-md mx-auto space-y-3">
      <div>
        <p className="text-xs text-slate-500">Trending places</p>
        <h2 className="text-lg font-semibold text-slate-900">
          Short reels from spots you can add to a trip.
        </h2>
      </div>

      <Card className="p-3">
        <p className="text-[11px] text-slate-500 mb-2">Filters</p>
        <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar">
          {locations.map((loc) => (
            <button
              key={loc}
              className={`text-[11px] px-3 py-1.5 rounded-2xl border ${
                selectedLocation === loc
                  ? "bg-sky-50 border-sky-200 text-sky-700"
                  : "bg-slate-50 border-slate-100 text-slate-500"
              }`}
              onClick={() => setSelectedLocation(loc)}
            >
              {loc}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {types.map((type) => (
            <button
              key={type}
              className={`text-[11px] px-3 py-1.5 rounded-2xl border ${
                selectedType === type
                  ? "bg-sky-50 border-sky-200 text-sky-700"
                  : "bg-slate-50 border-slate-100 text-slate-500"
              }`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </Card>

      <div className="space-y-3">
        {filtered.map((reel) => (
          <Card key={reel.id} className="p-3">
            <div className="flex gap-3">
              <div className="w-20 rounded-2xl bg-slate-200" />
              <div className="flex-1 flex flex-col gap-1">
                <p className="text-[11px] text-slate-500">
                  {reel.location} · {reel.type}
                </p>
                <p className="text-sm font-medium text-slate-900 line-clamp-2">
                  {reel.caption}
                </p>
                <p className="text-[11px] text-slate-500">
                  {reel.handle} · {reel.likes} likes · {reel.comments} comments
                </p>
                <div className="mt-2 flex gap-2">
                  <Button variant="secondary" className="px-3 py-1 text-xs">
                    Save
                  </Button>
                  <Button
                    variant="primary"
                    className="px-3 py-1 text-xs"
                    disabled={!activeTrip}
                  >
                    {activeTrip
                      ? `Add to ${activeTrip.locations.join(" · ")} trip`
                      : "Start a trip to add"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Explore;
