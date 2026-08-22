import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, Bus, Footprints, MapPin, Map } from "lucide-react";
import TopAppBar from "../../components/shared/TopAppBar";
import { SuccessHero, ConfirmationCard } from "./components/ConfirmationComponents";
import { API_BASE_URL } from "../../config/env";
import { RequirementCard, ActionCard, ImportantNotes } from "./components/ConfirmationActionComponents";

export default function Confirmation() {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/healthcare/doctors`);
        if (res.ok) {
          const data = await res.json();
          setDoctor(data[0]); // fallback to first doctor
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
    window.scrollTo(0, 0);
  }, []);

  if (loading || !doctor) return <div className="min-h-screen bg-[#FFF8F0] pt-[120px] text-center">Loading confirmation...</div>;

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-[64px] print:bg-white print:pb-0">
      <TopAppBar className="print:hidden" />

      {/* TOP LABEL */}
      <div className="pt-[40px] flex justify-center print:hidden">
        <p className="font-mono-dm text-[11px] text-[#2D6A4F] uppercase tracking-[3px]">Booking Confirmed</p>
      </div>

      <div className="max-w-[800px] mx-auto px-[24px]">
        {/* ZONE 1 — HERO */}
        <div className="mt-[24px] print:hidden">
          <SuccessHero />
        </div>

        {/* ZONE 2 — CONFIRMATION CARD */}
        <div className="mt-[32px]">
          <ConfirmationCard doctor={doctor} />
        </div>

        {/* ZONE 3 — WHAT TO BRING */}
        <div className="mt-[32px]">
          <p className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px]">What to Bring</p>
          <div className="mt-[12px] grid grid-cols-3 gap-[16px] print:grid-cols-1">
            <RequirementCard type="id" />
            <RequirementCard type="booking" />
            <RequirementCard type="history" />
          </div>
        </div>

        {/* ZONE 4 — HOW TO GET THERE */}
        <div className="mt-[32px] print:hidden">
          <p className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[1px]">How to Get There</p>
          <div className="mt-[12px] flex gap-[24px]">
            <div className="flex-1 space-y-[16px]">
               <div className="flex gap-[16px]">
                 <div className="w-[36px] h-[36px] rounded-full bg-[#FEF3E2] flex items-center justify-center shrink-0 text-[#E8640C]"><Car size={18} /></div>
                 <div><h5 className="font-cabinet font-semibold text-[14px] text-[#1E1410]">By Auto or Taxi</h5><p className="mt-[2px] font-jakarta text-[13px] text-[#6B4F3A] leading-[1.4]">Approx ₹50–80 from city center. 8–12 min. Tell the driver Maharana Bhupal Hospital at Chetak Circle.</p></div>
               </div>
               <div className="flex gap-[16px]">
                 <div className="w-[36px] h-[36px] rounded-full bg-[#FEF3E2] flex items-center justify-center shrink-0 text-[#E8640C]"><Bus size={18} /></div>
                 <div><h5 className="font-cabinet font-semibold text-[14px] text-[#1E1410]">By Bus</h5><p className="mt-[2px] font-jakarta text-[13px] text-[#6B4F3A] leading-[1.4]">Routes 5 and 12 stop at Chetak Circle. Hospital is 2 minutes on foot from the bus stop.</p></div>
               </div>
               <div className="flex gap-[16px]">
                 <div className="w-[36px] h-[36px] rounded-full bg-[#FEF3E2] flex items-center justify-center shrink-0 text-[#E8640C]"><Footprints size={18} /></div>
                 <div><h5 className="font-cabinet font-semibold text-[14px] text-[#1E1410]">On Foot</h5><p className="mt-[2px] font-jakarta text-[13px] text-[#6B4F3A] leading-[1.4]">If you are staying near the old city, it is a 15–18 minute walk via Suraj Pol road.</p></div>
               </div>
            </div>
            <div className="w-[280px] h-[220px] rounded-[14px] overflow-hidden relative border border-[#E8D5B7]">
               <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=60" alt="Map" className="w-full h-full object-cover opacity-60" />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                 <div className="w-[28px] h-[28px] rounded-full bg-[#E8640C] flex items-center justify-center shadow-lg border-2 border-white animate-bounce"><MapPin size={14} className="text-white" /></div>
               </div>
               <button className="absolute bottom-[10px] right-[10px] h-[32px] px-[10px] bg-white text-[#E8640C] border border-[#E8D5B7] rounded-[8px] font-cabinet font-semibold text-[12px] shadow-sm flex items-center gap-[4px]">
                 <Map size={12} /> Get Directions
               </button>
            </div>
          </div>
        </div>

        {/* ZONE 5 — NEXT STEPS */}
        <div className="mt-[32px] print:hidden">
          <p className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[1px]">What would you like to do next?</p>
          <div className="mt-[12px] grid grid-cols-3 gap-[16px]">
            <ActionCard type="profile" onAction={() => navigate('/healthcare')} />
            <ActionCard type="pharmacy" onAction={() => navigate('/healthcare?tab=Pharmacies')} />
            <ActionCard type="home" onAction={() => navigate('/home')} />
          </div>
        </div>

        {/* ZONE 6 — IMPORTANT NOTES */}
        <div className="mt-[32px] print:hidden">
          <ImportantNotes />
        </div>
      </div>
    </div>
  );
}
