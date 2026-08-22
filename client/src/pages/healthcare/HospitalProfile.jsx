import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, CheckCircle2, ArrowRight } from "lucide-react";
import TopAppBar from "../../components/shared/TopAppBar";
import { API_BASE_URL } from "../../config/env";
import { HospitalHero, HospitalStatsBar, DepartmentCard, DoctorCompactRow } from "./components/HospitalProfileComponents";
import { ContactEmergencyPanel, DirectionsInfo } from "./components/HospitalDetailComponents";
import { ReviewCard } from "./components/ProfileComponents";

export default function HospitalProfile() {
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSpecialty, setActiveSpecialty] = useState("All");

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        setLoading(true);
        const [hospRes, docRes] = await Promise.all([
          fetch(`${API_BASE_URL}/healthcare/hospitals`),
          fetch(`${API_BASE_URL}/healthcare/doctors`)
        ]);
        if (hospRes.ok && docRes.ok) {
          const hospitalsData = await hospRes.json();
          const doctorsData = await docRes.json();
          const found = hospitalsData.find(h => h.id == id || h._id == id);
          setHospital(found || hospitalsData[0]);
          setDoctors(doctorsData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHospitalData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#FFF8F0] pt-[120px] text-center text-[#6B4F3A]">Loading hospital profile...</div>;
  if (!hospital) return <div className="min-h-screen bg-[#FFF8F0] pt-[120px] text-center text-[#1E1410] font-bold">Hospital not found</div>;

  // Filter doctors associated with this hospital (Mock filter)
  const hospitalDoctors = doctors.filter(d => 
    d.hospital.includes(hospital.name) && 
    (activeSpecialty === "All" || d.specialty.includes(activeSpecialty))
  );

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <TopAppBar />

      <div className="max-w-[1200px] mx-auto px-[24px] pt-[16px] pb-[64px]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-[8px]">
          <Link to="/healthcare" className="font-jakarta text-[13px] text-[#B09880]">Healthcare</Link>
          <ChevronRight size={12} className="text-[#B09880]" />
          <span className="font-jakarta text-[13px] text-[#B09880]">Hospitals in Udaipur</span>
          <ChevronRight size={12} className="text-[#B09880]" />
          <span className="font-cabinet font-semibold text-[13px] text-[#1E1410]">{hospital.name}</span>
        </div>

        {/* Zone 1 — Hero */}
        <div className="mt-[24px]">
          <HospitalHero hospital={hospital} />
        </div>

        {/* Zone 2 — Stats Bar */}
        <HospitalStatsBar hospital={hospital} />

        {/* Zone 3 — Two-Column Body */}
        <div className="mt-[32px] flex gap-[48px]">
          {/* Left Column — Hospital Info */}
          <div className="flex-1">
            
            {/* Block A — About */}
            <div>
              <p className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px]">About This Hospital</p>
              <p className="mt-[10px] font-jakarta text-[15px] text-[#1E1410] leading-[1.7]">{hospital.about}</p>
            </div>

            {/* Block B — Departments */}
            <div className="mt-[28px]">
              <p className="font-mono-dm text-[11px] text-[#B09880] uppercase">Departments and Services</p>
              <div className="mt-[10px] grid grid-cols-2 gap-[12px]">
                {hospital.departments.map((dept, i) => (
                  <DepartmentCard key={i} dept={dept} />
                ))}
              </div>
            </div>

            {/* Block C — Facilities */}
            <div className="mt-[28px]">
              <p className="font-mono-dm text-[11px] text-[#B09880] uppercase">Facilities</p>
              <div className="mt-[10px] flex flex-wrap gap-[8px]">
                {hospital.facilities.map((f, i) => (
                  <div key={i} className="h-[32px] px-[14px] flex items-center gap-[4px] bg-white border border-[#E8D5B7] rounded-full font-cabinet font-medium text-[12px] text-[#1E1410]">
                    <CheckCircle2 size={12} className="text-[#2D6A4F]" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Block D — Doctors */}
            <div className="mt-[32px]">
              <p className="font-mono-dm text-[11px] text-[#B09880] uppercase">Doctors at {hospital.name}</p>
              <div className="mt-[10px] flex gap-[8px] overflow-x-auto scrollbar-none pb-[4px]">
                {["All", "General Medicine", "Emergency", "Pediatrics", "Cardiology", "Orthopedics"].map((s, i) => (
                  <button key={i} onClick={() => setActiveSpecialty(s)} className={`shrink-0 h-[36px] px-[16px] rounded-full border font-cabinet font-medium text-[13px] transition-all ${activeSpecialty === s ? "bg-[#E8640C] border-[#E8640C] text-white" : "bg-white border-[#E8D5B7] text-[#1E1410]"}`}>
                    {s}
                  </button>
                ))}
              </div>
              <div className="mt-[12px] flex flex-col gap-[10px]">
                {hospitalDoctors.map((doctor, idx) => (
                  <Link key={doctor.id || doctor._id || idx} to={`/healthcare/doctor/${doctor.id || doctor._id}`}>
                    <DoctorCompactRow doctor={doctor} onBook={(d) => window.location.href=`/healthcare/doctor/${d.id || d._id}?book=true`} />
                  </Link>
                ))}
              </div>
              <button className="mt-[12px] flex items-center gap-[6px] text-[#E8640C] font-cabinet font-medium text-[13px]">
                View all 23 doctors at this hospital <ArrowRight size={14} />
              </button>
            </div>

            {/* Block E — Reviews */}
            <div className="mt-[32px]">
              <p className="font-mono-dm text-[11px] text-[#B09880] uppercase">Patient Reviews</p>
              <div className="mt-[12px] flex flex-col gap-[12px]">
                {hospital.reviews?.map((review, idx) => (
                  <ReviewCard key={review.id || idx} review={review} />
                ))}
              </div>
            </div>

          </div>

          {/* Right Column — Contact & Emergency */}
          <div className="w-[320px] shrink-0">
            <ContactEmergencyPanel hospital={hospital} />
          </div>
        </div>

        {/* Zone 4 — Location & Directions */}
        <div className="mt-[40px]">
          <DirectionsInfo />
        </div>

      </div>
    </div>
  );
}
