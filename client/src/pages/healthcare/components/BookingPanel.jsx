import { useState } from "react";
import { X, Calendar, Clock, Lock, Phone, ChevronRight } from "lucide-react";

const DATES = [
  { day: "WED", date: "14", full: false },
  { day: "THU", date: "15", full: false },
  { day: "FRI", date: "16", full: true },
  { day: "SAT", date: "17", full: false },
  { day: "MON", date: "19", full: false },
  { day: "TUE", date: "20", full: false },
  { day: "WED", date: "21", full: false },
];

const TIMES = ["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

export default function BookingPanel({ doctor, isOpen, onClose, isFixed = false }) {
  const [selectedDate, setSelectedDate] = useState("14");
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [patientType, setPatientType] = useState("First Consultation");
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.href = "/healthcare/confirmation";
    }, 1500);
  };

  const content = (
    <div className={`flex flex-col h-full ${isFixed ? "p-[32px]" : "p-[20px]"}`}>
      {/* Header */}
      <div className="relative mb-[20px]">
        <p className="font-mono-dm text-[11px] text-[#B09880] uppercase">Book a Consultation</p>
        <div className="flex items-center gap-[12px] mt-[14px]">
          <img src={doctor.avatar} alt="" className="w-[40px] h-[40px] rounded-full object-cover" />
          <div>
            <h4 className="font-cabinet font-semibold text-[14px] text-[#1E1410]">{doctor.name}</h4>
            <p className="font-jakarta text-[12px] text-[#6B4F3A]">{doctor.specialty}</p>
          </div>
        </div>
        {isFixed && <button onClick={onClose} className="absolute top-0 right-0 p-1"><X size={18} className="text-[#B09880]" /></button>}
      </div>

      <div className="mb-[14px]">
        <span className="font-display font-bold text-[24px] text-[#1E1410]">{doctor.cost}</span>
        <span className="font-jakarta text-[12px] text-[#B09880] ml-[6px]">per visit</span>
      </div>

      {/* Date Selector */}
      <div className="mb-[16px]">
        <p className="font-mono-dm text-[10px] text-[#B09880] uppercase">Select Date</p>
        <div className="flex gap-[8px] overflow-x-auto scrollbar-none mt-[8px] pb-[4px]">
          {DATES.map(d => (
            <button
              key={d.date}
              disabled={d.full}
              onClick={() => setSelectedDate(d.date)}
              className={`flex flex-col items-center justify-center min-w-[56px] h-[60px] rounded-[10px] border transition-all ${d.full ? "bg-[#F5EDE0] border-[#E8D5B7] opacity-60 cursor-not-allowed" : selectedDate === d.date ? "bg-[#E8640C] border-[#E8640C] text-white" : "bg-white border-[#E8D5B7] text-[#1E1410]"}`}
            >
              <span className={`font-mono-dm text-[10px] ${selectedDate === d.date ? "text-white" : "text-[#B09880]"}`}>{d.day}</span>
              <span className="font-display font-bold text-[18px]">{d.date}</span>
              {d.full && <span className="font-mono-dm text-[9px] text-[#B09880]">Full</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Time Selector */}
      <div className="mb-[14px]">
        <p className="font-mono-dm text-[10px] text-[#B09880] uppercase">Select Time</p>
        <div className="grid grid-cols-3 gap-[8px] mt-[8px]">
          {TIMES.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTime(t)}
              className={`h-[36px] rounded-[8px] border font-mono-dm text-[11px] transition-all ${selectedTime === t ? "bg-[#E8640C] border-[#E8640C] text-white" : "bg-white border-[#E8D5B7] text-[#1E1410]"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Type */}
      <div className="mb-[12px]">
        <p className="font-mono-dm text-[10px] text-[#B09880] uppercase">Visiting As</p>
        <div className="flex gap-[8px] mt-[8px]">
          {["Outpatient (Walk-in)", "First Consultation"].map(type => (
            <button
              key={type}
              onClick={() => setPatientType(type)}
              className={`px-[12px] h-[32px] rounded-full border font-cabinet font-medium text-[12px] transition-all ${patientType === type ? "bg-[#E8640C] border-[#E8640C] text-white" : "bg-white border-[#E8D5B7] text-[#6B4F3A]"}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mb-[12px]">
        <p className="font-mono-dm text-[10px] text-[#B09880] uppercase">Notes (Optional)</p>
        <textarea
          placeholder="Describe your symptoms or reason for visit..."
          className="w-full h-[72px] mt-[8px] p-[10px_12px] border-[1.5px] border-[#E8D5B7] rounded-[8px] font-jakarta text-[14px] text-[#1E1410] outline-none focus:border-[#E8640C] transition-colors resize-none"
        />
      </div>

      <div className="border-t border-[#F5EDE0] mt-auto pt-[12px]">
        <div className="flex items-center justify-between mb-[8px]">
          <span className="font-jakarta text-[13px] text-[#6B4F3A]">Consultation</span>
          <span className="font-mono-dm text-[12px] text-[#1E1410]">{doctor.cost}</span>
        </div>
        <div className="flex items-center justify-between mb-[12px]">
          <span className="font-cabinet font-semibold text-[13px] text-[#1E1410]">Total estimate</span>
          <span className="font-display font-bold text-[18px] text-[#E8640C]">{doctor.cost}</span>
        </div>

        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full h-[48px] bg-[#E8640C] rounded-[10px] text-white font-cabinet font-semibold text-[15px] shadow-[0_4px_16px_rgba(232,100,12,0.25)] flex items-center justify-center gap-[8px]"
        >
          {loading ? <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Confirm Booking"}
        </button>

        <div className="mt-[8px] flex items-center justify-center gap-[6px]">
          <Lock size={12} className="text-[#B09880]" />
          <span className="font-jakarta text-[12px] text-[#B09880]">Your booking is free to make. Pay at the clinic.</span>
        </div>
        <button className="mt-[8px] w-full flex items-center justify-center gap-[6px] text-[#E8640C] font-cabinet font-medium text-[12px]">
          <Phone size={12} /> Call instead: {doctor.phone}
        </button>
      </div>
    </div>
  );

  if (isFixed) {
    return (
      <div className={`fixed right-0 top-[72px] h-[calc(100vh-72px)] bg-white border-l border-[#E8D5B7] shadow-[-8px_0_32px_rgba(30,20,16,0.14)] z-[60] transition-transform duration-300 ${isOpen ? "translate-x-0 w-[480px]" : "translate-x-full w-[480px]"}`}>
        {content}
      </div>
    );
  }

  return (
    <div className="sticky top-[96px] bg-white border border-[#E8D5B7] rounded-[16px] shadow-[0_4px_16px_rgba(30,20,16,0.10)] w-[360px] overflow-hidden">
      {content}
    </div>
  );
}
