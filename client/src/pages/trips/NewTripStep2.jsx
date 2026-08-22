import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft, ArrowLeft, Clock, Info, MapPin } from "lucide-react";
import TopAppBar from "../../components/shared/TopAppBar";

/* ============================================================
   Screen 24 — New Trip Wizard (Step 2)
   Matches Landing Page Theme
   ============================================================ */

const DURATIONS = ["2 Days", "3 Days", "5 Days", "1 Week", "2 Weeks", "Custom"];

export default function NewTripStep2() {
  const navigate = useNavigate();
  const [selectedDuration, setSelectedDuration] = useState("5 Days");

  return (
    <div className="min-h-screen bg-cream flex flex-col relative overflow-hidden">
      <TopAppBar variant="back" title="Plan New Trip" />

      <main className="flex-1 flex flex-col items-center py-10 lg:py-16 px-5 lg:px-8 max-w-[1440px] mx-auto w-full relative z-10">
        
        {/* Step Indicator */}
        <div className="flex items-center gap-4 mb-10">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-cabinet font-bold text-[15px] border-2 transition-all ${
                s === 2 ? "bg-saffron text-white border-transparent shadow-lg shadow-saffron/20" : 
                s < 2 ? "bg-banyan text-white border-transparent" : "bg-white text-taupe border-sand"
              }`}>{s}</div>
              {s < 3 && <div className={`w-10 lg:w-16 h-0.5 ${s < 2 ? "bg-banyan" : "bg-sand"}`} />}
            </div>
          ))}
        </div>

        {/* Content Box */}
        <div className="w-full max-w-[900px] lg:grid lg:grid-cols-[1fr_320px] lg:gap-12 lg:items-start">
          
          {/* Main Form Area */}
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="font-display font-bold text-[32px] lg:text-[40px] text-charcoal leading-tight">When are you going?</h1>
              <p className="font-jakarta text-[15px] lg:text-[17px] text-taupe mt-2">Select your trip duration or specific dates.</p>
            </div>

            {/* Simulated Calendar / Duration Selection */}
            <div className="flex flex-col gap-6">
              <div>
                <p className="font-mono-dm text-[11px] uppercase tracking-[1.5px] text-taupe mb-3">Suggested Durations</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {DURATIONS.map(d => (
                    <button 
                      key={d} 
                      onClick={() => setSelectedDuration(d)}
                      className={`h-12 lg:h-14 rounded-[14px] font-cabinet font-bold text-[14px] border-2 transition-all flex items-center justify-center gap-2 ${
                        selectedDuration === d ? "bg-saffron text-white border-transparent shadow-md" : "bg-white text-taupe border-sand hover:border-saffron hover:bg-ivory"
                      }`}
                    >
                      <Clock size={16} /> {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Month Picker Placeholder */}
              <div className="p-6 lg:p-8 bg-white rounded-[24px] border border-sand shadow-sm hover-aura">
                <div className="flex items-center justify-between mb-6">
                   <button className="p-2 rounded-full hover:bg-cream text-charcoal"><ChevronLeft size={20} /></button>
                   <h3 className="font-cabinet font-bold text-[18px] text-charcoal">May 2024</h3>
                   <button className="p-2 rounded-full hover:bg-cream text-charcoal"><ChevronRight size={20} /></button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                   {["S", "M", "T", "W", "T", "F", "S"].map(d => (
                     <span key={d} className="font-mono-dm text-[11px] text-taupe mb-2">{d}</span>
                   ))}
                   {[...Array(31)].map((_, i) => (
                     <button key={i} className={`aspect-square rounded-[8px] flex items-center justify-center font-jakarta text-[14px] transition-all hover:bg-cream ${
                       i === 9 || i === 14 ? "bg-saffron text-white font-bold hover:bg-saffron" : 
                       i > 9 && i < 14 ? "bg-saffron/10 text-saffron font-semibold" : "text-charcoal"
                     }`}>{i + 1}</button>
                   ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button onClick={() => navigate('/trips/new')} className="flex-1 h-14 lg:h-16 rounded-[20px] border-2 border-sand text-taupe font-cabinet font-bold text-[17px] flex items-center justify-center gap-2 hover:bg-white hover:text-charcoal hover:border-charcoal transition-all">
                <ArrowLeft size={20} /> Back
              </button>
              <button 
                onClick={() => navigate('/trips/new/interests')}
                className="flex-[2] h-14 lg:h-16 rounded-[20px] bg-saffron text-white font-cabinet font-bold text-[17px] shadow-lg shadow-saffron/20 flex items-center justify-center gap-2 hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Continue to Interests <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Right Summary Sidebar (Desktop) */}
          <aside className="hidden lg:flex flex-col gap-6">
             <div className="rounded-[20px] bg-banyan p-6 shadow-xl text-white">
                <p className="font-mono-dm text-[10px] uppercase tracking-[1.5px] text-white/60 mb-4">Trip Summary</p>
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="font-mono-dm text-[10px] text-white/50 uppercase tracking-wider">Destination</p>
                        <p className="font-cabinet font-bold text-[16px]">Udaipur, Rajasthan</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <CalendarIcon size={18} />
                      </div>
                      <div>
                        <p className="font-mono-dm text-[10px] text-white/50 uppercase tracking-wider">Dates</p>
                        <p className="font-cabinet font-bold text-[16px]">May 10 - 15, 2024</p>
                      </div>
                   </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Info size={18} />
                    </div>
                    <p className="font-jakarta text-[12px] text-white/80 leading-snug font-medium italic">High safety rating for these dates in Udaipur.</p>
                </div>
             </div>
             
             <div className="rounded-[20px] bg-white border border-sand p-5 shadow-sm">
                <h4 className="font-cabinet font-bold text-[15px] text-charcoal mb-3">Why select dates?</h4>
                <p className="font-jakarta text-[12px] text-taupe leading-relaxed">Selecting dates helps us verify seasonal safety alerts, hospital availability, and local festivals during your stay.</p>
             </div>
          </aside>

        </div>
      </main>

      {/* Background Decor */}
      <div className="hidden lg:block fixed -bottom-20 -left-20 w-[400px] h-[400px] bg-saffron/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}
