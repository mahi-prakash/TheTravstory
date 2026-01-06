import React, { useState } from "react";
import {
  ArrowUpRight,
  Plane,
  MapPin,
  Clock,
  Plus,
} from "lucide-react";

const messagesInit = [
  {
    id: 1,
    from: "bot",
    text:
      "Yo, I'm your Vibe AI. Tell me what kind of energy you’re looking for. " +
      "Chaotic? Chill? Luxury? Or just ‘survive the weekend’?",
  },
];

const itinerary = {
  title: "Paris & London",
  dates: "Oct 12 – Oct 20",
  days: [
    {
      id: 1,
      time: "Airport Pickup · 09:00 AM",
      title: "Day 1: Paris – Arrival & Check-in",
      place: "CDG Terminal 2",
      icon: Plane,
    },
    {
      id: 2,
      time: "Louvre Museum Tour · 10:00 AM – 06:00 PM",
      title: "Day 2: Paris – Culture & Cuisine",
      place: "Louvre Museum",
      icon: MapPin,
    },
    {
      id: 3,
      time: "Eurostar · 08:30 PM",
      title: "Day 3: London – Travel to UK",
      place: "Gare du Nord",
      icon: Clock,
    },
  ],
};

export default function Chat() {
  const [messages, setMessages] = useState(messagesInit);
  const [input, setInput] = useState("");

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((m) => [...m, { id: m.length + 1, from: "user", text: input }]);
    setInput("");
  };

  return (
   <div className="h-screen overflow-hidden bg-gradient-to-b from-sky-50 via-sky-100 to-white">

      <header className="h-16 flex items-center justify-between">
  <div className="w-full max-w-[1650px] px-12 flex gap-12">

    <div className="flex items-center gap-2 text-lg font-semibold">
      TRAP
      <span className="h-2 w-2 rounded-full bg-sky-500" />
    </div>

    <div className="flex items-center gap-3 text-sm">
      <div className="text-right">
        <div className="font-semibold">Jane Doe</div>
        <div className="text-sky-500 text-xs">The Explorer</div>
      </div>
      <div className="h-9 w-9 rounded-full bg-sky-200" />
    </div>
  </div>
</header>



      {/* MAIN */}
    <main className="flex-1 flex justify-center pb-10 pl-6">

  <div className="w-full max-w-[1400px] px-10 flex gap-10">


          {/* CHAT CARD */}
          <section className="flex-[1.6]">
            <div className="h-full rounded-[32px] bg-white/90 shadow-xl backdrop-blur-xl flex flex-col">
              <div className="px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                    AI
                  </div>
                  <div>
                    <div className="font-semibold">Trap Vibe AI</div>
                    <div className="text-xs text-slate-400">
                      Knows vibes, not visas
                    </div>
                  </div>
                </div>
              </div>

              {/* MESSAGE */}
              <div className="flex-1 px-8">
                <div className="inline-block max-w-[75%] rounded-2xl bg-slate-100 px-5 py-4 text-sm shadow">
                  {messages[0].text}
                </div>
              </div>

              {/* INPUT */}
              <form onSubmit={send} className="px-8 pb-8">
                <div className="flex items-center gap-3 bg-slate-50 rounded-full px-6 py-3 shadow-inner">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe your vibe (e.g. ‘Cyberpunk Tokyo weekend’)"
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                  <button className="h-9 w-9 rounded-full bg-sky-500 text-white flex items-center justify-center">
                    <ArrowUpRight size={18} />
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* ITINERARY CARD */}
          <aside className="flex-[0.9]">
            <div className="h-full rounded-[32px] bg-white/90 shadow-xl backdrop-blur-xl flex flex-col">
              <div className="px-8 py-6 flex justify-between">
                <div>
                  <div className="text-xs tracking-widest text-sky-500 font-semibold">
                    LIVE ITINERARY
                  </div>
                  <div className="text-xs text-slate-400">
                    Draft · {itinerary.dates}
                  </div>
                </div>
                <button className="border rounded-full px-3 py-1 text-xs flex items-center gap-1">
                  <Plus size={12} /> Add day
                </button>
              </div>

              <div className="px-8 space-y-4">
                <div>
                  <div className="font-semibold">{itinerary.title}</div>
                  <div className="text-xs text-slate-400">
                    Generated from your vibe
                  </div>
                </div>

                {itinerary.days.map((d) => {
                  const Icon = d.icon;
                  return (
                    <div
                      key={d.id}
                      className="rounded-2xl border bg-slate-50 px-4 py-3 space-y-1"
                    >
                      <div className="flex items-center gap-2 text-xs text-sky-600 font-semibold">
                        <Icon size={14} /> {d.time}
                      </div>
                      <div className="font-semibold text-sm">{d.title}</div>
                      <div className="text-xs text-slate-400">{d.place}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
