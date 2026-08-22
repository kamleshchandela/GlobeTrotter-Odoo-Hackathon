import { useState } from "react";
import { MapPin, Clock, Users, Star, Bookmark, Plus, X, ChevronRight, ChevronLeft } from "lucide-react";
import TopAppBar from "../../components/shared/TopAppBar";

/* ================================================================
   PAGE 6 — Local Experiences
   Desktop 1440px · #FFF8F0 · 1200px content
   ================================================================ */

const PHOTOS = {
  hero1: "https://images.unsplash.com/photo-1524230507669-5ff97982bb44?auto=format&fit=crop&w=600&q=80",
  hero2: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80",
  hero3: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=80",
  featured: "https://images.unsplash.com/photo-1524230507669-5ff97982bb44?auto=format&fit=crop&w=900&q=80",
  pottery: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80",
  cooking: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=80",
  desert: "https://images.unsplash.com/photo-1506038634487-60a69ae4b7b1?auto=format&fit=crop&w=600&q=80",
  blockprint: "https://images.unsplash.com/photo-1567361808960-dec9cb578182?auto=format&fit=crop&w=600&q=80",
  rann: "https://images.unsplash.com/photo-1583396618422-fec82fea3b69?auto=format&fit=crop&w=600&q=80",
  yoga: "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=600&q=80",
};

const FEATURED = {
  name:"Manganiyar Folk Music at Sunset",
  loc:"Jaisalmer Fort Courtyard",
  cat:"Cultural Performance",
  dur:"2 hours",
  max:"Max 20 people",
  price:"₹800 per person",
  host:"Salim Khan",
  desc:"The Manganiyars are hereditary musicians of Rajasthan. Watch them perform traditional folk music in the intimate courtyard of a 600-year-old haveli at golden hour. One of the most genuine cultural experiences in Rajasthan.",
  dates:[{d:"May 11",ok:true},{d:"May 12",ok:true},{d:"May 13",ok:false},{d:"May 14",ok:true},{d:"May 15",ok:true}],
};

const EXPERIENCES = [
  { name:"Pottery Workshop with Local Artisan", loc:"Jaipur, Rajasthan", dur:"3 hours · Half Day", price:"₹1,200", cat:"Workshop", photo:PHOTOS.pottery, host:"Ramesh P.", rating:"4.8", reviews:42, dates:[{d:"May 11",ok:true},{d:"May 13",ok:true},{d:"May 14",ok:false}] },
  { name:"Rajasthani Home Cooking Class", loc:"Udaipur, Rajasthan", dur:"4 hours · Half Day", price:"₹1,500", cat:"Food", photo:PHOTOS.cooking, host:"Sunita D.", rating:"4.9", reviews:68, dates:[{d:"May 12",ok:true},{d:"May 14",ok:true}] },
  { name:"Overnight Desert Safari", loc:"Jaisalmer, Rajasthan", dur:"Full Day", price:"₹3,500", cat:"Adventure", photo:PHOTOS.desert, host:"Ahmed K.", rating:"4.7", reviews:31, dates:[{d:"May 11",ok:true},{d:"May 15",ok:true}] },
  { name:"Block Print Textile Workshop", loc:"Sanganer, Rajasthan", dur:"Half Day", price:"₹800", cat:"Workshop", photo:PHOTOS.blockprint, host:"Kavita J.", rating:"4.9", reviews:55, dates:[{d:"May 12",ok:true},{d:"May 13",ok:true}] },
  { name:"Rann Utsav Day Experience", loc:"Rann of Kutch, Gujarat", dur:"Full Day", price:"₹2,000", cat:"Cultural", photo:PHOTOS.rann, host:"Bharat M.", rating:"4.6", reviews:24, dates:[{d:"May 14",ok:true},{d:"May 15",ok:true}] },
  { name:"Morning Yoga by the Ganga", loc:"Rishikesh, Uttarakhand", dur:"2 hours", price:"₹500", cat:"Spiritual", photo:PHOTOS.yoga, host:"Anjali S.", rating:"4.8", reviews:89, dates:[{d:"May 11",ok:true},{d:"May 12",ok:true},{d:"May 13",ok:true}] },
];

