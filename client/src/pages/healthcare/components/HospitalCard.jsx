import { MapPin, Phone, Building2, AlertTriangle, Ambulance, Cross } from "lucide-react";

export default function HospitalCard({ hospital, onViewDetails }) {
  return (
    <div className="bg-white border border-[#E8D5B7] rounded-[14px] overflow-hidden shadow-[0_2px_8px_rgba(30,20,16,0.07)]">
      <img src={hospital.photo} alt={hospital.name} className="w-full h-[140px] object-cover" />
      <div className="p-[16px]">
        <div className="flex items-start justify-between">
          <h4 className="font-cabinet font-bold text-[17px] text-[#1E1410]">{hospital.name}</h4>
          <span className={`px-[8px] py-[2px] rounded-[6px] font-mono-dm text-[10px] ${hospital.type === "Government" ? "bg-[rgba(45,106,79,0.10)] text-[#2D6A4F] border border-[rgba(45,106,79,0.20)]" : "bg-[#FEF3E2] text-[#6B4F3A] border border-[#E8D5B7]"}`}>{hospital.type}</span>
        </div>
        <div className="flex items-center gap-[6px] mt-[4px]"><Building2 size={13} className="text-[#B09880]" /><span className="font-jakarta text-[13px] text-[#6B4F3A]">{hospital.specialty}</span></div>
        <div className="flex items-center gap-[6px] mt-[6px]"><MapPin size={13} className="text-[#E8640C]" /><span className="font-jakarta text-[13px] text-[#6B4F3A]">{hospital.address}</span></div>
        <div className="flex items-center gap-[6px] mt-[6px]"><Phone size={13} className="text-[#B09880]" /><span className="font-mono-dm text-[12px] text-[#6B4F3A]">{hospital.phone}</span></div>

        <div className="border-t border-[#F5EDE0] my-[10px]" />

        <div className="grid grid-cols-3 text-center">
          <span className="font-mono-dm text-[10px] text-[#C0392B]">24/7 Emergency</span>
          <span className="font-mono-dm text-[10px] text-[#2D6A4F]">Ambulance</span>
          <span className="font-mono-dm text-[10px] text-[#E8640C]">{hospital.distance}</span>
        </div>

        <div className="mt-[10px] flex gap-[8px]">
          <button onClick={() => onViewDetails?.(hospital)} className="flex-1 h-[38px] rounded-[10px] border-[1.5px] border-[#E8640C] text-[#E8640C] font-cabinet font-semibold text-[13px]">View Details</button>
          <button className="flex-1 h-[38px] rounded-[10px] bg-[#E8640C] text-white font-cabinet font-semibold text-[13px]">Get Directions</button>
        </div>
      </div>
    </div>
  );
}

export function PharmacyCard({ pharmacy }) {
  const isOpen = pharmacy.status !== "Closed";
  return (
    <div className="bg-white border border-[#E8D5B7] rounded-[14px] p-[14px_16px] shadow-[0_2px_8px_rgba(30,20,16,0.07)]">
      <div className="flex items-start justify-between">
        <h4 className="font-cabinet font-semibold text-[15px] text-[#1E1410]">{pharmacy.name}</h4>
        <span className={`px-[8px] py-[2px] rounded-[6px] font-mono-dm text-[10px] ${isOpen ? "bg-[rgba(45,106,79,0.10)] text-[#2D6A4F]" : "bg-[#F5EDE0] text-[#B09880]"}`}>{pharmacy.status}</span>
      </div>
      <p className="font-mono-dm text-[10px] text-[#6B4F3A] mt-[4px]">{pharmacy.address}</p>
      <div className="flex items-center gap-[6px] mt-[8px]">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F0A500" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12h6M12 9v6"/></svg>
        <span className="font-jakarta text-[13px] text-[#6B4F3A]">Full range of medicines</span>
      </div>
      <div className="flex items-center gap-[6px] mt-[6px]">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#B09880" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        <span className="font-mono-dm text-[11px] text-[#1E1410]">{pharmacy.hours}</span>
      </div>
      <div className="border-t border-[#F5EDE0] my-[8px]" />
      <div className="flex items-center justify-between">
        <span className="font-mono-dm text-[11px] text-[#E8640C]">{pharmacy.distance} away</span>
        <button className="font-cabinet font-medium text-[12px] text-[#E8640C] flex items-center gap-[4px]">Get Directions <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
      </div>
    </div>
  );
}
