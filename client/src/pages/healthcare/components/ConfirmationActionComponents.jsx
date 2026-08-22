import { UserCircle, FileText, HeartPulse, Heart, Pill, Home, ArrowRight, Info, Phone, Car, Bus, Footprints, MapPin, Map } from "lucide-react";

export function RequirementCard({ type }) {
  const specs = {
    id: { icon: <UserCircle size={22} />, title: "Government ID", desc: "Aadhaar, Passport, or any photo ID. Required for registration at government hospitals.", color: "#E8640C", bg: "rgba(232,100,12,0.10)" },
    booking: { icon: <FileText size={22} />, title: "This Confirmation", desc: "Screenshot or print this page. Show the reference number at the reception counter.", color: "#2D6A4F", bg: "rgba(45,106,79,0.10)" },
    history: { icon: <HeartPulse size={22} />, title: "Medical History", desc: "Any previous prescriptions, test reports, or information about existing conditions.", color: "#C0392B", bg: "rgba(192,57,43,0.10)" }
  };
  const s = specs[type];
  return (
    <div className="bg-white border border-[#E8D5B7] rounded-[14px] p-[16px_18px] flex items-center gap-[12px] shadow-[0_2px_8px_rgba(30,20,16,0.06)] h-full">
      <div className="w-[44px] h-[44px] rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: s.bg, color: s.color }}>
        {s.icon}
      </div>
      <div>
        <h5 className="font-cabinet font-semibold text-[14px] text-[#1E1410]">{s.title}</h5>
        <p className="mt-[4px] font-jakarta text-[13px] text-[#6B4F3A] leading-[1.4]">{s.desc}</p>
      </div>
    </div>
  );
}

export function ActionCard({ type, onAction }) {
  const specs = {
    profile: { icon: <Heart size={20} />, title: "View Your Health Profile", desc: "This consultation has been saved to your health history.", link: "Open Health Profile →", color: "#E8640C", bg: "rgba(232,100,12,0.10)" },
    pharmacy: { icon: <Pill size={20} />, title: "Find a Nearby Pharmacy", desc: "Locate a pharmacy near the clinic to fill any prescriptions.", link: "Find Pharmacies →", color: "#F0A500", bg: "rgba(240,165,0,0.10)" },
    home: { icon: <Home size={20} />, title: "Go to Dashboard", desc: "Return to your trip and safety overview.", link: "Back to Dashboard →", color: "#2D6A4F", bg: "rgba(45,106,79,0.10)" }
  };
  const s = specs[type];
  return (
    <div className="bg-white border border-[#E8D5B7] rounded-[14px] p-[20px] shadow-[0_2px_8px_rgba(30,20,16,0.06)] flex flex-col h-full">
      <div className="w-[40px] h-[40px] rounded-[8px] flex items-center justify-center shrink-0" style={{ backgroundColor: s.bg, color: s.color }}>
        {s.icon}
      </div>
      <h5 className="mt-[10px] font-cabinet font-semibold text-[15px] text-[#1E1410]">{s.title}</h5>
      <p className="mt-[6px] font-jakarta text-[13px] text-[#6B4F3A] leading-[1.4] flex-1">{s.desc}</p>
      <button onClick={onAction} className="mt-[12px] flex items-center gap-[4px] font-cabinet font-medium text-[13px] text-[#E8640C] text-left">
        {s.link}
      </button>
    </div>
  );
}

export function ImportantNotes() {
  const notes = [
    "This is not a reserved appointment. Government hospital outpatient consultations are walk-in. Arrive a few minutes early and show your reference number at reception.",
    "Consultation fees listed are estimates. Actual fees may vary slightly. Payment is made directly at the clinic — My Itinerary does not process payments.",
    "If your condition is serious or worsening, do not wait for the appointment. Go directly to the hospital Emergency department or call 112."
  ];
  return (
    <div className="bg-[#FEF3E2] border border-[#E8D5B7] rounded-[14px] p-[20px_24px]">
      <p className="font-mono-dm text-[10px] text-[#B09880] uppercase tracking-wider">Important Notes</p>
      <div className="mt-[12px] space-y-[12px]">
        {notes.map((n, i) => (
          <div key={i} className="flex gap-[8px]">
            <Info size={14} className="text-[#F0A500] shrink-0 mt-[3px]" />
            <p className="font-jakarta text-[14px] text-[#6B4F3A] leading-[1.5]">{n}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
