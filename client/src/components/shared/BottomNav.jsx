import { Link, useLocation } from "react-router-dom";
import { Home, Compass, Map, User } from "lucide-react";

const ShieldIcon = ({ size = 28, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
    <path
      d="M12 2.5l8 3v6.2c0 5-3.4 8.6-8 9.8-4.6-1.2-8-4.8-8-9.8V5.5l8-3z"
      stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
    />
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NAV_ITEMS = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/explore", icon: Compass, label: "Explore" },
  { path: "/safety", icon: null, label: "Safety", isCenter: true },
  { path: "/trips/new", icon: Map, label: "Trips" },
  { path: "/profile", icon: User, label: "Profile" },
];

/**
 * BottomNav — Persistent bottom navigation bar with raised Safety center tab.
 * @param {string} activeTab — Override the active tab path (for screens
 *   that don't match by URL, like sub-pages)
 */
export default function BottomNav({ activeTab }) {
  const location = useLocation();
  const currentPath = activeTab || location.pathname;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-sand pb-safe lg:hidden">
      <div className="flex items-end justify-between h-[72px] max-w-[440px] mx-auto px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = currentPath.startsWith(item.path);

          /* Center raised Safety tab */
          if (item.isCenter) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center -mt-5"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(232,100,12,0.18)] ${
                    isActive ? "bg-saffron" : "bg-saffron"
                  }`}
                >
                  <ShieldIcon size={28} className="text-white" />
                </div>
                <span className="font-mono-dm text-[10px] uppercase tracking-wider mt-1 text-saffron">
                  {item.label}
                </span>
              </Link>
            );
          }

          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-end flex-1 h-full pb-2 gap-1"
            >
              <Icon
                size={24}
                className={isActive ? "text-saffron" : "text-[#B09880]"}
                strokeWidth={isActive ? 2.4 : 1.8}
                fill={isActive ? "rgba(232,100,12,0.1)" : "none"}
              />
              <span
                className={`font-mono-dm text-[10px] uppercase tracking-wider ${
                  isActive ? "text-saffron" : "text-[#B09880]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
