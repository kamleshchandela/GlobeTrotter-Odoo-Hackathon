import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Heart, 
  ChevronRight, 
  ArrowLeft, 
  Map, 
  Camera, 
  Palmtree, 
  Utensils, 
  ShoppingBag, 
  History, 
  ShieldCheck,
  Calendar,
  MapPin,
  Sparkles,
  Bookmark
} from "lucide-react";
import TopAppBar from "../../components/shared/TopAppBar";

/* ============================================================
   Screen 25 — New Trip Wizard (Step 3)
   Matches Landing Page Theme
   ============================================================ */

const INTERESTS = [
  { icon: Palmtree, label: "Nature", desc: "Parks, lakes & scenic views" },
  { icon: History, label: "Culture", desc: "Museums & heritage sites" },
  { icon: Utensils, label: "Food", desc: "Local cuisine & street food" },
  { icon: Camera, label: "Adventure", desc: "Trekking & activities" },
  { icon: ShoppingBag, label: "Shopping", desc: "Bazaars & handicrafts" },
  { icon: Heart, label: "Wellness", desc: "Yoga, spas & meditation" },
  { icon: Bookmark, label: "Saved Gems", desc: "Include your bookmarked spots" },
];

export default function NewTripStep3() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(["Culture", "Food", "Saved Gems"]);

  const toggle = (label) => {
    setSelected(prev => 
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col relative overflow-hidden">
      <TopAppBar variant="back" title="Plan New Trip" />

      <main className="flex-1 flex flex-col items-center py-10 lg:py-16 px-5 lg:px-8 max-w-[1440px] mx-auto w-full relative z-10">
        
        {/* Step Indicator */}
        <div className="flex items-center gap-4 mb-10">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-cabinet font-bold text-[15px] border-2 transition-all ${
                s === 3 ? "bg-saffron text-white border-transparent shadow-lg shadow-saffron/20" : 
                "bg-banyan text-white border-transparent"
              }`}>{s}</div>
              {s < 3 && <div className="w-10 lg:w-16 h-0.5 bg-banyan" />}
            </div>
          ))}
        </div>

        {/* Content Box */}
        <div className="w-full max-w-[1000px] lg:grid lg:grid-cols-[1fr_360px] lg:gap-14 lg:items-start">
          
          {/* Main Form Area */}
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="font-display font-bold text-[32px] lg:text-[40px] text-charcoal leading-tight">What do you like?</h1>
              <p className="font-jakarta text-[15px] lg:text-[17px] text-taupe mt-2">Tailor your experience based on your interests.</p>
            </div>

            {/* Interests Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INTERESTS.map(item => {
                const isSelected = selected.includes(item.label);
                return (
                  <button 
                    key={item.label}
                    onClick={() => toggle(item.label)}
                    className={`p-5 lg:p-6 rounded-[24px] border-2 text-left transition-all group flex items-start gap-4 hover-aura ${
                      isSelected 
                        ? "bg-saffron border-transparent text-white shadow-lg shadow-saffron/20" 
                        : "bg-white border-sand text-charcoal hover:border-saffron hover:bg-ivory"
                    }`}
                  >
                    <span className={`w-12 h-12 lg:w-14 lg:h-14 rounded-[16px] flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? "bg-white/20 text-white" : "bg-cream text-saffron"
                    }`}>
                      <item.icon size={24} />
                    </span>
                    <div>
                      <h4 className="font-cabinet font-bold text-[16px] lg:text-[18px]">{item.label}</h4>
                      <p className={`mt-1 font-jakarta text-[12px] lg:text-[13px] leading-tight ${
                        isSelected ? "text-white/90" : "text-taupe"
                      }`}>{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button onClick={() => navigate('/trips/new/dates')} className="flex-1 h-14 lg:h-16 rounded-[20px] border-2 border-sand text-taupe font-cabinet font-bold text-[17px] flex items-center justify-center gap-2 hover:bg-white hover:text-charcoal hover:border-charcoal transition-all">
                <ArrowLeft size={20} /> Back
              </button>
              <button 
                onClick={() => navigate('/trips/rajasthan-explorer')}
                className="flex-[2] h-14 lg:h-16 rounded-[20px] bg-saffron text-white font-cabinet font-bold text-[17px] shadow-lg shadow-saffron/20 flex items-center justify-center gap-2 hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Create My Trip <Sparkles size={20} />
              </button>
            </div>
          </div>

          {/* Right Final Summary Sidebar (Desktop) */}
          <aside className="hidden lg:flex flex-col gap-6 sticky top-24">
             <div className="rounded-[24px] bg-charcoal p-7 shadow-2xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                <p className="font-mono-dm text-[11px] uppercase tracking-[1.5px] text-white/50 mb-6">Final Itinerary Preview</p>
                
                <div className="space-y-5">
                   <div className="flex items-start gap-4">
                      <MapPin size={20} className="text-saffron mt-1" />
                      <div>
                        <p className="font-cabinet font-bold text-[18px]">Udaipur Explorer</p>
                        <p className="font-jakarta text-[13px] text-white/60">May 10 - 15 (5 Days)</p>
                      </div>
                   </div>
                   
                   <div className="flex items-start gap-4">
                      <Heart size={20} className="text-sindoor mt-1" />
                      <div className="flex-1">
                        <p className="font-mono-dm text-[10px] text-white/40 uppercase tracking-wider mb-2">Interests</p>
                        <div className="flex flex-wrap gap-2">
                           {selected.map(s => (
                             <span key={s} className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white font-mono-dm text-[11px]">{s}</span>
                           ))}
                           {selected.length === 0 && <span className="text-white/30 italic font-jakarta text-[12px]">None selected</span>}
                        </div>
                      </div>
                   </div>

                   <div className="pt-5 mt-5 border-t border-white/10 flex items-center gap-3">
                      <ShieldCheck size={24} className="text-banyan" />
                      <p className="font-jakarta text-[13px] text-white/80 leading-snug">Safety routes and nearby medical aid will be auto-generated for this itinerary.</p>
                   </div>
                </div>
             </div>

             <div className="p-6 rounded-[20px] border-2 border-dashed border-sand bg-white/50 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center mb-3 border border-sand">
                   <Map size={24} className="text-saffron" />
                </div>
                <h4 className="font-cabinet font-bold text-[15px] text-charcoal">Custom Experience</h4>
                <p className="font-jakarta text-[12px] text-taupe mt-1 leading-relaxed">Our AI will curate a path based on your likes while avoiding high-risk zones and traffic.</p>
             </div>
          </aside>

        </div>
      </main>

      <div className="hidden lg:block fixed top-1/2 right-0 w-[400px] h-[400px] bg-turmeric/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
    </div>
  );
}
