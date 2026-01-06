// src/layouts/MainLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "../components/common/BottomNav";
import { useUser } from "../context/UserContext";

const MainLayout = () => {
  const location = useLocation();
  const { user } = useUser();

  const showBottomNav = !["/", "/auth"].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* top bar similar to PDF header strip */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-600 text-[10px] font-bold tracking-[0.25em] uppercase shadow-sm">
              Beta v2.0
            </span>
            <span className="text-slate-500 text-xs md:text-sm font-medium">
              The new standard. Travel without limits.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:block text-right">
              <p className="text-xs font-medium text-slate-900 leading-tight">
                {user.name}
              </p>
              <p className="text-[11px] text-sky-500 leading-tight">
                {user.personalityTag}
              </p>
            </div>
            <div className="h-9 w-9 rounded-full bg-sky-200" />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-5xl px-6 pb-32 pt-6">
        <Outlet />
      </main>

      {showBottomNav && <BottomNav />}
    </div>
  );
};

export default MainLayout;
