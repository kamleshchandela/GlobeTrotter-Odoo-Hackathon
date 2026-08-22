import { useState, useEffect } from "react";
import { Check, Download, Share2, MapPin, Phone, ArrowRight, UserCircle, FileText, HeartPulse, Stethoscope, Building2, Map, Car, Bus, Footprints, Heart, Pill, Home, Info } from "lucide-react";

export function SuccessHero() {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center max-w-[480px] mx-auto">
      <div className="w-[88px] h-[88px] rounded-full bg-[rgba(45,106,79,0.10)] border-2 border-[#2D6A4F] flex items-center justify-center">
        <Check size={40} className="text-[#2D6A4F] animate-in fade-in zoom-in duration-700" />
      </div>
      <h1 className="mt-[20px] font-display font-bold text-[36px] text-[#1E1410] text-center leading-[1.1]">
        Your consultation is confirmed.
      </h1>
      <p className="mt-[12px] font-jakarta text-[15px] text-[#6B4F3A] text-center leading-[1.6] max-w-[440px]">
        A summary has been saved to your health profile. Show the confirmation below at the clinic.
      </p>
      <div className="mt-[20px] flex gap-[12px]">
        <button 
          onClick={handleDownload}
          className="h-[44px] px-[16px] bg-white border-[1.5px] border-[#E8640C] text-[#E8640C] font-cabinet font-semibold text-[14px] rounded-[12px] flex items-center gap-[8px] transition-all hover:bg-[#FFF8F0]"
        >
          {downloading ? <div className="w-[14px] h-[14px] border-2 border-[#E8640C]/30 border-t-[#E8640C] rounded-full animate-spin" /> : <Download size={14} />}
          {downloading ? "Preparing PDF..." : downloaded ? "Downloaded" : "Download Confirmation"}
        </button>
        <button 
          onClick={() => navigator.share?.({ title: 'Doctor Appointment', text: 'My doctor appointment is confirmed.', url: window.location.href })}
          className="h-[44px] px-[16px] bg-white border border-[#E8D5B7] text-[#6B4F3A] font-cabinet font-semibold text-[14px] rounded-[12px] flex items-center gap-[8px] transition-all hover:bg-[#F5EDE0]"
        >
          <Share2 size={14} /> Share
        </button>
      </div>
    </div>
  );
}

export function ConfirmationCard({ doctor }) {
  return (
    <div className="bg-white border border-[#E8D5B7] rounded-[16px] overflow-hidden shadow-[0_4px_20px_rgba(30,20,16,0.10)] print:shadow-none print:border print:border-[#E8D5B7]">
      <div className="h-[8px] bg-[#2D6A4F]" />
      <div className="p-[24px]">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-mono-dm text-[10px] text-[#B09880] uppercase">Consultation Booking</p>
            <h3 className="mt-[6px] font-display font-bold text-[18px] text-[#1E1410]">#MYI-2025-0514-KS</h3>
            <p className="mt-[4px] font-jakarta text-[12px] text-[#B09880]">Booking confirmed on May 11, 2025 at 3:42 PM</p>
          </div>
          <div className="bg-[rgba(45,106,79,0.10)] border border-[rgba(45,106,79,0.30)] rounded-full px-[14px] py-[6px]">
            <span className="font-mono-dm text-[11px] text-[#2D6A4F] font-bold">CONFIRMED</span>
          </div>
        </div>
      </div>

      <div className="border-t border-[#F5EDE0]" />

      <div className="p-[20px] flex gap-[24px]">
        <div className="flex-1 flex gap-[12px]">
          <img src={doctor.avatar} alt="" className="w-[56px] h-[56px] rounded-full object-cover border-[1.5px] border-[#E8D5B7]" />
          <div>
            <h4 className="font-cabinet font-bold text-[17px] text-[#1E1410]">{doctor.name}</h4>
            <p className="mt-[3px] font-jakarta text-[13px] text-[#6B4F3A]">{doctor.specialty}</p>
            <p className="mt-[3px] font-jakarta text-[13px] text-[#6B4F3A]">{doctor.hospital}</p>
            <div className="mt-[4px] inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-[6px] bg-[rgba(45,106,79,0.10)] border border-[rgba(45,106,79,0.20)]">
               <Check size={10} className="text-[#2D6A4F]" />
               <span className="font-mono-dm text-[9px] text-[#2D6A4F] uppercase">Verified</span>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-[8px]">
          <div className="flex justify-between items-center"><span className="font-mono-dm text-[10px] text-[#B09880] uppercase">Date</span><span className="font-cabinet font-semibold text-[14px] text-[#1E1410]">Wednesday, May 14, 2025</span></div>
          <div className="flex justify-between items-center"><span className="font-mono-dm text-[10px] text-[#B09880] uppercase">Time</span><span className="font-cabinet font-semibold text-[14px] text-[#1E1410]">11:00 AM</span></div>
          <div className="flex justify-between items-center"><span className="font-mono-dm text-[10px] text-[#B09880] uppercase">Type</span><span className="font-cabinet font-semibold text-[14px] text-[#1E1410]">Outpatient (Walk-in)</span></div>
          <div className="flex justify-between items-center"><span className="font-mono-dm text-[10px] text-[#B09880] uppercase">Fee</span><span className="font-cabinet font-semibold text-[14px] text-[#1E1410]">₹300–500 (Pay at clinic)</span></div>
        </div>
      </div>

      <div className="border-t border-[#F5EDE0]" />

      <div className="p-[20px]">
        <div className="flex items-center gap-[8px]">
          <MapPin size={16} className="text-[#E8640C]" />
          <span className="font-cabinet font-semibold text-[14px] text-[#1E1410]">{doctor.address}</span>
        </div>
        <p className="mt-[6px] font-mono-dm text-[11px] text-[#E8640C]">1.2 km from your current location</p>
        <div className="mt-[6px] flex items-center gap-[6px]">
          <Phone size={13} className="text-[#B09880]" />
          <a href={`tel:${doctor.phone}`} className="font-cabinet font-medium text-[13px] text-[#6B4F3A] underline">{doctor.phone}</a>
        </div>
        <button className="mt-[12px] flex items-center gap-[4px] font-cabinet font-medium text-[13px] text-[#E8640C]">Get Directions <ArrowRight size={14} /></button>
      </div>

      <div className="border-t border-[#F5EDE0]" />

      <div className="p-[20px]">
        <p className="font-mono-dm text-[10px] text-[#B09880] uppercase">Your Notes</p>
        <p className="mt-[6px] font-jakarta text-[14px] text-[#1E1410] leading-[1.6]">
          Experiencing nausea and mild fever since yesterday. Possibly food-related.
        </p>
      </div>

      <div className="bg-[#FEF3E2] p-[16px] flex flex-col items-center">
        <p className="font-jakarta text-[13px] text-[#6B4F3A]">Show this confirmation at the clinic reception.</p>
        <p className="mt-[4px] font-mono-dm text-[11px] text-[#1E1410] font-bold uppercase tracking-wider">Reference: #MYI-2025-0514-KS</p>
      </div>
    </div>
  );
}
