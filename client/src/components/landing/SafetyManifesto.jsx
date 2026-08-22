import { Check, MedCross, WomanShield, IndiaMap } from "./Icons";

export const SafetyManifesto = () => {
  return (
    <section className="relative py-28 px-6 lg:px-10 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1610476120420-72e0144b8aaa?w=2400&q=80&auto=format&fit=crop"
        alt="Indian railway station with crowded platforms and natural light"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-ivory/[0.88]" />
      <div className="absolute inset-0 paper-grain opacity-[0.04]" />

      <div className="relative max-w-3xl mx-auto text-center">
        <p className="font-mono-dm text-[11px] uppercase tracking-[0.25em] text-saffron">Our Belief</p>
        <h2 className="mt-6 font-serif-display italic text-charcoal text-3xl md:text-[52px] leading-[1.15]">
          We don't sell tours. We build the{" "}
          <span className="relative inline-block">
            <span>safety layer</span>
            <svg
              className="absolute left-0 -bottom-2 w-full"
              height="14"
              viewBox="0 0 240 14"
              preserveAspectRatio="none"
            >
              <path
                d="M3 9 C 60 2, 180 13, 237 5"
                stroke="hsl(var(--saffron))"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </span>{" "}
          that travel in India has always been missing.
        </h2>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Pill icon={<Check size={16} className="text-banyan" strokeWidth={2.4} />} label="Verified Guardians" />
          <Pill icon={<MedCross size={16} className="text-saffron" strokeWidth={1.8} />} label="Healthcare Access" />
          <Pill icon={<WomanShield size={16} className="text-sindoor" strokeWidth={1.8} />} label="Women-First Design" />
          <Pill icon={<IndiaMap size={16} className="text-turmeric" />} label="Built for Bharat" />
        </div>
      </div>
    </section>
  );
};

const Pill = ({ icon, label }) => (
  <span className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-white border border-sand text-charcoal font-cabinet font-medium text-[13.5px] shadow-soft">
    {icon}
    {label}
  </span>
);