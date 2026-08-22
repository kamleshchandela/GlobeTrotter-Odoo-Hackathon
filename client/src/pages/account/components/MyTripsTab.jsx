import React, { useState, useEffect } from "react";
import { Plus, MoreHorizontal, Wallet, Users, Shield, MapPin, Map } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTrips } from "../../../store/tripSlice";
import { Link } from "react-router-dom";

const STATUS_TABS = ["All", "Active", "Upcoming", "Past"];

function TripCard({ trip }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = trip.status === "active";
  const isUpcoming = trip.status === "upcoming";
  const isPast = trip.status === "past";

  const getStatusBadge = () => {
    if (isActive) return (
      <div className="px-[10px] py-[4px] bg-[rgba(232,100,12,0.10)] border border-[rgba(232,100,12,0.20)] rounded-[6px] font-mono-dm text-[9px] text-[#E8640C] uppercase tracking-[1px] font-bold">
        ACTIVE · DAY 1 OF {trip.duration}
      </div>
    );
    if (isUpcoming) return (
      <div className="px-[10px] py-[4px] bg-[rgba(251,188,5,0.15)] border border-[rgba(251,188,5,0.30)] rounded-[6px] font-mono-dm text-[9px] text-[#D49A00] uppercase tracking-[1px] font-bold">
        UPCOMING · IN 4 DAYS
      </div>
    );
    return (
      <div className="px-[10px] py-[4px] bg-[rgba(45,106,79,0.10)] border border-[rgba(45,106,79,0.20)] rounded-[6px] font-mono-dm text-[9px] text-[#2D6A4F] uppercase tracking-[1px] font-bold">
        COMPLETED
      </div>
    );
  };

  return (
    <div className="bg-white border border-[#E8D5B7] rounded-[16px] overflow-hidden shadow-[0_2px_8px_rgba(30,20,16,0.07)] flex h-auto transition-shadow hover:shadow-[0_4px_16px_rgba(30,20,16,0.10)]">
      {/* Left Image */}
      <div className="relative w-[200px] shrink-0">
        <img 
          src={trip.dailyItinerary?.[0]?.activities?.[0]?.photoUrl || "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80"} 
          alt={trip.tripTitle} 
          className={`w-full h-full object-cover rounded-l-[16px] ${isPast ? 'grayscale-[30%] opacity-80' : ''}`} 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.6)] to-white opacity-100" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0) 40%, rgba(255,255,255,1) 100%)' }} />
      </div>

      {/* Right Content */}
      <div className="flex-1 p-[20px] pl-[10px] flex flex-col justify-between">
        
        {/* Top Row: Badge & Menu */}
        <div className="flex justify-between items-start">
          {getStatusBadge()}
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-[#FEF3E2] transition-colors">
              <MoreHorizontal size={16} className="text-[#B09880]" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-[100%] w-[160px] bg-white border border-[#E8D5B7] rounded-[8px] shadow-[0_4px_16px_rgba(30,20,16,0.12)] py-[6px] z-10">
                <button className="w-full px-[14px] py-[8px] text-left font-cabinet font-medium text-[13px] text-[#1E1410] hover:bg-[#FEF3E2]">Edit Trip Name</button>
                <button className="w-full px-[14px] py-[8px] text-left font-cabinet font-medium text-[13px] text-[#1E1410] hover:bg-[#FEF3E2]">Duplicate Trip</button>
                <button className="w-full px-[14px] py-[8px] text-left font-cabinet font-medium text-[13px] text-[#C0392B] hover:bg-red-50">Delete Trip</button>
              </div>
            )}
          </div>
        </div>

        {/* Trip Info */}
        <div className="mt-[8px]">
          <h3 className="font-display font-bold text-[24px] text-[#1E1410] leading-tight">{trip.tripTitle}</h3>
          <div className="flex items-center gap-[6px] mt-[6px]">
            <span className="font-mono-dm text-[11px] text-[#6B4F3A] uppercase">{trip.location}</span>
            <span className="w-[1px] h-[10px] bg-[#E8D5B7]" />
            <span className="font-mono-dm text-[11px] text-[#6B4F3A] uppercase">{trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'Dates Unknown'}</span>
            <span className="w-[1px] h-[10px] bg-[#E8D5B7]" />
            <span className="font-mono-dm text-[11px] text-[#6B4F3A] uppercase">{trip.duration} Days</span>
          </div>
        </div>

        {/* Progress Bar (Active only) */}
        {isActive && (
          <div className="mt-[10px]">
            <div className="w-full h-[4px] bg-[#E8D5B7] rounded-[100px] overflow-hidden">
              <div 
                className="h-full bg-[#E8640C] rounded-[100px]" 
                style={{ width: `${(1 / trip.duration) * 100}%` }} 
              />
            </div>
            <div className="flex justify-between items-center mt-[4px]">
              <span className="font-mono-dm text-[10px] text-[#B09880] uppercase">Day 1 of {trip.duration}</span>
              <span className="font-mono-dm text-[10px] text-[#B09880] uppercase">{trip.duration - 1} days remaining</span>
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className={`flex items-center gap-[20px] ${isActive ? 'mt-[12px]' : 'mt-[16px]'}`}>
          <div className="flex items-center gap-[8px]">
            <div className="w-[28px] h-[28px] rounded-full bg-[#FEF3E2] flex items-center justify-center">
              <Wallet size={13} className="text-[#E8640C]" />
            </div>
            <div>
              <p className="font-cabinet font-semibold text-[14px] text-[#1E1410] leading-none">{trip.budget}</p>
              <p className="font-mono-dm text-[9px] text-[#B09880] uppercase mt-[2px]">Budget</p>
            </div>
          </div>
          <div className="flex items-center gap-[8px]">
            <div className="w-[28px] h-[28px] rounded-full bg-[#FEF3E2] flex items-center justify-center">
              <Users size={13} className="text-[#E8640C]" />
            </div>
            <div>
              <p className="font-cabinet font-semibold text-[14px] text-[#1E1410] leading-none">{trip.travelers}</p>
              <p className="font-mono-dm text-[9px] text-[#B09880] uppercase mt-[2px]">Travelers</p>
            </div>
          </div>
          <div className="flex items-center gap-[8px]">
            <div className="w-[28px] h-[28px] rounded-full bg-[rgba(45,106,79,0.10)] flex items-center justify-center">
              <Shield size={13} className="text-[#2D6A4F]" />
            </div>
            <div>
              <p className="font-cabinet font-semibold text-[14px] text-[#2D6A4F] leading-none">85</p>
              <p className="font-mono-dm text-[9px] text-[#B09880] uppercase mt-[2px]">Safety Score</p>
            </div>
          </div>
          <div className="flex items-center gap-[8px]">
            <div className="w-[28px] h-[28px] rounded-full bg-[#FEF3E2] flex items-center justify-center">
              <MapPin size={13} className="text-[#E8640C]" />
            </div>
            <div>
              <p className="font-cabinet font-semibold text-[14px] text-[#1E1410] leading-none">{trip.dailyItinerary?.length || 0}</p>
              <p className="font-mono-dm text-[9px] text-[#B09880] uppercase mt-[2px]">Days Planned</p>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="mt-[14px] pt-[12px] border-t border-[#F5EDE0] flex items-center justify-between">
          <span className="font-mono-dm text-[10px] text-[#B09880] uppercase tracking-[0.5px]">Last updated {new Date(trip.updatedAt).toLocaleDateString()}</span>
          <div className="flex gap-[8px]">
            {isPast ? (
              <>
                <button className="h-[36px] px-[16px] rounded-[10px] bg-white border border-[#E8D5B7] text-[#6B4F3A] font-cabinet font-semibold text-[13px] hover:bg-[#FEF3E2] transition-colors">
                  View Summary
                </button>
                <button className="h-[36px] px-[16px] rounded-[10px] bg-[#E8640C] text-white font-cabinet font-semibold text-[13px] shadow-[0_2px_8px_rgba(232,100,12,0.2)] hover:bg-[#D55A0A] transition-colors">
                  Plan Similar Trip
                </button>
              </>
            ) : (
              <>
                <button className="h-[36px] px-[16px] rounded-[10px] bg-white border border-[#E8640C] text-[#E8640C] font-cabinet font-semibold text-[13px] hover:bg-[#FEF3E2] transition-colors">
                  View Itinerary
                </button>
                <button className="h-[36px] px-[16px] rounded-[10px] bg-[#E8640C] text-white font-cabinet font-semibold text-[13px] shadow-[0_2px_8px_rgba(232,100,12,0.2)] hover:bg-[#D55A0A] transition-colors">
                  Continue Planning
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function MyTripsTab() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("All");
  const { trips, loading } = useSelector((state) => state.trip);

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  const filteredTrips = activeTab === "All" 
    ? trips 
    : trips.filter(t => (t.status || 'upcoming').toLowerCase() === activeTab.toLowerCase());

  if (loading) return <div className="py-8 text-center text-[#6B4F3A]">Loading trips...</div>;

  if (trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-[64px]">
        <Map size={40} className="text-[#E8D5B7] stroke-[1.5]" />
        <h3 className="font-cabinet font-semibold text-[18px] text-[#6B4F3A] mt-[12px]">No trips yet</h3>
        <p className="font-jakarta text-[14px] text-[#B09880] text-center max-w-[360px] mt-[8px]">
          Plan your first safe trip across India. AI-powered itineraries built around your safety and interests.
        </p>
        <button className="mt-[16px] h-[44px] px-[24px] rounded-[10px] bg-[#E8640C] text-white font-cabinet font-semibold text-[14px] shadow-[0_4px_16px_rgba(232,100,12,0.22)] hover:bg-[#D55A0A] transition-colors">
          Plan My First Trip
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      {/* Controls Row */}
      <div className="flex justify-between items-center mt-[16px]">
        <span className="font-jakarta text-[13px] text-[#B09880]">
          {trips.length} trips
        </span>
        <Link to="/trips/new" className="h-[40px] px-[20px] rounded-[10px] bg-[#E8640C] text-white font-cabinet font-semibold text-[14px] shadow-[0_4px_16px_rgba(232,100,12,0.22)] flex items-center gap-[6px] hover:bg-[#D55A0A] transition-all">
          <Plus size={14} className="text-white" />
          New Trip
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-[8px] mt-[12px]">
        {STATUS_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`h-[34px] px-[14px] rounded-[100px] transition-all font-cabinet font-medium text-[13px] ${
              activeTab === tab 
                ? "bg-[#E8640C] text-white border border-[#E8640C]" 
                : "bg-[#FFFFFF] text-[#6B4F3A] border border-[#E8D5B7] hover:bg-[#FEF3E2]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Trip Cards List */}
      <div className="flex flex-col gap-[16px] mt-[16px]">
        {filteredTrips.map(trip => (
          <TripCard key={trip.id} trip={trip} />
        ))}
        {filteredTrips.length === 0 && (
          <div className="py-[40px] text-center">
            <p className="font-jakarta text-[14px] text-[#B09880]">No {activeTab.toLowerCase()} trips found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
