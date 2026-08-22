import { Compass, ShieldCheck, PersonAura, Check, IndiaMap } from "./Icons";

export const HowItWorks = () => {
  return (
    <section id="safety" className="bg-cream py-28 px-6 lg:px-10 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <IndiaMap className="text-saffron" style={{ width: "70%", height: "70%", opacity: 0.05 }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <p className="font-mono-dm text-[11px] uppercase tracking-[0.25em] text-saffron">
            How It Works
          </p>
          <h2 className="mt-4 font-display font-bold text-charcoal text-3xl md:text-5xl leading-[1.05]">
            Three steps to travel India like you own it.
          </h2>
        </div>

        <div className="mt-16 relative grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Connector lines */}
          <div className="hidden lg:block absolute top-1/2 left-1/3 -translate-y-1/2 w-1/3 px-8 pointer-events-none">
            <div className="h-px border-t-2 border-dashed border-saffron/60 relative">
              <span className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-saffron animate-pulse" />
            </div>
          </div>
          <div className="hidden lg:block absolute top-1/2 left-2/3 -translate-y-1/2 w-1/3 px-8 pointer-events-none">
            <div className="h-px border-t-2 border-dashed border-saffron/60 relative">
              <span className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-saffron animate-pulse" />
            </div>
          </div>

          {/* Step 1 */}
          <StepCard
            number="01"
            accent="saffron"
            icon={<Compass size={36} className="text-saffron" strokeWidth={1.8} />}
            title="Tell us where you're going"
            body="Enter your destination, travel dates, group size, and budget. Pick your interests from adventure, culture, solo, or family travel."
          >
            <div className="mt-5 flex flex-wrap gap-2">
              {["Jaipur", "Coorg", "Spiti", "Goa", "Varanasi"].map((c) => (
                <span
                  key={c}
                  className="px-3 py-1.5 rounded-md bg-sand/60 border border-transparent hover:border-saffron text-taupe font-mono-dm text-[12px] transition"
                >
                  {c}
                </span>
              ))}
            </div>
          </StepCard>

          {/* Step 2 */}
          <StepCard
            number="02"
            accent="banyan"
            icon={<ShieldCheck size={36} className="text-banyan" strokeWidth={1.8} />}
            title="Your personalized safety and itinerary"
            body="We generate a smart itinerary and a real-time safety profile for your destination — including nearby verified healthcare, guardian availability, safe zones, and emergency contacts."
          >
            <div className="mt-5 rounded-xl bg-ivory border border-sand p-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--sand))" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.5" fill="none"
                      stroke="hsl(var(--banyan))" strokeWidth="3" strokeLinecap="round"
                      strokeDasharray={`${0.87 * 97.4} 97.4`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-cabinet font-bold text-banyan text-[15px]">87</span>
                  </div>
                </div>
                <div>
                  <p className="font-cabinet font-bold text-[13px] text-charcoal">Safety Score</p>
                  <p className="font-mono-dm text-[11px] text-taupe">87 / 100 — Very Safe</p>
                </div>
              </div>
              <div className="mt-3 space-y-1.5 text-[12px]">
                <Badge text="Verified Guardians: 4 nearby" />
                <Badge text="Hospital: 1.2km" />
                <Badge text="Emergency Helpline: Active" />
              </div>
            </div>
          </StepCard>

          {/* Step 3 */}
          <StepCard
            number="03"
            accent="saffron"
            icon={<PersonAura size={36} className="text-saffron" strokeWidth={1.8} />}
            title="You are never truly alone"
            body="Access your guardian network, receive safety alerts, discover hidden local gems, and call for help with one tap — anywhere across India."
          >
            <div className="mt-6 flex justify-center">
              <div className="relative">
                <span className="absolute inset-0 rounded-full animate-pulse-ring-red" />
                <button className="relative inline-flex items-center justify-center h-12 px-6 rounded-full bg-sindoor text-white font-cabinet font-bold text-[13px] tracking-wide">
                  SOS — Tap to Alert Guardians
                </button>
              </div>
            </div>
          </StepCard>
        </div>
      </div>
    </section>
  );
};

const Badge = ({ text }) => (
  <div className="flex items-center gap-2 text-charcoal font-jakarta">
    <Check size={12} className="text-banyan" strokeWidth={2.4} />
    <span>{text}</span>
  </div>
);

function StepCard({
  number, accent, icon, title, body, children,
}) {
  const border = accent === "saffron" ? "border-l-saffron" : "border-l-banyan";
  return (
    <div
      className={`relative bg-white rounded-2xl border border-sand border-l-4 ${border} p-8 shadow-soft hover-aura overflow-hidden`}
    >
      <span className="absolute right-4 top-2 font-display font-bold text-[96px] text-turmeric/15 leading-none select-none">
        {number}
      </span>
      <div className="relative">
        <div className="w-14 h-14 rounded-xl bg-ivory flex items-center justify-center">{icon}</div>
        <h3 className="mt-5 font-cabinet font-bold text-[22px] text-charcoal leading-snug">
          {title}
        </h3>
        <p className="mt-3 text-[15px] text-taupe leading-relaxed">{body}</p>
        {children}
      </div>
    </div>
  );
}