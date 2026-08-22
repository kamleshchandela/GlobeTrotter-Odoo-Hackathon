import { Link } from "react-router-dom";
import { ArrowRight } from "./Icons";
import rannOfKutch from "@/assets/rann-of-kutch.jpg";
import ziroFestival from "@/assets/ziro-festival.jpg";
import hampi from "@/assets/hampi.jpg";

const tiles = [
  { src: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&q=80&auto=format&fit=crop", name: "Spiti Valley", tags: "Remote · Peaceful · Altitude", h: "h-[520px]", col: "lg:col-span-4" },
  { src: ziroFestival, name: "Ziro Festival", tags: "Tribal · Musical · Raw", h: "h-[320px]", col: "lg:col-span-4" },
  { src: hampi, name: "Hampi", tags: "Ancient · Surreal · Offbeat", h: "h-[320px]", col: "lg:col-span-4" },
  { src: "https://images.unsplash.com/photo-1606298855672-3efb63017be8?w=900&q=80&auto=format&fit=crop", name: "Majuli Island", tags: "Sacred · Serene · Vanishing", h: "h-[440px]", col: "lg:col-span-4" },
  { src: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=900&q=80&auto=format&fit=crop", name: "Gokarna", tags: "Quiet · Coastal · Free", h: "h-[260px]", col: "lg:col-span-4" },
  { src: rannOfKutch, name: "Rann of Kutch", tags: "Surreal · Vast · Once-in-a-lifetime", h: "h-[260px]", col: "lg:col-span-8" },
];

export const ExperienceDiscovery = () => {
  return (
    <section id="experiences" className="bg-cream py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <p className="font-mono-dm text-[11px] uppercase tracking-[0.25em] text-saffron">Hidden India</p>
          <h2 className="mt-4 font-display font-bold text-charcoal text-3xl md:text-[44px] leading-[1.05]">
            Beyond the tourist trail.
          </h2>
          <p className="mt-4 text-[18px] text-taupe">
            Every city in India has a version tourists never see. We help you find it.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 lg:auto-rows-min">
          {/* Column 1: Spiti tall */}
          <Tile {...tiles[0]} />
          {/* Column 2: Ziro then Majuli */}
          <div className="lg:col-span-4 grid gap-3">
            <Tile {...tiles[1]} col="" />
            <Tile {...tiles[3]} col="" />
          </div>
          {/* Column 3: Hampi then Gokarna */}
          <div className="lg:col-span-4 grid gap-3">
            <Tile {...tiles[2]} col="" />
            <Tile {...tiles[4]} col="" />
          </div>
          {/* Bottom wide: Rann */}
          <div className="lg:col-span-12">
            <Tile {...tiles[5]} col="" h="h-[300px]" />
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Link to="/explore" className="inline-flex items-center gap-2 h-12 px-6 rounded-2xl border-2 border-saffron text-saffron font-cabinet font-semibold hover:bg-saffron/5 transition">
            Explore Hidden India <ArrowRight size={18} strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    </section>
  );
};

function Tile({ src, name, tags, h, col }) {
  return (
    <div className={`relative group ${col} ${h} rounded-2xl overflow-hidden border border-sand hover-aura`}>
      <img src={src} alt={name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 50%, hsl(18 20% 9% / 0.7) 100%)" }} />
      <div className="absolute inset-0 paper-grain opacity-[0.10] mix-blend-overlay" />
      <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between">
        <p className="font-display font-bold text-white text-[18px] drop-shadow">{name}</p>
        <p className="font-mono-dm text-[10.5px] text-white/75 text-right">{tags}</p>
      </div>
    </div>
  );
}