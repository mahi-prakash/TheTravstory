// src/pages/Profile.jsx
import React from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { useUser } from "../context/UserContext";
import { useTrip } from "../context/TripContext";

const Profile = () => {
  const { user } = useUser();
  const { trips } = useTrip();

  return (
    <div className="max-w-md mx-auto space-y-3">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-sky-200" />
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {user.name}
              </p>
              <p className="text-[11px] text-slate-500">
                {user.personalityTag}
              </p>
            </div>
          </div>
          <Button variant="ghost" className="text-xs px-2 py-1">
            Edit profile
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="rounded-2xl bg-slate-50 px-3 py-2">
            <p className="text-xs font-semibold text-slate-900">
              {user.stats.countries}
            </p>
            <p className="text-[11px] text-slate-500">Countries</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-3 py-2">
            <p className="text-xs font-semibold text-slate-900">
              {user.stats.trips}
            </p>
            <p className="text-[11px] text-slate-500">Trips</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-3 py-2">
            <p className="text-xs font-semibold text-slate-900">
              {user.stats.savedSpots}
            </p>
            <p className="text-[11px] text-slate-500">Saved spots</p>
          </div>
        </div>
        <p className="text-[11px] text-slate-500">
          Based in {user.basedIn} · Home airport {user.homeAirport} · Member
          since {user.memberSince}
        </p>
      </Card>

      <Card className="p-4">
        <p className="text-xs text-slate-500 mb-2">Upcoming trips</p>
        <div className="space-y-2">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="rounded-2xl bg-slate-50 px-3 py-2 border border-slate-100"
            >
              <p className="text-[11px] text-slate-500">
                {trip.locations.join(" · ")} · {trip.dates}
              </p>
              <p className="text-sm font-medium text-slate-900">
                {trip.title}
              </p>
              <p className="text-[11px] text-slate-500">{trip.summary}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <p className="text-xs text-slate-500 mb-2">Bookings overview</p>
        <div className="space-y-1">
          <p className="text-[11px] text-slate-500">
            Flights, stays, and key activities from all upcoming trips show here
            for quick airport‑queue checks.
          </p>
          <div className="rounded-2xl bg-slate-50 px-3 py-2">
            <p className="text-[11px] text-slate-500 mb-0.5">
              Next flight · Sample
            </p>
            <p className="text-sm font-medium text-slate-900">
              BLR → CDG · Oct 12 · 09:40
            </p>
            <p className="text-[11px] text-slate-500">
              AF1234 · Economy · Confirmed
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <p className="text-xs text-slate-500 mb-2">Memories</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-20 rounded-2xl bg-emerald-100" />
          <div className="h-20 rounded-2xl bg-sky-100" />
          <div className="h-20 rounded-2xl bg-amber-100" />
        </div>
        <p className="text-[11px] text-slate-500 mt-2">
          View‑only. Posts and short clips from trips you’ve already taken.
        </p>
      </Card>
    </div>
  );
};

export default Profile;
