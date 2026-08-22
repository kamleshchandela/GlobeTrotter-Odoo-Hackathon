import { AlertTriangle, MapPin, Building2, Phone, Mail, Globe, Clock, CheckCircle2, ChevronRight, Map, Car, Bus, Footprints, Star } from "lucide-react";

export function HospitalHero({ hospital }) {
  return (
    <div className="relative w-full h-[280px] rounded-[16px] overflow-hidden shadow-[0_4px_20px_rgba(30,20,16,0.12)]">
      <img src={hospital.photo} alt={hospital.name} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(20,14,10,0.72)]" />
      
      <div className="absolute top-[24px] left-[24px]">
        <span className="h-[24px] px-[14px] flex items-center rounded-full bg-white/18 border border-white/30 text-white font-mono-dm text-[10px] uppercase tracking-wider">
          {hospital.type} Hospital
        </span>
      </div>

      <div className="absolute bottom-[24px] left-[24px]">
        <h1 className="font-display font-extrabold text-[40px] text-white leading-[1.0]">{hospital.name}</h1>
        <p className="mt-[8px] font-mono-dm text-[12px] text-white/60">{hospital.specialty} · {hospital.address.split(',').slice(-2).join(',').trim()}</p>
      </div>

      <div className="absolute bottom-[24px] right-[24px] bg-[rgba(192,57,43,0.85)] border border-white/20 rounded-[10px] p-[10px_16px] flex flex-col">
        <div className="flex items-center gap-[6px]">
          <AlertTriangle size={16} className="text-white" />
          <span className="font-cabinet font-bold text-[14px] text-white">24/7 Emergency</span>
        </div>
        <p className="mt-[2px] font-mono-dm text-[11px] text-white/80">Call 112 or {hospital.emergencyPhone}</p>
      </div>
    </div>
  );
}

export function HospitalStatsBar({ hospital }) {
  const stats = [
    { value: hospital.beds, label: "Beds" },
    { value: "24/7", label: "Emergency", isPositive: true },
    { value: hospital.deptCount, label: "Departments" },
    { value: "Available", label: "Ambulance" },
    { value: hospital.distance, label: "From You", isDistance: true },
    { value: hospital.type, label: "Type" },
  ];

  return (
    <div className="mt-[-24px] relative z-10 bg-white border border-[#E8D5B7] rounded-[14px] h-[72px] px-[24px] flex shadow-[0_4px_16px_rgba(30,20,16,0.10)]">
      {stats.map((s, i) => (
        <div key={i} className={`flex-1 flex flex-col items-center justify-center ${i < stats.length - 1 ? "border-r border-[#F5EDE0]" : ""}`}>
          <span className={`font-cabinet font-bold text-[16px] ${s.isPositive ? "text-[#2D6A4F]" : s.isDistance ? "text-[#E8640C]" : "text-[#1E1410]"}`}>
            {s.value}
          </span>
          <span className="mt-[3px] font-mono-dm text-[10px] text-[#B09880] uppercase">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export function DepartmentCard({ dept }) {
  const getIcon = () => {
    switch (dept.icon) {
      case 'cross': return <AlertTriangle size={20} />;
      case 'heart': return <Star size={20} />;
      case 'baby': return <Building2 size={20} />;
      case 'bone': return <MapPin size={20} />;
      case 'eye': return <Globe size={20} />;
      case 'steth': return <Building2 size={20} />;
      case 'tooth': return <CheckCircle2 size={20} />;
      case 'flask': return <Clock size={20} />;
      default: return <Building2 size={20} />;
    }
  };

  return (
    <div className="bg-white border border-[#E8D5B7] rounded-[12px] p-[14px_16px] flex items-center gap-[12px] shadow-[0_2px_8px_rgba(30,20,16,0.06)]">
      <div className="w-[40px] h-[40px] rounded-[8px] flex items-center justify-center shrink-0" style={{ backgroundColor: `${dept.color}14`, color: dept.color }}>
        {getIcon()}
      </div>
      <div>
        <h4 className="font-cabinet font-semibold text-[14px] text-[#1E1410]">{dept.name}</h4>
        <p className={`font-mono-dm text-[10px] uppercase ${dept.status.includes('Open') ? 'text-[#2D6A4F]' : 'text-[#6B4F3A]'}`}>
          {dept.status}
        </p>
      </div>
    </div>
  );
}

export function DoctorCompactRow({ doctor, onBook }) {
  return (
    <div className="bg-white border border-[#E8D5B7] rounded-[12px] p-[12px_16px] h-[68px] flex items-center shadow-[0_2px_8px_rgba(30,20,16,0.06)]">
      <img src={doctor.avatar} alt={doctor.name} className="w-[44px] h-[44px] rounded-full object-cover shrink-0" />
      <div className="ml-[12px] flex-1 min-w-0">
        <h5 className="font-cabinet font-semibold text-[14px] text-[#1E1410] truncate">{doctor.name}</h5>
        <div className="flex items-center gap-[6px]">
          <span className="font-jakarta text-[12px] text-[#6B4F3A]">{doctor.specialty}</span>
          <div className="flex gap-[4px]">
            {doctor.languages.slice(0, 2).map(l => (
              <span key={l} className="px-[6px] py-[1px] rounded-[4px] bg-[#FEF3E2] border border-[#E8D5B7] font-mono-dm text-[9px] text-[#6B4F3A]">{l}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end shrink-0 ml-[12px]">
        <span className="font-mono-dm text-[10px] text-[#2D6A4F]">Open Now</span>
        <span className="font-mono-dm text-[11px] text-[#1E1410]">{doctor.cost}</span>
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onBook(doctor); }} 
          className="mt-[4px] w-[52px] h-[32px] bg-[#E8640C] rounded-[8px] text-white font-cabinet font-semibold text-[12px] flex items-center justify-center"
        >
          Book
        </button>
      </div>
    </div>
  );
}
