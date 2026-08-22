import { ArrowRight, ShieldIcon } from "./Icons";

const guardianAvatars = [
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&h=120&fit=crop&crop=faces",
];

export const FinalCTA = () => {
  return (
    <section
      className="relative py-24 px-6 lg:px-10 overflow-hidden"
      style={{ background: "linear-gradient(90deg, hsl(var(--saffron)) 0%, hsl(var(--turmeric)) 100%)" }}
    >
      <div className="absolute inset-0 paper-grain opacity-[0.08]" />
      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-12">
        <div className="lg:col-span-7 text-white">
          <p className="font-devanagari italic text-white/70 text-lg">यात्रा करो, डरो मत</p>
          <h2 className="mt-3 font-display font-extrabold text-4xl md:text-5xl lg:text-[56px] leading-[1.05]">
            Your next trip in India should feel like freedom, not anxiety.
          </h2>
          <p className="mt-5 text-[18px] text-white/85 max-w-xl">
            Join 12,000+ travelers who explore India with a safety net they can actually trust.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <button className="inline-flex items-center gap-2 h-14 px-7 rounded-full bg-white text-saffron font-cabinet font-bold shadow-warm hover:scale-[1.02] transition">
              Start for Free <ArrowRight size={18} strokeWidth={2.4} />
            </button>
          </div>
          <p className="mt-4 font-jakarta text-[13px] text-white/75">
            No credit card required · Works across India · Free safety tools always included
          </p>
        </div>

        {/* Phone mockup */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
          <div className="absolute w-72 h-72 rounded-full bg-haldi/40 blur-3xl" />
          <div className="relative w-[280px] h-[560px] rounded-[44px] bg-charcoal p-3 shadow-2xl">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-charcoal rounded-b-2xl z-10" />
            <div className="w-full h-full rounded-[34px] bg-cream overflow-hidden relative flex flex-col">
              <div className="px-5 pt-10 pb-4 flex items-center justify-between border-b border-sand">
                <div className="flex items-center gap-2">
                  <ShieldIcon size={14} className="text-banyan" strokeWidth={2.4} />
                  <span className="font-mono-dm text-[11px] text-charcoal">Udaipur, Rajasthan</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-banyan animate-pulse" />
              </div>
              <div className="flex-1 relative flex items-center justify-center">
                <div className="absolute inset-0 paisley-bg opacity-[0.06]" />
                {/* Avatars in ring */}
                {guardianAvatars.map((src, i) => {
                  const angle = (i / guardianAvatars.length) * Math.PI * 2 - Math.PI / 2;
                  const r = 100;
                  const x = Math.cos(angle) * r;
                  const y = Math.sin(angle) * r;
                  return (
                    <img
                      key={i}
                      src={src}
                      alt="Guardian"
                      className="absolute w-9 h-9 rounded-full border-2 border-cream object-cover shadow"
                      style={{ transform: `translate(${x}px, ${y}px)` }}
                      loading="lazy"
                    />
                  );
                })}
                <div className="relative">
                  <span className="absolute inset-0 rounded-full animate-pulse-ring-red" />
                  <button className="relative w-24 h-24 rounded-full bg-sindoor text-white font-cabinet font-bold text-[18px] flex items-center justify-center shadow-2xl">
                    SOS
                  </button>
                </div>
              </div>
              <div className="px-5 py-4 border-t border-sand text-center">
                <p className="font-mono-dm text-[10.5px] text-taupe uppercase tracking-wide">Tap to alert 6 nearby guardians</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};