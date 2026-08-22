import { ShieldIcon, IndiaMap, Instagram, XLogo, LinkedIn, YouTube } from "./Icons";

const cols = [
  { h: "Explore", links: ["Destinations", "Safety Network", "Healthcare", "Smart Itinerary"] },
  { h: "Company", links: ["About Us", "Our Mission", "Blog", "Press"] },
  { h: "Support", links: ["Help Center", "Emergency Contacts", "Guardian Program", "Contact Us"] },
];

export const Footer = () => {
  return (
    <footer className="relative bg-charcoal text-cream pt-16 pb-8 px-6 lg:px-10 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <IndiaMap className="text-cream" style={{ width: "55%", height: "85%", opacity: 0.04 }} />
      </div>
      <div className="relative max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <ShieldIcon size={20} className="text-banyan" strokeWidth={2.2} />
          <span className="font-display font-bold text-cream text-[20px]">My Itinerary</span>
        </div>
        <p className="mt-2 text-taupe font-jakarta text-[14px]">Travel Freely. Stay Safe.</p>

        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-10">
          {cols.map((c) => (
            <div key={c.h}>
              <p className="font-mono-dm text-[12px] uppercase tracking-[0.2em] text-turmeric">{c.h}</p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <button 
                      onClick={() => {
                        const id = l.toLowerCase().replace(/\s+/g, '-');
                        const element = document.getElementById(id);
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="font-jakarta text-[14px] text-taupe hover:text-saffron transition text-left"
                    >
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="font-mono-dm text-[12px] uppercase tracking-[0.2em] text-turmeric">Stay Connected</p>
            <p className="mt-4 font-jakarta text-[13px] text-taupe">
              Get safety tips and travel guides for India.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="h-10 px-3 rounded-lg bg-[#2A1A14] border border-sand/30 placeholder:text-taupe text-cream font-jakarta text-[13px] outline-none focus:border-saffron"
              />
              <button className="h-10 rounded-lg bg-saffron text-white font-cabinet font-semibold text-[13px] hover:shadow-saffron transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-14 h-px bg-sand/15" />

        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="flex items-center gap-2 font-jakarta text-[12px] text-taupe">
            <IndiaMap size={14} className="text-turmeric" />
            2025 My Itinerary. Built for Bharat.
          </p>
          <div className="flex items-center gap-5 text-taupe">
            <a href="#" aria-label="Instagram" className="hover:text-saffron transition"><Instagram size={20} /></a>
            <a href="#" aria-label="X" className="hover:text-saffron transition"><XLogo size={20} /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-saffron transition"><LinkedIn size={20} /></a>
            <a href="#" aria-label="YouTube" className="hover:text-saffron transition"><YouTube size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};