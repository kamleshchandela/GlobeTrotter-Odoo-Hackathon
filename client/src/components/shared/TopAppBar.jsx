import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, X, Bell, Shield, Search, Menu } from "lucide-react";
import { useState } from "react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleBack = onBack || (() => navigate(-1));

  if (variant === "logo") {
    return (
      <header className={`sticky top-0 z-50 bg-cream/80 backdrop-blur-xl border-b border-sand transition-all duration-300`}>
        <div className="flex items-center justify-between h-16 px-6 lg:px-10 max-w-[1440px] mx-auto">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 shrink-0">
            <Shield size={20} className="text-banyan" strokeWidth={2} />
            <span className="font-display font-bold text-[22px] text-charcoal tracking-tight hidden sm:block">
              My Itinerary
            </span>
          </Link>

          {/* Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 mx-4">
            {[
              { label: 'Home', path: '/home' },
              { label: 'Explore', path: '/explore' },
              { label: 'Healthcare', path: '/healthcare' },
              { label: 'Trips', path: '/trips/new' },
            ].map(({ label, path }) => {
              const isActive = location.pathname.startsWith(path);
              return (
                <Link
                  key={label}
                  to={path}
                  className={`font-cabinet font-medium text-[15px] relative group ${isActive ? 'text-saffron' : 'text-taupe'}`}
                >
                  {label}
                  <span className={`absolute -bottom-1 left-0 h-[2px] bg-saffron transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
              );
            })}
          </nav>

          {/* Search Bar */}
          <div className="hidden xl:flex w-full max-w-[320px] h-[40px] bg-white border border-sand rounded-full items-center px-4 gap-3 group focus-within:border-saffron focus-within:shadow-[0_4px_14px_-4px_hsl(var(--saffron)/0.25)] transition-all shrink">
            <Search size={16} className="text-taupe group-focus-within:text-saffron transition-colors" />
            <input 
              type="text" 
              placeholder="Search destinations..." 
              className="bg-transparent outline-none w-full font-cabinet font-medium text-[14px] text-charcoal placeholder:text-taupe/70"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {rightContent || (
              <>
                {location.pathname.startsWith('/healthcare') && (
                  <Link to="/healthcare/profile" className="hidden md:flex items-center gap-2 px-3 py-2 hover:bg-sand/30 rounded-full transition-all mr-2">
                    <Shield size={16} className="text-saffron" />
                    <span className="font-cabinet font-semibold text-[14px] text-charcoal">My Health Profile</span>
                  </Link>
                )}
                <button className="relative flex items-center justify-center w-10 h-10 hover:bg-sand/30 rounded-full transition-colors">
                  <Bell size={20} className="text-charcoal" strokeWidth={1.8} />
                  {hasNotification && (
                    <span className="absolute top-2 right-2 w-[8px] h-[8px] rounded-full bg-sindoor border-2 border-cream" />
                  )}
                </button>
                <Link to="/account" className="hidden sm:flex w-9 h-9 rounded-full bg-ivory border-[2px] border-sand items-center justify-center overflow-hidden hover:border-saffron transition-colors">
                  <span className="font-cabinet font-bold text-[14px] text-taupe uppercase">
                    {(authUser?.fullName || authUser?.name || 'T')[0]}
                  </span>
                </Link>
                <button 
                  className="lg:hidden p-1 flex items-center justify-center w-10 h-10 hover:bg-sand/30 rounded-full transition-colors text-charcoal"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 w-full bg-cream border-b border-sand flex flex-col shadow-lg z-40">
            {[
              { label: 'Home', path: '/home' },
              { label: 'Explore', path: '/explore' },
              { label: 'Healthcare', path: '/healthcare' },
              { label: 'Trips', path: '/trips/new' },
              { label: 'Account', path: '/account' },
            ].map(({ label, path }) => {
              const isActive = location.pathname.startsWith(path);
              return (
                <Link
                  key={label}
                  to={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-6 py-4 border-t border-sand/50 font-cabinet font-medium text-[16px] ${isActive ? 'text-saffron bg-sand/20' : 'text-taupe hover:bg-sand/20'}`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </header>
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
