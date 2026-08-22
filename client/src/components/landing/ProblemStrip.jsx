import { WomanShield, MedCross, WifiOff, PinSearch } from "./Icons";

const cards = [
  {
    Icon: WomanShield,
    color: "sindoor",
    stat: "68%",
    label: "of solo women feel unsafe traveling alone in unfamiliar Indian cities",
  },
  {
    Icon: MedCross,
    color: "saffron",
    stat: "Zero",
    label: "travel-focused healthcare discovery platforms exist in India today",
  },
  {
    Icon: WifiOff,
    color: "turmeric",
    stat: "5 Stars",
    label: "hotel WiFi ratings that barely load a video call when you need it most",
  },
  {
    Icon: PinSearch,
    color: "banyan",
    stat: "200+",
    label: "blogs to read just to find one single authentic local experience",
  },
];

const colorMap = {
  sindoor: { text: "text-sindoor", bg: "bg-sindoor/10", border: "bg-sindoor/30" },
  saffron: { text: "text-saffron", bg: "bg-saffron/10", border: "bg-saffron/30" },
  turmeric: { text: "text-turmeric", bg: "bg-turmeric/10", border: "bg-turmeric/30" },
  banyan: { text: "text-banyan", bg: "bg-banyan/10", border: "bg-banyan/30" },
};

export const ProblemStrip = () => {
  return (
    <section className="bg-ivory py-24 px-6 lg:px-10 relative overflow-hidden">
      <div className="absolute inset-0 paisley-bg opacity-[0.03]" />
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <p className="font-mono-dm text-[11px] uppercase tracking-[0.25em] text-taupe">
            The Reality of Travel in India
          </p>
          <h2 className="mt-4 font-display font-bold text-charcoal text-3xl md:text-[44px] leading-[1.05]">
            Millions travel India every year. Most do it completely unprotected.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map(({ Icon, color, stat, label }) => {
            const c = colorMap[color];
            return (
              <div
                key={stat + label.slice(0, 8)}
                className="bg-white rounded-2xl border border-sand p-8 shadow-soft hover-aura relative overflow-hidden"
              >
                <div className={`w-14 h-14 rounded-full ${c.bg} flex items-center justify-center`}>
                  <Icon size={28} className={c.text} strokeWidth={1.8} />
                </div>
                <p className="mt-6 font-cabinet font-bold text-[40px] text-charcoal leading-none">
                  {stat}
                </p>
                <p className="mt-3 text-[14px] text-taupe leading-relaxed">{label}</p>
                <div className={`absolute bottom-0 left-0 right-0 h-[3px] ${c.border}`} />
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-center font-mono-dm italic text-[14px] text-taupe">
          We built one platform to solve all of this.
        </p>
      </div>
    </section>
  );
};