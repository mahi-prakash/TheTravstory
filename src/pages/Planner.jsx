// src/pages/Planner.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import { useTrip } from "../context/TripContext";

const Planner = () => {
  const { tripId } = useParams();
  const { trips, setActiveTrip, activeTripId, addItemToTrip } = useTrip();
  const trip = trips.find((t) => t.id === tripId) || trips[0];
  const [selectedDay, setSelectedDay] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [newType, setNewType] = useState("activity");
  const [newTitle, setNewTitle] = useState("");

  if (!trip) {
    return (
      <p className="text-sm text-slate-500">No trip yet. Start from Chat.</p>
    );
  }
  if (activeTripId !== trip.id) setActiveTrip(trip.id);

  const day = trip.itinerary[selectedDay];

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addItemToTrip(trip.id, selectedDay, {
      type: newType,
      time: "Custom",
      title: newTitle.trim(),
      meta: "Added manually",
    });
    setNewTitle("");
    setModalOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-0.5">
        <p className="text-[11px] text-slate-500">
          {trip.locations.join(" · ")} · {trip.dates}
        </p>
        <h1 className="text-lg font-semibold text-slate-900">{trip.title}</h1>
        <p className="text-[11px] text-slate-500">{trip.summary}</p>
      </div>

      <div className="grid grid-cols-[1.1fr,0.9fr] gap-3">
        {/* Left: day by day */}
        <Card className="p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] text-slate-500">Day‑by‑day</p>
            <button className="text-[11px] text-sky-500">View on map</button>
          </div>
          <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar">
            {trip.itinerary.map((d, idx) => (
              <button
                key={d.label}
                onClick={() => setSelectedDay(idx)}
                className={`text-[11px] px-3 py-1.5 rounded-[18px] border ${
                  idx === selectedDay
                    ? "bg-sky-50 border-sky-200 text-sky-700"
                    : "bg-slate-50 border-slate-100 text-slate-500"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto">
            {day.items.map((item, idx) => (
              <div
                key={`${item.title}-${idx}`}
                className="rounded-[18px] bg-slate-50 px-3 py-2 border border-slate-100"
              >
                <p className="text-[10px] text-slate-400">
                  {item.time} · {item.type.toUpperCase()}
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {item.title}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {item.meta}
                </p>
              </div>
            ))}
          </div>
          <Button
            variant="secondary"
            size="md"
            className="w-full mt-2"
            onClick={() => setModalOpen(true)}
          >
            Add / change flight, stay, or activity
          </Button>
        </Card>

        {/* Right: suggestions + budget placeholder */}
        <Card className="p-4 flex flex-col">
          <p className="text-[11px] text-slate-500 mb-2">
            Suggestions from {trip.locations[0]}
          </p>
          <div className="space-y-2 flex-1 overflow-y-auto">
            <div className="rounded-[18px] bg-slate-50 px-3 py-2">
              <p className="text-xs font-semibold text-slate-900">
                French cooking workshop · 3 hours
              </p>
              <p className="text-[11px] text-slate-500">
                Hilltop views, cafés, and market‑to‑table dinner.
              </p>
            </div>
            <div className="rounded-[18px] bg-slate-50 px-3 py-2">
              <p className="text-xs font-semibold text-slate-900">
                Budget rough cut
              </p>
              <p className="text-[11px] text-slate-500">
                Keep around {trip.budget.currency} {trip.budget.roughTotal} for this run.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add to this day"
      >
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            {["flight", "stay", "activity"].map((type) => (
              <button
                key={type}
                className={`flex-1 text-[11px] px-3 py-1.5 rounded-[18px] border ${
                  newType === type
                    ? "bg-sky-50 border-sky-200 text-sky-700"
                    : "bg-slate-50 border-slate-100 text-slate-500"
                }`}
                onClick={() => setNewType(type)}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-500">
              Title / short description
            </label>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="E.g., Eiffel sunset with takeaway crêpes"
              className="text-sm rounded-[18px] bg-slate-50 border border-slate-100 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-300"
            />
          </div>
          <Button variant="primary" size="md" onClick={handleAdd}>
            Add to this day
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Planner;
