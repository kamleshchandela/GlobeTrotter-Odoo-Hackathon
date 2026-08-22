import { Link } from "react-router-dom";
import { ShieldIcon, ArrowRight, ChevronDown, IndiaMap } from "./Icons";

const avatars = [
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&h=120&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces",
];

export const Hero = () => {
  return (
    <section className="relative h-screen min-h-[760px] w-full overflow-hidden">
      {/* Background photo: Varanasi ghats at sunrise */}
      <img
        src="https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=2400&q=80&auto=format&fit=crop"
        alt="Varanasi ghats along the Ganga at sunrise with wooden boats and ancient temples"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      {/* Warm overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, hsl(35 100% 97% / 0.15) 0%, hsl(35 100% 97% / 0.45) 55%, hsl(35 100% 97% / 0.78) 100%)",
        }}
      />
      <div className="absolute inset-0 paper-grain opacity-[0.05]" />

      <div className="relative z-10 max-w-7xl mx-auto h-full px-6 lg:px-10 pt-24">
        <div className="absolute bottom-24 left-6 lg:left-10 max-w-[640px]">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-banyan opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-banyan" />
            </span>
            <span className="font-mono-dm uppercase tracking-[0.2em] text-[12px] text-banyan font-medium">
              India's Safety-First Travel Platform
            </span>
          </div>

          <h1 className="font-display font-extrabold text-charcoal leading-[0.98] text-5xl md:text-6xl lg:text-[72px]">
            India is vast.
            <br />
            Travel it without{" "}
            <span className="relative inline-block">
              <span className="text-charcoal/70">fear</span>
              <svg
                className="absolute left-0 right-0 top-1/2 w-full"
                height="14"
                viewBox="0 0 200 14"
                preserveAspectRatio="none"
              >
                <path
                  d="M3 7 C 50 2, 150 12, 197 6"
                  stroke="hsl(var(--saffron))"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
            <br />
            <span className="text-saffron italic font-serif-display">safely.</span>
          </h1>

          <p className="mt-7 max-w-[520px] text-[18px] md:text-[20px] text-taupe leading-relaxed">
            My Itinerary gives solo travelers, women explorers, and backpackers
            a verified safety network, smart trip planning, and real local
            support — all built for India.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/trips/new" className="inline-flex items-center gap-2 h-[52px] px-7 rounded-full bg-saffron text-white font-cabinet font-semibold shadow-saffron hover:scale-[1.02] transition">
              Plan My Trip <ArrowRight size={18} strokeWidth={2.2} />
            </Link>
            <button className="inline-flex items-center h-[52px] px-7 rounded-full border-2 border-saffron text-saffron font-cabinet font-semibold hover:bg-saffron/5 transition">
              See How It Works
            </button>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-3">
              {avatars.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Indian traveler"
                  className="w-9 h-9 rounded-full border-2 border-cream object-cover"
                  loading="lazy"
                />
              ))}
            </div>
            <p className="font-jakarta text-[13px] text-taupe">
              <span className="font-semibold text-charcoal">12,000+</span>{" "}
              travelers already feel safer
            </p>
          </div>
        </div>

        {/* Floating safety card */}
        <div className="hidden md:block absolute bottom-24 right-6 lg:right-10 w-[340px] animate-float">
          <div
            className="rounded-[20px] p-5 border border-sand shadow-saffron"
            style={{
              background: "hsl(35 100% 97% / 0.78)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-full animate-pulse-ring" />
                <div className="relative w-10 h-10 rounded-full bg-banyan/10 flex items-center justify-center">
                  <ShieldIcon size={20} className="text-banyan" strokeWidth={2} />
                </div>
              </div>
              <div>
                <p className="font-cabinet font-bold text-[14px] text-banyan">
                  Safety Status: Active
                </p>
                <p className="font-mono-dm text-[11px] text-taupe">Live monitoring</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-ivory p-4 relative overflow-hidden">
              <IndiaMap size={120} className="mx-auto text-taupe/50" />
              <span className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2">
                <span className="block w-3 h-3 rounded-full bg-banyan ring-4 ring-banyan/20 animate-pulse-ring" />
              </span>
              <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="block w-20 h-20 rounded-full border-2 border-banyan/40 border-dashed" />
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {["Guardian Nearby", "Hospital 1.2km", "SOS Ready"].map((t) => (
                <p key={t} className="font-mono-dm text-[10.5px] text-charcoal leading-tight">
                  {t}
                </p>
              ))}
            </div>

            <div className="my-4 h-px bg-saffron/40" />

            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&crop=faces"
                alt="Priya M."
                className="w-7 h-7 rounded-full object-cover"
                loading="lazy"
              />
              <p className="text-[13px] text-charcoal flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-banyan animate-pulse" />
                <span><span className="font-semibold">Priya M.</span> is traveling in Udaipur</span>
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center text-saffron animate-scroll-bounce">
          <ChevronDown size={28} strokeWidth={2.4} />
        </div>
      </div>
    </section>
  );
};