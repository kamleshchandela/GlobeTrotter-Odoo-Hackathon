import { Star, MapPin, Stethoscope, Building2, Calendar, Phone, Share2, Download, CheckCircle2, Globe, IndianRupee, Clock, ArrowRight, Map } from "lucide-react";

export function DoctorHeroCard({ doctor, onBook }) {
  return (
    <div className="bg-white border border-[#E8D5B7] rounded-[16px] p-[24px] shadow-[0_4px_16px_rgba(30,20,16,0.10)] flex gap-[48px]">
      <div className="flex-1 flex gap-[16px]">
        <img src={doctor.avatar} alt={doctor.name} className="w-[100px] h-[100px] rounded-full object-cover border-2 border-[#E8D5B7]" />
        <div>
          <h1 className="font-display font-bold text-[28px] text-[#1E1410]">{doctor.name}</h1>
          <div className="flex gap-[8px] mt-[6px]">
            <span className="h-[24px] px-[8px] flex items-center gap-[4px] rounded-[6px] bg-[rgba(45,106,79,0.10)] border border-[rgba(45,106,79,0.20)] text-[#2D6A4F] font-mono-dm text-[10px] uppercase">
              <CheckCircle2 size={10} /> Verified Doctor
            </span>
            <span className="h-[24px] px-[8px] flex items-center rounded-[6px] bg-[#FEF3E2] border border-[#E8D5B7] text-[#6B4F3A] font-mono-dm text-[10px] uppercase">
              English Speaking
            </span>
          </div>
          <p className="font-mono-dm text-[11px] text-[#6B4F3A] uppercase mt-[6px] tracking-[0.5px]">{doctor.qualification} — {doctor.specialty}</p>
          <div className="mt-[8px] space-y-[4px]">
            <div className="flex items-center gap-[6px] text-[#6B4F3A] font-jakarta text-[14px]"><Stethoscope size={14} className="text-[#B09880]" /> {doctor.specialty}</div>
            <div className="flex items-center gap-[6px] text-[#6B4F3A] font-jakarta text-[14px]"><Building2 size={14} className="text-[#B09880]" /> {doctor.hospital}</div>
          </div>
          <div className="flex items-center gap-[8px] mt-[12px]">
            <div className="flex gap-[1px]">{[1,2,3,4].map(i => <Star key={i} size={14} fill="#F0A500" className="text-[#F0A500]" />)}<Star size={14} fill="#F0A500" className="text-[#F0A500]" style={{clipPath: "inset(0 50% 0 0)"}} /></div>
            <span className="font-cabinet font-semibold text-[15px] text-[#1E1410]">{doctor.rating}</span>
            <span className="font-jakarta text-[13px] text-[#B09880]">({doctor.reviewsCount} reviews)</span>
          </div>
          
          <div className="mt-[20px] flex border-t border-[#F5EDE0] pt-[20px]">
            <div className="flex-1 flex flex-col items-center border-r border-[#F5EDE0]">
              <span className="font-display font-bold text-[22px] text-[#1E1410]">{doctor.experience}</span>
              <span className="font-mono-dm text-[10px] text-[#B09880] uppercase">Experience</span>
            </div>
            <div className="flex-1 flex flex-col items-center border-r border-[#F5EDE0]">
              <span className="font-display font-bold text-[22px] text-[#1E1410]">{doctor.reviewsCount}</span>
              <span className="font-mono-dm text-[10px] text-[#B09880] uppercase">Reviews</span>
            </div>
            <div className="flex-1 flex flex-col items-center border-r border-[#F5EDE0]">
              <span className="font-cabinet font-semibold text-[14px] text-[#1E1410]">Hindi, English</span>
              <span className="font-mono-dm text-[10px] text-[#B09880] uppercase">Languages</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <span className="font-cabinet font-semibold text-[14px] text-[#2D6A4F]">Open Now</span>
              <span className="font-mono-dm text-[10px] text-[#B09880] uppercase">Availability</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[240px] flex flex-col">
        <p className="font-mono-dm text-[10px] text-[#B09880] uppercase">Consultation Fee</p>
        <span className="font-display font-bold text-[28px] text-[#1E1410]">{doctor.cost}</span>
        <span className="font-jakarta text-[12px] text-[#B09880]">per visit</span>
        
        <button onClick={onBook} className="mt-[16px] w-full h-[48px] bg-[#E8640C] rounded-[10px] text-white font-cabinet font-semibold text-[15px] shadow-[0_4px_16px_rgba(232,100,12,0.25)] flex items-center justify-center gap-[8px]">
          <Calendar size={16} /> Book Consultation
        </button>
        <button className="mt-[10px] w-full h-[44px] bg-white border-[1.5px] border-[#2D6A4F] rounded-[10px] text-[#2D6A4F] font-cabinet font-semibold text-[14px] flex items-center justify-center gap-[8px]">
          <Phone size={14} /> Call Clinic
        </button>
        <button className="mt-[10px] flex items-center justify-center gap-[8px] text-[#B09880] font-cabinet font-medium text-[13px]">
          <Share2 size={14} /> Share this profile
        </button>
      </div>
    </div>
  );
}

