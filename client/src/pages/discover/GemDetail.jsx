import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Star, 
  ChevronRight, 
  Navigation2, 
  Clock, 
  Shield, 
  Info, 
  Share2, 
  Heart,
  Camera,
  Calendar,
  AlertTriangle,
  Plus,
  BookmarkPlus,
  Users
} from "lucide-react";
import TopAppBar from "../../components/shared/TopAppBar";
import BottomNav from "../../components/shared/BottomNav";
import Badge from "../../components/shared/Badge";

/* ============================================================
   Screen 28 — Gem Detail
   Matches Landing Page Theme (bg-cream, text-charcoal, HSL custom colors)
   ============================================================ */

export default function GemDetail() {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="min-h-screen bg-cream">
      <TopAppBar variant="back" title="Gem Details" />

      <main className="pb-40 lg:pb-10 max-w-[1440px] mx-auto lg:px-8 lg:py-6">
        
        {/* Desktop Gallery & Hero Area */}
        <div className="hidden lg:grid lg:grid-cols-[2fr_1fr] lg:gap-4 mb-10 h-[500px]">
           <div className="rounded-[32px] overflow-hidden relative group border border-sand">
              <img src="https://images.unsplash.com/photo-1597078804310-7dfe09d55fdc?auto=format&fit=crop&w=1200&q=80" alt="Main" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-charcoal/30 p-8 flex flex-col justify-end">
                 <div className="flex gap-2 mb-4">
                    <Badge variant="safety">Verified Gem</Badge>
                    <span className="px-3 py-1 rounded-full bg-charcoal/40 backdrop-blur-md border border-white/20 text-white font-mono-dm text-[10px] uppercase tracking-wider">Heritage</span>
                 </div>
                 <h1 className="font-display font-bold text-[56px] text-white leading-tight">Ranakpur Temple</h1>
                 <p className="font-jakarta text-[18px] text-white/90 mt-1 flex items-center gap-2">
                    <MapPin size={22} className="text-saffron" /> Sadri, Rajasthan
                 </p>
              </div>
           </div>
           <div className="grid grid-rows-2 gap-4">
              <div className="rounded-[24px] overflow-hidden relative border border-sand">
                 <img src="https://images.unsplash.com/photo-1615878414902-861614742e92?auto=format&fit=crop&w=800&q=80" alt="Detail 1" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-[24px] overflow-hidden relative bg-charcoal border border-sand">
                 <img src="https://images.unsplash.com/photo-1590393961136-e01861993f41?auto=format&fit=crop&w=800&q=80" alt="Detail 2" className="w-full h-full object-cover opacity-50" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <button className="h-12 px-6 rounded-full bg-cream text-charcoal font-cabinet font-bold text-[14px] flex items-center gap-2 hover:bg-white hover:scale-105 transition-all shadow-md">
                       <Camera size={18} className="text-saffron" /> View 12+ Photos
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Mobile Hero (Simplified) */}
        <div className="lg:hidden">
           <img src="https://images.unsplash.com/photo-1597078804310-7dfe09d55fdc?auto=format&fit=crop&w=800&q=80" alt="Gem" className="w-full h-[300px] object-cover" />
           <div className="mx-5 -mt-10 relative z-10 p-6 bg-white rounded-[24px] border border-sand shadow-lg">
              <h1 className="font-display font-bold text-[28px] text-charcoal">Ranakpur Temple</h1>
              <div className="flex items-center gap-1 mt-1 text-taupe">
                 <MapPin size={16} />
                 <span className="font-jakarta text-[14px]">Sadri, Rajasthan</span>
              </div>
           </div>
        </div>

        {/* Info Layout */}
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-10 mt-8 lg:mt-0">
          
          {/* Left Column: Description & Safety */}
          <div className="mx-5 lg:mx-0 flex flex-col gap-8">
            
            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-[24px] bg-white border border-sand shadow-sm">
               <div className="text-center border-r border-sand">
                  <p className="font-mono-dm text-[9px] uppercase text-taupe/80">Rating</p>
                  <p className="font-cabinet font-bold text-[20px] text-charcoal flex items-center justify-center gap-1"><Star size={16} className="text-turmeric fill-turmeric" /> 4.9</p>
               </div>
               <div className="text-center lg:border-r lg:border-sand">
                  <p className="font-mono-dm text-[9px] uppercase text-taupe/80">Entry</p>
                  <p className="font-cabinet font-bold text-[20px] text-charcoal">Free</p>
               </div>
               <div className="text-center border-r border-sand mt-4 lg:mt-0">
                  <p className="font-mono-dm text-[9px] uppercase text-taupe/80">Time</p>
                  <p className="font-cabinet font-bold text-[20px] text-charcoal">2-3 hrs</p>
               </div>
               <div className="text-center mt-4 lg:mt-0">
                  <p className="font-mono-dm text-[9px] uppercase text-taupe/80">Distance</p>
                  <p className="font-cabinet font-bold text-[20px] text-saffron">65 km</p>
               </div>
            </div>

            {/* About Section */}
            <div className="rounded-[20px] lg:rounded-[24px] bg-white border border-sand lg:border-none lg:p-0 p-6 shadow-sm lg:shadow-none">
               <h2 className="font-cabinet font-bold text-[22px] lg:text-[28px] text-charcoal mb-4 border-b border-sand pb-2 inline-block">About the Gem</h2>
               <p className="font-jakarta text-[15px] lg:text-[17px] text-taupe leading-relaxed">
                  Deep in the heart of the Aravalli range, the 15th-century Ranakpur Jain Temple is an architectural masterpiece carved entirely from light-colored marble. With 1,444 uniquely carved pillars, no two pillars are alike, showcasing India's incredible heritage.
                  <br /><br />
                  While famously visited for its spiritual aura, it remains a "hidden gem" because of its remote location away from the bustling city of Udaipur, providing a serene and safe retreat for cultural seekers.
               </p>
            </div>

            {/* Local Experiences Section */}
            <div className="rounded-[24px] bg-white border border-sand p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-cabinet font-bold text-[22px] text-charcoal">Local Experiences Here</h2>
                    <span className="font-mono-dm text-[11px] text-saffron uppercase tracking-wider px-3 py-1 bg-saffron/10 rounded-full border border-saffron/20">Recommended</span>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex gap-4 p-4 rounded-[16px] bg-cream border border-sand hover:border-saffron transition-all cursor-pointer group">
                        <img src="https://images.unsplash.com/photo-1590393961136-e01861993f41?auto=format&fit=crop&w=200&q=80" alt="Experience" className="w-20 h-20 rounded-[12px] object-cover" />
                        <div className="flex-1">
                            <h4 className="font-cabinet font-bold text-[16px] text-charcoal group-hover:text-saffron transition-colors">Guided Architectural Walk</h4>
                            <div className="flex items-center gap-2 mt-1 mb-2">
                                <Clock size={14} className="text-taupe" /> <span className="font-jakarta text-[13px] text-taupe">1.5 Hours</span>
                                <span className="w-1 h-1 rounded-full bg-sand mx-1" />
                                <Star size={14} className="text-turmeric fill-turmeric" /> <span className="font-jakarta text-[13px] text-taupe">4.8</span>
                            </div>
                            <p className="font-cabinet font-bold text-[14px] text-charcoal">₹500 <span className="font-jakarta font-normal text-[12px] text-taupe">/ person</span></p>
                        </div>
                        <div className="flex items-center justify-center px-4">
                            <ChevronRight size={20} className="text-saffron group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Safety In-Depth */}
            <div className="rounded-[24px] bg-banyan/10 border border-banyan/20 p-6 lg:p-8">
               <div className="flex items-center gap-3 mb-6">
                 <Shield size={28} className="text-banyan" />
                 <div>
                    <h3 className="font-cabinet font-bold text-[20px] text-charcoal">Safety Verification</h3>
                    <p className="font-mono-dm text-[11px] text-banyan uppercase tracking-wider">Last verified: April 20, 2024</p>
                 </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Crowd Levels", val: "Low to Moderate", desc: "Easier to maintain social safety distance." },
                    { label: "Security", val: "Temple Guard Active", desc: "Official security personnel on site 24/7." },
                    { label: "Transport", val: "Verified Taxis Only", desc: "Access through safe transport network." },
                    { label: "Connectivity", val: "Full GPS Coverage", desc: "SOS and tracking works effectively here." },
                  ].map(s => (
                    <div key={s.label}>
                       <p className="font-cabinet font-bold text-[15px] text-charcoal">{s.label}</p>
                       <p className="font-cabinet font-medium text-[13px] text-banyan mt-0.5">{s.val}</p>
                       <p className="font-jakarta text-[12px] text-taupe mt-1">{s.desc}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Right Column: Actions & Practical Info (Sticky) */}
          <aside className="mx-5 lg:mx-0 mt-8 lg:mt-0 flex flex-col gap-6">
             <div className="lg:sticky lg:top-24 flex flex-col gap-6">
               
               {/* Quick Actions */}
               <div className="rounded-[24px] bg-white border border-sand p-6 shadow-md hover-aura">
                 <h4 className="font-cabinet font-bold text-[18px] text-charcoal mb-5">Plan Your Visit</h4>
                 <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => setIsSaved(!isSaved)}
                      className={`w-full h-12 rounded-[14px] font-cabinet font-bold text-[15px] flex items-center justify-center gap-2 transition-all ${
                        isSaved ? "bg-saffron text-white shadow-lg shadow-saffron/20" : "bg-cream border border-saffron/30 text-saffron hover:bg-saffron hover:text-white"
                      }`}
                    >
                       <BookmarkPlus size={18} className={isSaved ? "fill-current" : ""} /> {isSaved ? "Saved to Trip Plan" : "Save to Trip"}
                    </button>
                    <button className="w-full h-12 rounded-[14px] border border-sand bg-white text-charcoal font-cabinet font-bold text-[15px] flex items-center justify-center gap-2 hover:border-charcoal hover:bg-ivory transition-all">
                       <Navigation2 size={18} /> Get Directions
                    </button>
                 </div>
                 <div className="mt-5 flex gap-2 pt-5 border-t border-sand">
                    <button className="flex-1 h-10 rounded-full bg-cream border border-sand text-taupe hover:text-saffron hover:border-saffron font-cabinet font-bold text-[12px] flex items-center justify-center gap-1.5 transition-all"><Heart size={14} /> Wishlist</button>
                    <button className="flex-1 h-10 rounded-full bg-cream border border-sand text-taupe hover:text-saffron hover:border-saffron font-cabinet font-bold text-[12px] flex items-center justify-center gap-1.5 transition-all"><Share2 size={14} /> Share</button>
                 </div>
               </div>

               {/* Community Insights */}
               <div className="rounded-[24px] bg-white border border-sand p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                      <Users size={18} className="text-saffron" />
                      <p className="font-mono-dm text-[10px] uppercase tracking-[1.5px] text-taupe">Community Insight</p>
                  </div>
                  <p className="font-jakarta text-[13px] text-charcoal italic border-l-2 border-saffron pl-3">"Best time to visit is early morning around 7 AM. The light hits the marble beautifully and there are zero crowds!"</p>
                  <p className="font-cabinet font-bold text-[12px] text-taupe mt-2">— Submitted by Rahul V.</p>
               </div>

               {/* Location & Guidelines */}
               <div className="rounded-[24px] bg-white border border-sand p-6 shadow-sm">
                  <p className="font-mono-dm text-[10px] uppercase tracking-[1.5px] text-taupe mb-4">Visit Guidelines</p>
                  <div className="space-y-4">
                     <div className="flex items-start gap-3">
                        <Clock size={18} className="text-taupe mt-0.5 shrink-0" />
                        <div>
                          <p className="font-cabinet font-bold text-[14px] text-charcoal">Best Time to Visit</p>
                          <p className="font-jakarta text-[12px] text-taupe">12:00 PM - 05:00 PM (Temple hours for tourists)</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-3">
                        <AlertTriangle size={18} className="text-turmeric mt-0.5 shrink-0" />
                        <div>
                          <p className="font-cabinet font-bold text-[14px] text-charcoal">Dress Code</p>
                          <p className="font-jakarta text-[12px] text-taupe">Modest attire required. Shoulders and knees covered.</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-3">
                        <Info size={18} className="text-taupe mt-0.5 shrink-0" />
                        <div>
                          <p className="font-cabinet font-bold text-[14px] text-charcoal">Photography</p>
                          <p className="font-jakarta text-[12px] text-taupe">Allowed outside only. Cell phones permitted at fee.</p>
                        </div>
                     </div>
                  </div>
               </div>
             </div>
          </aside>

        </div>
      </main>

      <BottomNav activeTab="/explore" />
    </div>
  );
}
