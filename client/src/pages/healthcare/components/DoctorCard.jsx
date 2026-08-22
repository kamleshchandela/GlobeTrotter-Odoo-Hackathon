import { MapPin, Star, Stethoscope, Building2, IndianRupee } from "lucide-react";

const STRIP_STYLES = {
  open: "bg-[#2D6A4F]",
  closing: "bg-[#F0A500]",
  closed: "bg-[#B09880]",
};

export default function DoctorCard({ doctor, onViewProfile, onBook }) {
  const stripStyle = doctor.status === "open" ? STRIP_STYLES.open : doctor.status === "closing" ? STRIP_STYLES.closing : STRIP_STYLES.closed;

  return (
    <div className="bg-white border border-[#E8D5B7] rounded-[14px] overflow-hidden shadow-[0_2px_8px_rgba(30,20,16,0.07)] hover:shadow-[0_4px_16px_rgba(30,20,16,0.12)] transition-shadow">
      {/* Status Strip */}
      <div className={`h-[8px] ${stripStyle} flex items-center justify-center`}>
        <span className="font-mono-dm text-[9px] text-white uppercase tracking-[0.5px]">{doctor.statusText}</span>
      </div>

      <div className="p-[14px]">
        {/* Row 1 — Identity */}
        <div className="flex items-start gap-[12px]">
          <img src={doctor.avatar} alt={doctor.name} className="w-[52px] h-[52px] rounded-full object-cover border-[1.5px] border-[#E8D5B7] shrink-0" />
          <div className="min-w-0">
            <h4 className="font-cabinet font-bold text-[15px] text-[#1E1410] truncate">{doctor.name}</h4>
            <p className="font-mono-dm text-[10px] text-[#6B4F3A] uppercase mt-[3px]">{doctor.qualification}</p>
            <span className="inline-flex items-center gap-[4px] mt-[4px] px-[8px] py-[2px] rounded-[6px] bg-[rgba(45,106,79,0.10)] border border-[rgba(45,106,79,0.20)]">
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M6 8l2 2 4-4" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="font-mono-dm text-[10px] text-[#2D6A4F]">Verified</span>
            </span>
          </div>
        </div>

        {/* Row 2 — Specialty & Hospital */}
        <div className="mt-[10px] flex flex-col gap-[4px]">
          <div className="flex items-center gap-[6px]"><Stethoscope size={13} className="text-[#B09880] shrink-0" /><span className="font-jakarta text-[13px] text-[#6B4F3A]">{doctor.specialty}</span></div>
          <div className="flex items-center gap-[6px]"><Building2 size={13} className="text-[#B09880] shrink-0" /><span className="font-jakarta text-[13px] text-[#6B4F3A] truncate">{doctor.hospital}</span></div>
        </div>

        {/* Row 3 — Languages */}
        <div className="mt-[8px] flex gap-[6px] flex-wrap">
          {doctor.languages.map(l => (
            <span key={l} className="px-[8px] py-[2px] rounded-[6px] bg-[#FEF3E2] border border-[#E8D5B7] font-mono-dm text-[10px] text-[#6B4F3A]">{l}</span>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[#F5EDE0] my-[10px]" />

        {/* Row 4 — Stats */}
        <div className="grid grid-cols-3 gap-0">
          <div className="flex flex-col items-center border-r border-[#F5EDE0]">
            <div className="flex items-center gap-[4px]"><MapPin size={12} className="text-[#E8640C]" /><span className="font-mono-dm text-[11px] text-[#E8640C]">{doctor.distance}</span></div>
          </div>
          <div className="flex flex-col items-center border-r border-[#F5EDE0]">
            <div className="flex items-center gap-[4px]"><IndianRupee size={12} className="text-[#B09880]" /><span className="font-mono-dm text-[11px] text-[#1E1410]">{doctor.cost}</span></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-[4px]"><Star size={12} className="text-[#F0A500]" fill="#F0A500" /><span className="font-mono-dm text-[11px] text-[#1E1410]">{doctor.rating}</span><span className="font-mono-dm text-[10px] text-[#B09880]">({doctor.reviewsCount})</span></div>
          </div>
        </div>

        {/* Row 5 — Actions */}
        <div className="mt-[12px] flex gap-[8px]">
          <button onClick={() => onViewProfile?.(doctor)} className="flex-1 h-[38px] rounded-[10px] border-[1.5px] border-[#E8640C] text-[#E8640C] font-cabinet font-semibold text-[13px]">View Profile</button>
          <button onClick={() => onBook?.(doctor)} className="flex-1 h-[38px] rounded-[10px] bg-[#E8640C] text-white font-cabinet font-semibold text-[13px] shadow-[0_2px_8px_rgba(232,100,12,0.25)]">Book Now</button>
        </div>
      </div>
    </div>
  );
}