export function ConsultationInfo({ doctor }) {
  const rows = [
    { icon: <IndianRupee size={16} />, label: "Consultation Fee", value: `${doctor.cost} per visit` },
    { icon: <Clock size={16} />, label: "Clinic Hours", value: doctor.clinicHours },
    { icon: <MapPin size={16} />, label: "Address", value: doctor.address },
    { icon: <Phone size={16} />, label: "Contact", value: doctor.phone, isLink: true },
    { icon: <Globe size={16} />, label: "Languages", value: doctor.languages.join(", ") },
    { icon: <Building2 size={16} />, label: "Hospital Type", value: doctor.hospitalType },
  ];

  return (
    <div className="bg-white border border-[#E8D5B7] rounded-[14px] overflow-hidden shadow-[0_2px_8px_rgba(30,20,16,0.07)]">
      {rows.map((row, i) => (
        <div key={i} className={`h-[52px] px-[20px] flex items-center justify-between ${i % 2 === 0 ? "bg-[#FFFFFF]" : "bg-[rgba(245,237,224,0.30)]"}`}>
          <div className="flex items-center gap-[12px]">
            <span className="text-[#B09880]">{row.icon}</span>
            <span className="font-cabinet font-semibold text-[14px] text-[#1E1410]">{row.label}</span>
          </div>
          <span className={`font-mono-dm text-[12px] ${row.isLink ? "text-[#E8640C] underline cursor-pointer" : "text-[#1E1410]"}`}>{row.value}</span>
        </div>
      ))}
    </div>
  );
}

export function ReviewCard({ review }) {
  return (
    <div className="bg-white border border-[#E8D5B7] rounded-[12px] p-[16px] shadow-[0_2px_8px_rgba(30,20,16,0.06)]">
      <div className="flex justify-between items-start">
        <div className="flex gap-[12px]">
          <img src={review.avatar} alt="" className="w-[36px] h-[36px] rounded-full object-cover" />
          <div>
            <h5 className="font-cabinet font-semibold text-[14px] text-[#1E1410]">{review.name}</h5>
            <p className="font-mono-dm text-[10px] text-[#6B4F3A] uppercase">{review.city}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-mono-dm text-[10px] text-[#B09880]">{review.date}</span>
          <div className="flex gap-[1px] mt-[4px]">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < review.rating ? "#F0A500" : "none"} className={i < review.rating ? "text-[#F0A500]" : "text-[#E8D5B7]"} />)}
          </div>
        </div>
      </div>
      <div className="mt-[8px]">
        <span className="px-[8px] py-[2px] rounded-[6px] bg-[#FEF3E2] border border-[#E8D5B7] font-mono-dm text-[10px] text-[#6B4F3A]">{review.tag}</span>
      </div>
      <p className="mt-[10px] font-jakarta text-[14px] text-[#1E1410] leading-[1.6]">{review.body}</p>
    </div>
  );
}
