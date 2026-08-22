import { Star } from "./Icons";

const stories = [
  {
    img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=240&h=240&fit=crop&crop=faces",
    name: "Aisha Rahman, 24",
    ctx: "Solo traveler · Delhi to Meghalaya",
    quote: "Traveling to Meghalaya alone as a woman felt frightening until I found My Itinerary. The guardian network made me feel like I had a trusted local friend in every town I passed through.",
    badges: [
      { t: "Guardian Network Used", v: "banyan" },
      { t: "Safety Rated 9.2/10", v: "sand" },
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=240&h=240&fit=crop&crop=faces",
    name: "Rajan Deshmukh, 28",
    ctx: "Biker · Pune to Spiti Valley",
    quote: "High altitude, no network, a minor bike breakdown on the way to Rohtang. The emergency info and offline safety guide in My Itinerary got me through it. Essential for anyone doing Spiti.",
    badges: [
      { t: "Healthcare Finder Used", v: "banyan" },
      { t: "Emergency Guide Accessed", v: "sand" },
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=240&h=240&fit=crop&crop=faces",
    name: "Priya Venkatesh, 31",
    ctx: "Culture Traveler · Chennai to Varanasi",
    quote: "My Itinerary found me a verified female doctor when I had food poisoning on my second day in Varanasi. The hidden gems section also showed me parts of the city I would never have found on any travel blog.",
    badges: [
      { t: "Healthcare Used", v: "banyan" },
      { t: "3 Hidden Gems Visited", v: "sand" },
    ],
  },
];

export const TravelerStories = () => {
  return (
    <section className="bg-ivory py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <p className="font-mono-dm text-[11px] uppercase tracking-[0.25em] text-saffron">Real Travelers</p>
          <h2 className="mt-4 font-display font-bold text-charcoal text-3xl md:text-[44px] leading-[1.05]">
            Stories from the road.
          </h2>
          <p className="mt-4 text-[16px] text-taupe">Real people. Real journeys. Real safety.</p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((s) => (
            <article
              key={s.name}
              className="relative bg-white rounded-2xl border border-sand border-l-4 border-l-saffron p-8 shadow-soft hover-aura overflow-hidden"
            >
              <span
                className="absolute -top-4 right-4 text-turmeric/15 select-none pointer-events-none font-serif-display"
                style={{ fontSize: 160, lineHeight: 1 }}
              >
                "
              </span>
              <div className="relative flex items-center gap-3">
                <img src={s.img} alt={s.name} className="w-14 h-14 rounded-full object-cover border border-sand" loading="lazy" />
                <div>
                  <p className="font-cabinet font-bold text-[15px] text-charcoal">{s.name}</p>
                  <p className="font-mono-dm text-[12px] text-taupe">{s.ctx}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-1 text-turmeric">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} />
                ))}
              </div>
              <p className="mt-4 font-serif-display italic text-charcoal text-[16px] leading-relaxed relative">
                "{s.quote}"
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {s.badges.map((b) => (
                  <span
                    key={b.t}
                    className={
                      b.v === "banyan"
                        ? "px-3 py-1 rounded-full border border-banyan/40 text-banyan font-mono-dm text-[11px]"
                        : "px-3 py-1 rounded-full bg-sand/60 text-taupe font-mono-dm text-[11px]"
                    }
                  >
                    {b.t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};