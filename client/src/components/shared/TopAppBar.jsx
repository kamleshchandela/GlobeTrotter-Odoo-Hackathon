import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ArrowLeft, X, Bell, Shield, Search, Menu, Calendar, Home, Compass, MessageSquare, HeartPulse, Plane } from "lucide-react";
import { useState } from "react";
import { setCalendarOpen } from "../../store/uiSlice";

export default function TopAppBar({
  variant = "logo",
  title,
  rightContent,
  hasNotification = true,
  bgClass = "bg-cream",
  textClass = "text-charcoal",
  onBack,
}) {
  const { user: authUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleBack = onBack || (() => navigate(-1));

  if (variant === "logo") {
    return (
      <>
        {/* Clean, Premium Transparent Top Header */}
        <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-[0_1px_3px_rgba(16,42,67,0.04)] transition-all duration-300">
          <div className="flex items-center justify-between h-16 px-8 lg:px-12 max-w-[1440px] mx-auto">
            {/* Logo Section */}
            <Link to="/home" className="flex items-center gap-2.5 shrink-0 group">
              <img 
                src="/logo.png" 
                alt="GlobeTrotter Logo" 
                className="w-8 h-8 object-contain rounded-lg shadow-sm group-hover:scale-105 transition-transform" 
              />
              <span className="font-display font-extrabold text-[22px] text-charcoal tracking-tight">
                My Itinerary
              </span>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-4 shrink-0">
              {rightContent || (
                <>
                  {location.pathname.startsWith('/healthcare') && (
                    <Link to="/healthcare/profile" className="hidden md:flex items-center gap-2 px-3 py-2 hover:bg-sand/30 rounded-full transition-all">
                      <Shield size={16} className="text-[#E8640C]" />
                      <span className="font-cabinet font-semibold text-[14px] text-charcoal">My Health Profile</span>
                    </Link>
                  )}
                  <button className="relative flex items-center justify-center w-10 h-10 hover:bg-sand/30 rounded-full transition-colors">
                    <Bell size={20} className="text-charcoal" strokeWidth={1.8} />
                    {hasNotification && (
                      <span className="absolute top-2 right-2 w-[8px] h-[8px] rounded-full bg-sindoor border-2 border-white" />
                    )}
                  </button>
                  {/* Calendar Button next to profile */}
                  <button 
                    onClick={() => dispatch(setCalendarOpen(true))}
                    className="relative flex items-center justify-center w-10 h-10 hover:bg-sand/30 rounded-full transition-colors"
                    title="Open Travel Calendar"
                  >
                    <Calendar size={18} className="text-charcoal" strokeWidth={1.8} />
                  </button>
                  <Link to="/account" className="flex w-9 h-9 rounded-full bg-ivory border-[2px] border-sand items-center justify-center overflow-hidden hover:border-[#E8640C] transition-colors">
                    <span className="font-cabinet font-bold text-[14px] text-taupe uppercase">
                      {(authUser?.fullName || authUser?.name || 'T')[0]}
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Glassmorphic Bottom Navigation Dock with Side Curves */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[110] w-full max-w-[480px] pointer-events-none overflow-visible">
          
          {/* Moving Aurora Colors Behind the Glass Dock */}
          <div className="absolute inset-x-0 bottom-0 top-0 -z-10 overflow-hidden rounded-t-[28px] pointer-events-none">
            <div className="absolute -top-4 -left-6 w-44 h-24 bg-[#72D6C4]/40 rounded-full blur-2xl animate-aurora-1" />
            <div className="absolute -bottom-4 -right-6 w-44 h-24 bg-[#F4A261]/35 rounded-full blur-2xl animate-aurora-2" />
            <div className="absolute top-1 left-1/3 w-36 h-20 bg-[#9B8AFB]/30 rounded-full blur-2xl animate-aurora-3" />
          </div>

          <nav className="w-full bg-white/20 backdrop-blur-3xl border-t border-x border-white/25 shadow-[0_-16px_40px_rgba(16,42,67,0.08)] rounded-t-[28px] rounded-b-none px-6 py-3.5 pb-safe flex items-center justify-around pointer-events-auto overflow-visible transition-all duration-300">
            {[
              { label: 'Home', path: '/home', icon: Home, bg: 'bg-amber-100/80 text-amber-700 hover:bg-amber-200' },
              { label: 'Explore', path: '/explore', icon: Compass, bg: 'bg-emerald-100/80 text-emerald-700 hover:bg-emerald-200' },
              { label: 'Community', path: '/community', icon: MessageSquare, bg: 'bg-indigo-100/80 text-indigo-700 hover:bg-indigo-200' },
              { label: 'Healthcare', path: '/healthcare', icon: HeartPulse, bg: 'bg-rose-100/80 text-rose-700 hover:bg-rose-200' },
              { label: 'Plan Trip', path: '/trips/new', icon: Plane, bg: 'bg-sky-100/80 text-sky-700 hover:bg-sky-200' },
            ].map(({ label, path, icon: IconComponent, bg }) => {
              const isActive = location.pathname.startsWith(path);
              return (
                <Link
                  key={label}
                  to={path}
                  className="flex flex-col items-center justify-center group cursor-pointer relative select-none origin-bottom"
                  style={{ touchAction: 'manipulation' }}
                >
                  {/* Floating Tooltip/Label (Similar to LinkedIn reaction tag) */}
                  <span className="absolute -top-10 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 ease-out bg-charcoal text-white text-[10px] font-bold font-cabinet px-2.5 py-1 rounded-full shadow-md pointer-events-none whitespace-nowrap z-50">
                    {label}
                  </span>

                  {/* Circular Reaction Icon Container */}
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.8,0.64,1)] group-hover:-translate-y-6 group-hover:scale-[1.65] group-hover:shadow-lg ${isActive ? 'bg-[#E8640C] text-white shadow-md shadow-[#E8640C]/20 scale-105' : bg}`}>
                    <IconComponent 
                      className={`w-5.5 h-5.5 transition-transform duration-300 group-hover:rotate-3`}
                      strokeWidth={2} 
                    />
                  </div>
                  
                  {/* App Indicator Dot or subtle label placeholder */}
                  <span className={`w-1.5 h-1.5 rounded-full bg-[#E8640C] mt-1.5 transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
                </Link>
              );
            })}
          </nav>
        </div>
      </>
    );
  }

  return (
    <header className={`sticky top-0 z-50 ${bgClass} border-b border-sand`}>
      <div className="flex items-center justify-between h-14 px-5 max-w-[1440px] mx-auto">
        {/* Left */}
        <div className="flex items-center gap-2.5 min-w-[80px]">
          {variant === "back" && (
            <button onClick={handleBack} className="p-1" aria-label="Go back">
              <ArrowLeft size={24} className={textClass} />
            </button>
          )}
          {variant === "close" && (
            <button onClick={handleBack} className="p-1" aria-label="Close">
              <X size={24} className={textClass} />
            </button>
          )}
        </div>

        {/* Center */}
        {title && (
          <h1 className={`font-cabinet font-bold text-[18px] ${textClass} absolute left-1/2 -translate-x-1/2`}>
            {title}
          </h1>
        )}

        {/* Right */}
        <div className="flex items-center gap-3 min-w-[80px] justify-end">
          {rightContent || (
            <>
              <button className="relative p-1" aria-label="Notifications">
                <Bell size={22} className={textClass} />
                {hasNotification && (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-sindoor" />
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
