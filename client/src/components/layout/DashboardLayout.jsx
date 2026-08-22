import { Home, Search, Compass, Shield, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function DashboardLayout({ children, hideActiveTab = false }) {
  const location = useLocation();

  const NAV_ITEMS = [
    { path: "/home", icon: Home, label: "Home" },
    { path: "/search", icon: Search, label: "Search" },
    { path: "/dashboard/discover", icon: Compass, label: "Discover" },
    { path: "/dashboard/safety", icon: Shield, label: "Safety" },
    { path: "/dashboard/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="bg-cream min-h-screen pb-[90px]">
      {/* Top App Bar is handled by individual pages since it fluctuates (like Search bar) */}
      
      {children}

      {/* Persistent Bottom Nav Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-sand shadow-[0_-4px_24px_rgba(30,20,16,0.04)] z-50 rounded-t-[20px] px-2">
        <div className="flex justify-between items-center h-full max-w-md mx-auto relative px-2">
          {NAV_ITEMS.map((item) => {
            const isActive = !hideActiveTab && location.pathname.includes(item.path);
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className="flex flex-col items-center justify-center w-[60px] h-full gap-1.5 relative group"
              >
                {/* Active Indicator Top Pill */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-saffron rounded-b-full shadow-[0_4px_8px_rgba(232,100,12,0.4)]" />
                )}
                
                <Icon 
                  className={`w-6 h-6 transition-all duration-300 ${isActive ? "text-saffron fill-saffron/10 scale-110" : "text-taupe group-hover:text-charcoal"}`} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={`text-[10px] font-cabinet font-semibold tracking-wide transition-colors ${isActive ? "text-saffron" : "text-taupe"}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  );
}
