import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { ChevronRight, CheckCircle2, MapPin, Map, Star, ArrowRight } from "lucide-react";
import TopAppBar from "../../components/shared/TopAppBar";
import { DoctorHeroCard, ConsultationInfo, ReviewCard } from "./components/ProfileComponents";
import { API_BASE_URL } from "../../config/env";
import BookingPanel from "./components/BookingPanel";

export default function DoctorProfile() {
  const { id } = useParams();
  const location = useLocation();
  const [doctor, setDoctor] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/healthcare/doctors`);
        if (res.ok) {
          const doctors = await res.json();
          // Find by id (integer in dummy data) or _id (MongoDB)
          const found = doctors.find(d => d.id == id || d._id == id);
          setDoctor(found || doctors[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#FFF8F0] pt-[120px] text-center text-[#6B4F3A]">Loading doctor profile...</div>;
  if (!doctor) return <div className="min-h-screen bg-[#FFF8F0] pt-[120px] text-center text-[#1E1410] font-bold">Doctor not found</div>;

  return (
    <div className="min-h-screen bg-[#FFF8F0] relative overflow-x-hidden">
      <TopAppBar />

      <div className="max-w-[1200px] mx-auto px-[24px] pt-[16px]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-[8px]">
          <Link to="/healthcare" className="font-jakarta text-[13px] text-[#B09880]">Healthcare</Link>
          <ChevronRight size={12} className="text-[#B09880]" />
          <span className="font-jakarta text-[13px] text-[#B09880]">Doctors in Udaipur</span>
          <ChevronRight size={12} className="text-[#B09880]" />
          <span className="font-cabinet font-semibold text-[13px] text-[#1E1410]">{doctor.name}</span>
        </div>

        <div className="mt-[24px] flex gap-[48px]">
          {/* Left Column — Doctor Content */}
          <div className="flex-1">
            
            {/* Zone 1 — Hero */}
            <DoctorHeroCard doctor={doctor} onBook={() => document.getElementById('booking-card')?.scrollIntoView({behavior: 'smooth'})} />

            {/* Zone 2 — About */}
            <div className="mt-[28px]">
              <p className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px]">About {doctor.name.split(' ').pop()}</p>
              <p className="mt-[10px] font-jakarta text-[15px] text-[#1E1410] leading-[1.7]">{doctor.about}</p>
            </div>

            {/* Zone 3 — Consultation Info */}
            <div className="mt-[28px]">
              <p className="font-mono-dm text-[11px] text-[#B09880] uppercase">Consultation Info</p>
              <div className="mt-[10px]">
                <ConsultationInfo doctor={doctor} />
              </div>
            </div>

            {/* Zone 4 — Verification Badges */}
            <div className="mt-[24px]">
              <p className="font-mono-dm text-[11px] text-[#B09880] uppercase">Verified Credentials</p>
              <div className="mt-[10px] flex gap-[10px] overflow-x-auto scrollbar-none pb-[4px]">
                {doctor.badges?.map((badge, i) => (
                  <div key={i} className="shrink-0 flex items-center gap-[8px] px-[14px] py-[10px] bg-white border border-[rgba(45,106,79,0.25)] rounded-[10px] shadow-sm">
                    <CheckCircle2 size={18} className="text-[#2D6A4F]" />
                    <div>
                      <p className="font-cabinet font-semibold text-[13px] text-[#1E1410]">{badge}</p>
                      <p className="font-mono-dm text-[10px] text-[#2D6A4F]">Verified</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Zone 5 — Map */}
            <div className="mt-[24px]">
              <p className="font-mono-dm text-[11px] text-[#B09880] uppercase">Clinic Location</p>
              <div className="mt-[10px] relative h-[200px] rounded-[14px] overflow-hidden border border-[#E8D5B7] group">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=60" alt="Map" className="w-full h-full object-cover opacity-60" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <div className="w-[28px] h-[28px] rounded-full bg-[#E8640C] flex items-center justify-center shadow-lg border-2 border-white animate-bounce"><MapPin size={14} className="text-white" /></div>
                </div>
                <button className="absolute bottom-[12px] right-[12px] h-[36px] px-[12px] bg-white text-[#E8640C] border border-[#E8640C] rounded-[10px] font-cabinet font-semibold text-[13px] shadow-lg flex items-center gap-[6px]">
                  <Map size={13} /> Get Directions
                </button>
              </div>
              <div className="mt-[12px] flex items-center gap-[6px]">
                <MapPin size={13} className="text-[#E8640C]" />
                <span className="font-jakarta text-[13px] text-[#6B4F3A]">{doctor.address} — 0.8 km from your location</span>
              </div>
            </div>

            {/* Zone 6 — Reviews */}
            <div className="mt-[32px] mb-[64px]">
              <p className="font-mono-dm text-[11px] text-[#B09880] uppercase">Patient Reviews</p>
              
              {/* Summary Bar */}
              <div className="mt-[12px] bg-[#FEF3E2] border border-[#E8D5B7] rounded-[12px] p-[16px_20px] flex justify-between">
                <div>
                  <span className="font-display font-bold text-[40px] text-[#1E1410]">{doctor.rating}</span>
                  <div className="flex gap-[2px] mt-[8px]">
                    {[...Array(4)].map((_, i) => <Star key={i} size={16} fill="#F0A500" className="text-[#F0A500]" />)}
                    <Star size={16} fill="#F0A500" className="text-[#F0A500]" style={{clipPath: "inset(0 50% 0 0)"}} />
                  </div>
                  <p className="font-jakarta text-[13px] text-[#B09880] mt-[6px]">Based on {doctor.reviewsCount} reviews</p>
                </div>
                <div className="flex flex-col gap-[6px]">
                  {[5, 4, 3, 2, 1].map(num => (
                    <div key={num} className="flex items-center gap-[8px]">
                      <span className="font-mono-dm text-[10px] text-[#B09880]">{num}★</span>
                      <div className="w-[120px] h-[4px] bg-[#E8D5B7] rounded-full overflow-hidden">
                        <div className="h-full bg-[#F0A500]" style={{width: `${num === 5 ? 68 : num === 4 ? 20 : 8}%`}} />
                      </div>
                      <span className="font-mono-dm text-[10px] text-[#B09880]">{num === 5 ? 68 : num === 4 ? 20 : 8}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div className="mt-[12px] flex gap-[8px]">
                {["All Reviews", "5 Star", "4 Star", "With Photos", "Travelers Only"].map((f, i) => (
                   <button key={i} className={`h-[36px] px-[16px] rounded-full border font-cabinet font-medium text-[13px] transition-all ${i === 0 ? "bg-[#E8640C] border-[#E8640C] text-white" : "bg-white border-[#E8D5B7] text-[#1E1410]"}`}>{f}</button>
                ))}
              </div>

              {/* Review Cards */}
              <div className="mt-[12px] flex flex-col gap-[12px]">
                {doctor.reviews?.map((review, idx) => (
                  <ReviewCard key={review.id || idx} review={review} />
                ))}
              </div>

              <button className="mt-[24px] w-full flex items-center justify-center gap-[6px] text-[#E8640C] font-cabinet font-medium text-[13px]">
                View all {doctor.reviewsCount} reviews <ArrowRight size={14} />
              </button>
            </div>

          </div>

          {/* Right Column — Sticky Booking Card */}
          <div id="booking-card" className="w-[360px] shrink-0">
            <BookingPanel doctor={doctor} />
          </div>
        </div>
      </div>
    </div>
  );
}
