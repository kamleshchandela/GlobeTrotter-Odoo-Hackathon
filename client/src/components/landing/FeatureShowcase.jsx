import { ShieldIcon, Check, Wifi, Bolt, IndiaMap } from "./Icons";
import ziroValley from "@/assets/ziro-valley.jpg";
import hampiRuins from "@/assets/hampi-ruins.jpg";

export const FeatureShowcase = () => {
  return (
    <section id="healthcare" className="bg-ivory py-28 px-6 lg:px-10 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full" style={{ background: "var(--gradient-warm-blob)" }} />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full" style={{ background: "var(--gradient-warm-blob)" }} />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <p className="font-mono-dm text-[11px] uppercase tracking-[0.25em] text-saffron">What We Offer</p>
          <h2 className="mt-4 font-display font-bold text-charcoal text-3xl md:text-5xl leading-[1.05]">
            Everything a traveler in India actually needs.
          </h2>
          <p className="mt-5 text-[18px] text-taupe">
            Not just a planner. A full safety ecosystem.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-min">
          {/* Block 1 — Safety Network (7/12) */}
          <div className="lg:col-span-7 bg-banyan rounded-3xl p-10 text-white relative overflow-hidden shadow-warm">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/5" />
            <span className="inline-block px-3 py-1 rounded-full border border-turmeric/60 text-turmeric font-mono-dm text-[10.5px] uppercase tracking-[0.2em]">
              Main USP
            </span>
            <h3 className="mt-5 font-display font-bold text-3xl md:text-[32px] leading-tight max-w-md">
              Your Guardian Network. Live. Verified.
            </h3>
            <p className="mt-4 text-white/80 text-[15px] max-w-lg leading-relaxed">
              Background-verified local residents in every major Indian city,
              ready to assist solo travelers in moments of need. Not strangers —
              trusted, checked, community-backed helpers.
            </p>

            <div className="mt-8 relative rounded-2xl bg-banyan/60 border border-white/10 p-6 h-56 overflow-hidden">
              <IndiaMap className="absolute inset-0 m-auto w-40 h-full text-white/30" />
              {/* City pulse dots */}
              {[
                { name: "Delhi", x: "44%", y: "22%" },
                { name: "Jaipur", x: "37%", y: "30%" },
                { name: "Mumbai", x: "32%", y: "55%" },
                { name: "Bangalore", x: "42%", y: "72%" },
                { name: "Kochi", x: "40%", y: "85%" },
                { name: "Varanasi", x: "55%", y: "35%" },
                { name: "Guwahati", x: "70%", y: "32%" },
              ].map((c, i) => (
                <div key={c.name} className="absolute" style={{ left: c.x, top: c.y }}>
                  <span className="block w-2.5 h-2.5 rounded-full bg-haldi animate-pulse-ring relative" />
                  {i % 3 === 0 && (
                    <span className="absolute left-3 -top-1 whitespace-nowrap text-[10px] font-mono-dm bg-white/10 backdrop-blur px-2 py-0.5 rounded">
                      3 guardians active
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-white/70 font-mono-dm text-[12.5px]">
              <span><span className="text-white font-medium">480+</span> Verified Guardians</span>
              <span className="opacity-40">|</span>
              <span><span className="text-white font-medium">28</span> Cities Active</span>
              <span className="opacity-40">|</span>
              <span>Avg. Response: <span className="text-white font-medium">4 min</span></span>
            </div>

            <div className="absolute right-8 bottom-8 flex flex-col items-center">
              <div className="relative">
                <span className="absolute inset-0 rounded-full animate-pulse-ring-red" />
                <button className="relative w-14 h-14 rounded-full bg-sindoor flex items-center justify-center shadow-warm">
                  <ShieldIcon size={24} className="text-white" strokeWidth={2.2} />
                </button>
              </div>
              <span className="mt-2 font-mono-dm text-[10.5px] text-white/80">Emergency SOS</span>
            </div>
          </div>

          {/* Block 2 — Healthcare (5/12) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-sand p-8 shadow-soft hover-aura">
            <h3 className="font-cabinet font-bold text-[22px] text-charcoal leading-snug">
              Find doctors who speak your language
            </h3>
            <p className="mt-3 text-[15px] text-taupe leading-relaxed">
              Verified clinics, cost estimates, and English-speaking doctors —
              near you, anywhere across India.
            </p>

            <div className="mt-5 rounded-2xl bg-ivory border border-sand p-5">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=160&h=160&fit=crop&crop=faces"
                  alt="Dr. Kavita Sharma"
                  className="w-12 h-12 rounded-full object-cover border border-sand"
                  loading="lazy"
                />
                <div className="flex-1">
                  <p className="font-cabinet font-bold text-[15px] text-charcoal">Dr. Kavita Sharma</p>
                  <p className="font-jakarta text-[12.5px] text-taupe">General Physician</p>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-banyan/10 text-banyan font-mono-dm text-[11px]">
                  <Check size={12} strokeWidth={2.6} /> Verified
                </span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="px-2 py-1 rounded-md bg-sand/60 text-taupe font-mono-dm text-[11px]">Hindi</span>
                <span className="px-2 py-1 rounded-md bg-sand/60 text-taupe font-mono-dm text-[11px]">English</span>
                <span className="ml-auto font-cabinet font-bold text-charcoal text-[14px]">
                  ₹300–500 <span className="font-jakarta font-normal text-taupe text-[12px]">/ visit</span>
                </span>
              </div>
            </div>
          </div>

          {/* Block 3 — Smart Itinerary (5/12) */}
          <div className="lg:col-span-5 bg-haldi rounded-3xl p-8 shadow-soft hover-aura">
            <h3 className="font-cabinet font-bold text-[22px] text-charcoal leading-snug">
              Itineraries built around you, not a brochure
            </h3>
            <p className="mt-3 text-[15px] text-charcoal/75 leading-relaxed">
              Input your budget, days, group size, and travel vibe. Get a
              day-by-day plan with real cost breakdowns.
            </p>
            <div className="mt-5 rounded-2xl bg-cream/80 backdrop-blur border border-sand p-5">
              <p className="font-cabinet font-bold text-charcoal text-[15px]">
                Udaipur — 3 Days — ₹8,000
              </p>
              <div className="mt-4 flex gap-2">
                {[
                  { d: "Day 1", p: "City Palace + Pichola Lake" },
                  { d: "Day 2", p: "Monsoon Palace + Local Market" },
                  { d: "Day 3", p: "Sajjangarh Sanctuary + Departure" },
                ].map((s) => (
                  <div key={s.d} className="flex-1 rounded-xl bg-white border border-sand p-3">
                    <p className="font-mono-dm text-[10.5px] uppercase text-saffron tracking-wide">{s.d}</p>
                    <p className="mt-1 text-[12px] text-charcoal leading-snug">{s.p}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Block 4 — Hidden Gems (7/12) */}
          <div className="lg:col-span-7 bg-cream rounded-3xl border border-sand p-8 shadow-soft relative overflow-hidden hover-aura">
            <div className="absolute inset-0 paisley-bg opacity-[0.04]" />
            <div className="relative">
              <h3 className="font-cabinet font-bold text-[22px] text-charcoal leading-snug">
                Discover India beyond the guidebook
              </h3>
              <p className="mt-3 text-[15px] text-taupe leading-relaxed">
                Local-curated hidden spots, festivals, neighborhood food trails,
                and cultural activities — nowhere else listed.
              </p>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { src: "https://images.unsplash.com/photo-1606298855672-3efb63017be8?w=400&q=80", name: "Majuli Island", tag: "Offbeat" },
                  { src: ziroValley, name: "Ziro Valley", tag: "Cultural" },
                  { src: hampiRuins, name: "Hampi Ruins", tag: "Ancient" },
                  { src: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400&q=80", name: "Rann of Kutch", tag: "Photogenic" },
                ].map((p) => (
                  <div key={p.name} className="bg-white p-2 pb-3 rounded-md border border-sand shadow-soft rotate-[-1deg] hover:rotate-0 transition">
                    <img src={p.src} alt={p.name} className="w-full h-28 object-cover rounded-sm" loading="lazy" />
                    <p className="mt-2 font-display text-[14px] text-charcoal text-center">{p.name}</p>
                    <p className="font-mono-dm text-[10px] text-taupe text-center uppercase tracking-wide">{p.tag}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Block 5 — Utilities (12/12) */}
          <div className="lg:col-span-12 bg-sand rounded-3xl p-6 md:p-7 grid grid-cols-1 md:grid-cols-2 gap-6 md:divide-x divide-charcoal/10">
            <div className="flex items-center gap-4 md:pr-6">
              <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center shrink-0">
                <Wifi size={24} className="text-charcoal" strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <p className="font-cabinet font-bold text-[15px] text-charcoal">WiFi Finder</p>
                <p className="font-jakarta text-[13.5px] text-taupe">Crowdsourced verified WiFi spots near your route</p>
              </div>
              <span className="font-mono-dm text-[11.5px] text-banyan whitespace-nowrap">47 verified spots nearby</span>
            </div>
            <div className="flex items-center gap-4 md:pl-6">
              <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center shrink-0">
                <Bolt size={24} className="text-charcoal" strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <p className="font-cabinet font-bold text-[15px] text-charcoal">Charging Stations</p>
                <p className="font-jakarta text-[13.5px] text-taupe">Public powerbank kiosks along your path</p>
              </div>
              <span className="font-mono-dm text-[11.5px] text-banyan whitespace-nowrap">12 active kiosks nearby</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};