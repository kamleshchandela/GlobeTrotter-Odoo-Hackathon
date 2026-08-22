import { Phone, Mail, Globe, MapPin, Map, Clock, CheckCircle2, AlertTriangle, Car, Bus, Footprints } from "lucide-react";

export function ContactEmergencyPanel({ hospital }) {
  const contactRows = [
    { icon: <Phone size={16} />, label: "MAIN", value: hospital.phone, color: "#E8640C", link: `tel:${hospital.phone}` },
    { icon: <Phone size={16} />, label: "EMERGENCY", value: hospital.emergencyPhone, color: "#C0392B", link: `tel:${hospital.emergencyPhone}` },
    { icon: <Mail size={16} />, label: "EMAIL", value: hospital.email },
    { icon: <Globe size={16} />, label: "WEBSITE", value: hospital.website, link: `https://${hospital.website}` },
  ];

  return (
    <div className="sticky top-[96px] flex flex-col gap-[16px]">
      {/* Contact Block */}
      <div className="bg-white border border-[#E8D5B7] rounded-[14px] p-[16px] shadow-[0_2px_8px_rgba(30,20,16,0.07)]">
        <p className="font-mono-dm text-[10px] text-[#B09880] uppercase tracking-wider">Contact</p>
        <div className="mt-[10px] space-y-[0px]">
          {contactRows.map((row, i) => (
            <div key={i} className={`h-[40px] flex items-center justify-between ${i < contactRows.length - 1 ? "border-b border-[#F5EDE0]" : ""}`}>
              <div className="flex items-center gap-[12px]">
                <span className="text-[#B09880]">{row.icon}</span>
                <span className="font-mono-dm text-[10px] text-[#6B4F3A] uppercase">{row.label}</span>
              </div>
              {row.link ? (
                <a href={row.link} className="font-cabinet font-semibold text-[13px] underline" style={{ color: row.color || "#1E1410" }}>{row.value}</a>
              ) : (
                <span className="font-cabinet font-semibold text-[13px] text-[#1E1410]">{row.value}</span>
              )}
            </div>
          ))}
        </div>
        <button className="mt-[12px] w-full h-[42px] bg-[#E8640C] rounded-[10px] text-white font-cabinet font-semibold text-[13px] flex items-center justify-center gap-[8px] shadow-sm">
          <Map size={14} /> Get Directions
        </button>
        <button className="mt-[10px] w-full flex items-center justify-center gap-[8px] text-[#C0392B] font-cabinet font-medium text-[13px]">
          <Phone size={14} /> Call Emergency: {hospital.emergencyPhone}
        </button>
      </div>

      {/* Operating Hours */}
      <div className="bg-white border border-[#E8D5B7] rounded-[14px] p-[16px] shadow-[0_2px_8px_rgba(30,20,16,0.07)]">
        <p className="font-mono-dm text-[10px] text-[#B09880] uppercase tracking-wider">Operating Hours</p>
        <div className="mt-[10px] bg-[rgba(45,106,79,0.08)] border border-[rgba(45,106,79,0.20)] rounded-[8px] p-[8px_12px] flex items-center gap-[8px]">
          <CheckCircle2 size={14} className="text-[#2D6A4F]" />
          <span className="font-cabinet font-semibold text-[13px] text-[#2D6A4F]">Open Now · Emergency always open</span>
        </div>
        <div className="mt-[10px] space-y-[0px]">
          {hospital.hours.map((row, i) => (
            <div key={i} className={`h-[36px] px-[8px] flex items-center justify-between rounded-[6px] ${i === 0 ? "bg-[#F5EDE0]/50" : ""}`}>
              <span className="font-mono-dm text-[10px] text-[#6B4F3A]">{row.day}</span>
              <span className={`font-mono-dm text-[11px] ${row.highlight ? "text-[#2D6A4F] font-bold" : "text-[#1E1410]"}`}>{row.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mini Map */}
      <div className="bg-white border border-[#E8D5B7] rounded-[14px] overflow-hidden shadow-[0_2px_8px_rgba(30,20,16,0.07)]">
        <div className="h-[200px] relative">
           <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=60" alt="Map" className="w-full h-full object-cover opacity-60" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <div className="w-[28px] h-[28px] rounded-full bg-[#E8640C] flex items-center justify-center shadow-lg border-2 border-white animate-bounce"><MapPin size={14} className="text-white" /></div>
           </div>
           <button className="absolute bottom-[12px] right-[12px] h-[32px] px-[10px] bg-white text-[#E8640C] border border-[#E8D5B7] rounded-[8px] font-cabinet font-semibold text-[12px] shadow-sm flex items-center gap-[4px]">
             <Map size={12} /> Get Directions
           </button>
        </div>
        <div className="p-[10px]">
          <p className="font-jakarta text-[13px] text-[#6B4F3A]">{hospital.address.split(',').slice(0, 2).join(',')}</p>
          <p className="mt-[4px] font-mono-dm text-[11px] text-[#E8640C]">{hospital.distance} from your current location</p>
        </div>
      </div>

      {/* Emergency Numbers */}
      <div className="bg-[rgba(192,57,43,0.06)] border border-[rgba(192,57,43,0.25)] rounded-[14px] p-[16px]">
        <p className="font-mono-dm text-[10px] text-[#C0392B] uppercase tracking-wider">Emergency Numbers</p>
        <div className="mt-[10px] space-y-[0px]">
          {[
            { label: "Ambulance", val: "102" },
            { label: "National Emergency", val: "112" },
            { label: "Hospital Emergency", val: hospital.emergencyPhone },
            { label: "Tourist Helpline", val: "1363" }
          ].map((row, i) => (
            <div key={i} className={`h-[44px] flex items-center justify-between ${i < 3 ? "border-b border-[rgba(192,57,43,0.12)]" : ""}`}>
              <div className="flex items-center gap-[10px]">
                <Phone size={14} className="text-[#C0392B]" />
                <span className="font-mono-dm text-[10px] text-[#6B4F3A]">{row.label}</span>
              </div>
              <span className="font-display font-bold text-[20px] text-[#C0392B]">{row.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DirectionsInfo() {
  const transports = [
    { icon: <Car size={18} />, mode: "By Auto or Taxi", details: "Available from city center. Approx ₹50–80 from Udaipur City Palace. 8–12 min drive." },
    { icon: <Bus size={18} />, mode: "By Bus", details: "City bus routes 5 and 12 stop at Chetak Circle, 100m from the hospital entrance." },
    { icon: <Footprints size={18} />, mode: "From Chetak Circle", details: "Hospital entrance is 2 minutes on foot from the Chetak Circle landmark. Main gate faces north." },
  ];

  return (
    <div className="bg-white border border-[#E8D5B7] rounded-[16px] p-[24px] shadow-[0_2px_8px_rgba(30,20,16,0.07)] flex gap-[48px]">
      <div className="flex-[0.6]">
        <p className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px]">How to Get There</p>
        <div className="mt-[14px] space-y-[14px]">
          {transports.map((t, i) => (
            <div key={i} className="flex gap-[16px]">
              <div className="w-[36px] h-[36px] rounded-full bg-[#FEF3E2] flex items-center justify-center shrink-0 text-[#E8640C]">
                {t.icon}
              </div>
              <div>
                <h5 className="font-cabinet font-semibold text-[14px] text-[#1E1410]">{t.mode}</h5>
                <p className="mt-[2px] font-jakarta text-[13px] text-[#6B4F3A] leading-[1.4]">{t.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-[0.4] rounded-[12px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=60" alt="Map" className="w-full h-[240px] object-cover opacity-80" />
      </div>
    </div>
  );
}
