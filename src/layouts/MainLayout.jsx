// src/layouts/MainLayout.jsx
import { Outlet, useLocation, NavLink } from "react-router-dom";
import { useUser } from "../context/UserContext";

const MainLayout = () => {
  const location = useLocation();
  const isFullWidthPage = location.pathname === "/chat" || location.pathname.startsWith("/planner") || location.pathname === "/profile";
  const { user } = useUser();

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* HEADER (SINGLE SOURCE OF TRUTH) */}
      <header className="border-b border-slate-100 bg-white">
        <div className="w-full px-8 py-3 flex items-center">

          {/* LEFT — BRAND */}
          <div className="flex items-center shrink-0">
            <span className="text-4xl font-extrabold tracking-tight cursor-pointer">
              <span className="text-sky-600">Travi</span>
              <span className="text-slate-900">xo</span>
            </span>
          </div>

          {/* CENTER — NAVIGATION */}
          <nav className="flex-1 flex justify-center">
            <ul className="flex items-center gap-10 text-m font-semibold">
              {[
                { to: "/", label: "Home" },
                { to: "/explore", label: "Explore" },
                { to: "/chat", label: "Chat" },
                { to: "/planner", label: "Planner" },
                { to: "/profile", label: "Profile" },
              ].map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `pb-1 transition ${isActive
                        ? "text-sky-600 border-b-2 border-sky-600"
                        : "text-slate-600 hover:text-sky-700"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* RIGHT — PROFILE */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden md:block text-right">
              <p className="text-lg font-semibold text-slate-900 leading-tight">
                {user.name}
              </p>
              <p className="text-sm text-sky-600 font-medium leading-tight">
                {user.personalityTag}
              </p>
            </div>
            <div className="h-13 w-13 rounded-full bg-sky-600 overflow-hidden">
              <img
                src="/profile2.jpg"
                alt="Travixo"
                className="h-full w-full object-cover"
              />
            </div>

          </div>

        </div>
      </header>

      {/* MAIN CONTENT */}
      <main
        className={
          isFullWidthPage
            ? "flex-1 w-full px-0 pb-0 pt-0 overflow-y-auto"
            : "flex-1 container mx-auto max-w-5xl px-6 pt-6"
        }
      >
        <Outlet />
      </main>
    </div >
  );
};

export default MainLayout;