const CAT_CHIPS = ["All","Workshops","Day Trips","Food","Cultural","Adventure","Spiritual","Festivals"];
const DUR_CHIPS = ["Any","Half Day","Full Day","Multi-Day"];
const PRICE_CHIPS = ["Any Budget","Under ₹500","₹500–2,000","₹2,000+"];

const Tag = ({children}) => <span className="px-[8px] py-[3px] rounded-[6px] bg-[#FEF3E2] border border-[#E8D5B7] font-mono-dm text-[10px] text-[#6B4F3A]">{children}</span>;
const DatePill = ({d, ok, selected, onClick}) => (
  <button onClick={onClick} className={`shrink-0 h-[28px] px-[12px] rounded-[100px] font-mono-dm text-[10px] transition-colors ${selected ? "bg-[#E8640C] text-white" : ok ? "bg-[rgba(45,106,79,0.10)] text-[#2D6A4F]" : "bg-[#F5EDE0] text-[#B09880]"}`} disabled={!ok}>{d}</button>
);

/* ============ Booking Modal ============ */
function BookingModal({ exp, onClose }) {
  const [step, setStep] = useState(1);
  const [selDate, setSelDate] = useState("");
  const [groupSize, setGroupSize] = useState(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(20,14,10,0.50)]" onClick={onClose}>
      <div className="w-[520px] bg-white rounded-[16px] shadow-[0_16px_48px_rgba(30,20,16,0.20)] overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-[24px] py-[16px] border-b border-[#E8D5B7] flex items-center justify-between">
          <h3 className="font-cabinet font-bold text-[18px] text-[#1E1410]">Book Experience</h3>
          <button onClick={onClose}><X size={18} className="text-[#B09880]" /></button>
        </div>
        {/* Progress */}
        <div className="px-[24px] pt-[16px] flex gap-[8px] justify-center">
          {[1,2,3].map(s => (
            <div key={s} className={`w-[28px] h-[28px] rounded-full flex items-center justify-center font-cabinet font-bold text-[12px] ${step >= s ? "bg-[#E8640C] text-white" : "bg-[#FEF3E2] text-[#B09880]"}`}>{s}</div>
          ))}
        </div>
        {/* Steps */}
        <div className="p-[24px]">
          {step === 1 && (
            <div>
              <p className="font-cabinet font-semibold text-[15px] text-[#1E1410]">Pick a date</p>
              <div className="mt-[12px] flex gap-[8px] flex-wrap">
                {(exp.dates || FEATURED.dates).map(dt => (
                  <DatePill key={dt.d} d={dt.d} ok={dt.ok} selected={selDate === dt.d} onClick={() => dt.ok && setSelDate(dt.d)} />
                ))}
              </div>
              <button disabled={!selDate} onClick={() => setStep(2)} className={`mt-[20px] w-full h-[44px] rounded-[10px] font-cabinet font-semibold text-[14px] transition-colors ${selDate ? "bg-[#E8640C] text-white" : "bg-[#F5EDE0] text-[#B09880]"}`}>Continue</button>
            </div>
          )}
          {step === 2 && (
            <div>
              <p className="font-cabinet font-semibold text-[15px] text-[#1E1410]">Group size</p>
              <div className="mt-[12px] flex items-center gap-[16px]">
                <button onClick={() => groupSize > 1 && setGroupSize(groupSize-1)} className="w-[36px] h-[36px] rounded-full border border-[#E8D5B7] flex items-center justify-center font-cabinet font-bold text-[16px] text-[#6B4F3A]">−</button>
                <span className="font-display font-bold text-[28px] text-[#1E1410]">{groupSize}</span>
                <button onClick={() => setGroupSize(groupSize+1)} className="w-[36px] h-[36px] rounded-full border border-[#E8D5B7] flex items-center justify-center font-cabinet font-bold text-[16px] text-[#6B4F3A]">+</button>
              </div>
              <div className="mt-[16px] flex gap-[10px]">
                <button onClick={() => setStep(1)} className="flex-1 h-[44px] rounded-[10px] border border-[#E8D5B7] font-cabinet font-semibold text-[14px] text-[#6B4F3A]">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 h-[44px] rounded-[10px] bg-[#E8640C] text-white font-cabinet font-semibold text-[14px]">Continue</button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <p className="font-cabinet font-semibold text-[15px] text-[#1E1410]">Payment summary</p>
              <div className="mt-[12px] bg-[#FEF3E2] rounded-[10px] p-[16px] flex flex-col gap-[8px]">
                <div className="flex justify-between"><span className="font-jakarta text-[13px] text-[#6B4F3A]">Date</span><span className="font-mono-dm text-[12px] text-[#1E1410]">{selDate}</span></div>
                <div className="flex justify-between"><span className="font-jakarta text-[13px] text-[#6B4F3A]">Group size</span><span className="font-mono-dm text-[12px] text-[#1E1410]">{groupSize} people</span></div>
                <div className="border-t border-[#E8D5B7] my-[4px]" />
                <div className="flex justify-between"><span className="font-cabinet font-semibold text-[14px] text-[#1E1410]">Total</span><span className="font-display font-bold text-[20px] text-[#E8640C]">₹{(parseInt((exp?.price || "₹800").replace(/[^\d]/g,"")) * groupSize).toLocaleString()}</span></div>
              </div>
              <div className="mt-[16px] flex gap-[10px]">
                <button onClick={() => setStep(2)} className="flex-1 h-[44px] rounded-[10px] border border-[#E8D5B7] font-cabinet font-semibold text-[14px] text-[#6B4F3A]">Back</button>
                <button className="flex-1 h-[44px] rounded-[10px] bg-[#E8640C] text-white font-cabinet font-semibold text-[14px]">Confirm Booking</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============ Experience Card ============ */
function ExpCard({ exp, onBook }) {
  const [selDate, setSelDate] = useState("");
  return (
    <div className="bg-white border border-[#E8D5B7] rounded-[14px] overflow-hidden shadow-[0_2px_8px_rgba(30,20,16,0.07)]">
      <img src={exp.photo} alt={exp.name} className="w-full h-[180px] object-cover" />
      <div className="p-[16px]">
        <div className="flex items-center justify-between">
          <Tag>{exp.cat}</Tag>
          <span className="font-mono-dm text-[10px] text-[#B09880]">{exp.dur}</span>
        </div>
        <h4 className="font-cabinet font-semibold text-[16px] text-[#1E1410] mt-[8px]">{exp.name}</h4>
        <div className="flex items-center gap-[4px] mt-[4px]"><MapPin size={11} className="text-[#E8640C]" /><span className="font-mono-dm text-[10px] text-[#6B4F3A]">{exp.loc}</span></div>
        {/* Dates */}
        <div className="mt-[8px] flex gap-[6px] overflow-x-auto scrollbar-none">
          {exp.dates.map(dt => <DatePill key={dt.d} d={dt.d} ok={dt.ok} selected={selDate === dt.d} onClick={() => dt.ok && setSelDate(dt.d)} />)}
        </div>
        <div className="mt-[12px] flex items-baseline gap-[6px]">
          <span className="font-display font-bold text-[18px] text-[#E8640C]">{exp.price}</span>
          <span className="font-jakarta text-[12px] text-[#6B4F3A]">per person</span>
        </div>
      </div>
      {/* Divider + bottom */}
      <div className="border-t border-[#F5EDE0] px-[16px] py-[12px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[4px]">
            {[1,2,3].map(s => <Star key={s} size={10} className="text-[#F0A500]" fill="currentColor" />)}
            <span className="font-jakarta text-[12px] text-[#6B4F3A] ml-[4px]">{exp.rating} ({exp.reviews} reviews)</span>
          </div>
          <div className="flex items-center gap-[6px]">
            <div className="w-[24px] h-[24px] rounded-full bg-[#FEF3E2] flex items-center justify-center"><span className="font-cabinet font-bold text-[9px] text-[#6B4F3A]">{exp.host[0]}</span></div>
            <span className="font-jakarta text-[12px] text-[#B09880]">{exp.host}</span>
          </div>
        </div>
        <div className="mt-[8px] flex items-center justify-between">
          <button className="font-cabinet font-medium text-[12px] text-[#E8640C] flex items-center gap-[4px]"><Plus size={12} /> Add to Trip Day</button>
          <button onClick={() => onBook(exp)} className="h-[32px] px-[16px] rounded-[8px] bg-[#E8640C] text-white font-cabinet font-semibold text-[12px]">Book</button>
        </div>
      </div>
    </div>
  );
}

/* ============================ MAIN ============================ */
export default function LocalExperiences() {
  const [activeCat, setActiveCat] = useState("All");
  const [activeDur, setActiveDur] = useState("Any");
  const [activePrice, setActivePrice] = useState("Any Budget");
  const [bookingExp, setBookingExp] = useState(null);
  const [featSelDate, setFeatSelDate] = useState("");

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <TopAppBar variant="logo" />

      <div className="max-w-[1200px] mx-auto px-[24px] pt-[64px] pb-[80px]">

        {/* Page Hero */}
        <div className="flex items-start justify-between gap-[48px]">
          {/* Left 55% */}
          <div className="max-w-[55%]">
            <p className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px]">Local Experiences</p>
            <h1 className="font-display font-bold text-[44px] text-[#1E1410] leading-[1.1] mt-[8px]">Things to do. Locally made.</h1>
            <p className="font-jakarta text-[16px] text-[#6B4F3A] leading-[1.6] mt-[12px] max-w-[480px]">Activities, workshops, events, and day trips curated by people who actually live here.</p>
            <div className="mt-[24px]">
              <div className="inline-flex items-center gap-[8px] bg-[#FEF3E2] border border-[#E8D5B7] rounded-[100px] h-[40px] px-[16px]">
                <MapPin size={14} className="text-[#E8640C]" />
                <span className="font-cabinet font-semibold text-[15px] text-[#1E1410]">Jaisalmer, Rajasthan</span>
              </div>
              <button className="block font-cabinet font-medium text-[13px] text-[#E8640C] mt-[6px]">Change city</button>
            </div>
          </div>
          {/* Right 45% — Photo collage */}
          <div className="relative w-[420px] h-[260px] shrink-0">
            <img src={PHOTOS.hero1} alt="Folk music" className="absolute top-0 left-0 w-[240px] h-[200px] rounded-[14px] object-cover shadow-[0_4px_16px_rgba(30,20,16,0.12)]" />
            <img src={PHOTOS.hero2} alt="Pottery" className="absolute bottom-0 right-0 w-[180px] h-[160px] rounded-[14px] object-cover shadow-[0_4px_16px_rgba(30,20,16,0.12)]" />
            <img src={PHOTOS.hero3} alt="Cooking" className="absolute top-[8px] right-[40px] w-[140px] h-[120px] rounded-[14px] object-cover shadow-[0_4px_16px_rgba(30,20,16,0.12)] rotate-[3deg]" />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-[32px] bg-white border border-[#E8D5B7] rounded-[12px] px-[20px] py-[14px] flex items-center gap-[20px]">
          {/* Category */}
          <div className="flex gap-[6px] overflow-x-auto scrollbar-none">
            {CAT_CHIPS.map(c => (
              <button key={c} onClick={() => setActiveCat(c)} className={`shrink-0 h-[32px] px-[14px] rounded-[100px] font-cabinet font-medium text-[12px] transition-colors ${activeCat === c ? "bg-[#E8640C] text-white" : "bg-[#FEF3E2] text-[#6B4F3A] border border-[#E8D5B7]"}`}>{c}</button>
            ))}
          </div>
          <div className="w-[1px] h-[20px] bg-[#E8D5B7] shrink-0" />
          {/* Duration */}
          <div className="flex gap-[6px] shrink-0">
            {DUR_CHIPS.map(d => (
              <button key={d} onClick={() => setActiveDur(d)} className={`h-[32px] px-[14px] rounded-[100px] font-cabinet font-medium text-[12px] transition-colors ${activeDur === d ? "bg-[#E8640C] text-white" : "bg-[#FEF3E2] text-[#6B4F3A] border border-[#E8D5B7]"}`}>{d}</button>
            ))}
          </div>
          <div className="w-[1px] h-[20px] bg-[#E8D5B7] shrink-0" />
          {/* Price */}
          <div className="flex gap-[6px] shrink-0">
            {PRICE_CHIPS.map(p => (
              <button key={p} onClick={() => setActivePrice(p)} className={`h-[32px] px-[14px] rounded-[100px] font-cabinet font-medium text-[12px] transition-colors ${activePrice === p ? "bg-[#E8640C] text-white" : "bg-[#FEF3E2] text-[#6B4F3A] border border-[#E8D5B7]"}`}>{p}</button>
            ))}
          </div>
          <span className="font-mono-dm text-[11px] text-[#B09880] ml-auto shrink-0">12 experiences found</span>
        </div>

        {/* Featured Experience */}
        <div className="mt-[28px] flex rounded-[16px] overflow-hidden shadow-[0_4px_20px_rgba(30,20,16,0.12)] bg-white border border-[#E8D5B7]">
          {/* Photo 55% */}
          <div className="relative w-[55%]">
            <img src={PHOTOS.featured} alt={FEATURED.name} className="w-full h-full min-h-[280px] object-cover" />
            <span className="absolute top-[16px] left-[16px] px-[10px] py-[4px] rounded-[6px] bg-[rgba(240,165,0,0.20)] border border-[rgba(240,165,0,0.30)] font-mono-dm text-[10px] text-[#F0A500] uppercase">Featured</span>
          </div>
          {/* Content 45% */}
          <div className="w-[45%] p-[28px] flex flex-col">
            <Tag>{FEATURED.cat}</Tag>
            <h2 className="font-display font-bold text-[26px] text-[#1E1410] leading-[1.2] mt-[8px]">{FEATURED.name}</h2>
            <div className="flex items-center gap-[6px] mt-[8px]"><MapPin size={13} className="text-[#E8640C]" /><span className="font-mono-dm text-[11px] text-[#6B4F3A]">{FEATURED.loc}</span></div>
            <p className="font-jakarta text-[14px] text-[#6B4F3A] leading-[1.6] mt-[12px] flex-1">{FEATURED.desc}</p>
            {/* Details */}
            <div className="flex items-center gap-[8px] mt-[16px] flex-wrap">
              <div className="flex items-center gap-[4px]"><Clock size={13} className="text-[#B09880]" /><span className="font-jakarta text-[13px] text-[#6B4F3A]">{FEATURED.dur}</span></div>
              <span className="text-[#E8D5B7]">·</span>
              <div className="flex items-center gap-[4px]"><Users size={13} className="text-[#B09880]" /><span className="font-jakarta text-[13px] text-[#6B4F3A]">{FEATURED.max}</span></div>
              <span className="text-[#E8D5B7]">·</span>
              <span className="font-jakarta text-[13px] text-[#6B4F3A]">{FEATURED.price}</span>
            </div>
            {/* Dates */}
            <div className="mt-[10px] flex gap-[6px] overflow-x-auto scrollbar-none">
              {FEATURED.dates.map(dt => <DatePill key={dt.d} d={dt.d} ok={dt.ok} selected={featSelDate === dt.d} onClick={() => dt.ok && setFeatSelDate(dt.d)} />)}
            </div>
            {/* Buttons */}
            <div className="mt-[16px] flex gap-[10px]">
              <button className="h-[40px] px-[20px] rounded-[12px] border-[1.5px] border-[#E8640C] text-[#E8640C] font-cabinet font-semibold text-[13px] flex items-center gap-[6px]"><Plus size={14} /> Add to Trip Day</button>
              <button onClick={() => setBookingExp(FEATURED)} className="h-[40px] px-[20px] rounded-[12px] bg-[#E8640C] text-white font-cabinet font-semibold text-[13px]">Book Experience</button>
            </div>
            {/* Host */}
            <div className="mt-[10px] flex items-center gap-[8px]">
              <div className="w-[28px] h-[28px] rounded-full bg-[#FEF3E2] flex items-center justify-center"><span className="font-cabinet font-bold text-[10px] text-[#6B4F3A]">S</span></div>
              <span className="font-jakarta text-[13px] text-[#6B4F3A]">Hosted by {FEATURED.host}</span>
              <span className="px-[8px] py-[2px] rounded-[6px] bg-[rgba(45,106,79,0.10)] font-mono-dm text-[10px] text-[#2D6A4F]">Local Host</span>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-[24px] grid grid-cols-3 gap-[20px]">
          {EXPERIENCES.map(exp => <ExpCard key={exp.name} exp={exp} onBook={setBookingExp} />)}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingExp && <BookingModal exp={bookingExp} onClose={() => setBookingExp(null)} />}
    </div>
  );
}
