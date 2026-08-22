import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldIcon, Tricolor } from "./Icons";

const links = ["Destinations", "Safety", "Healthcare", "Experiences", "Blog"];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 border-b border-sand transition-all duration-300 ${
        scrolled ? "bg-cream/75 backdrop-blur-xl" : "bg-cream"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 h-16">
        <a href="#" className="flex items-center gap-2">
          <ShieldIcon size={20} className="text-banyan" strokeWidth={2} />
          <span className="font-display font-bold text-[22px] text-charcoal tracking-tight">
            My Itinerary
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l}
              onClick={() => {
                const id = l.toLowerCase();
                const element = document.getElementById(id);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="font-cabinet font-medium text-[15px] text-taupe relative group cursor-pointer"
            >
              {l}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-saffron transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/auth/login"
            className="hidden sm:inline-flex items-center justify-center h-10 px-5 rounded-lg border border-saffron/40 bg-transparent text-saffron font-cabinet font-semibold text-sm tracking-tight hover:border-saffron hover:bg-saffron/10 hover:shadow-[0_4px_14px_-4px_hsl(var(--saffron)/0.35)] active:scale-[0.98] transition-all duration-200"
          >
            Login
          </Link>
          <Tricolor size={20} />
          <Link
            to="/auth/signup"
            className="inline-flex items-center justify-center h-10 px-5 rounded-lg bg-saffron text-white font-cabinet font-semibold text-sm tracking-tight shadow-warm hover:shadow-saffron hover:brightness-105 active:scale-[0.98] transition-all duration-200"
          >
            Start for Free
          </Link>
        </div>
      </div>
    </header>
  );
};