import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Map, MapPin, Navigation, Calendar } from "lucide-react";

import TopAppBar from "../../components/shared/TopAppBar";
import ProfileSidebar from "./components/ProfileSidebar";
import { logout } from "../../store/authSlice";

const PAST_TRIPS = [
  {
    id: 1,
    name: "Hampi Weekend",
    location: "Hampi, Karnataka",
    dates: "Apr 4–6, 2025",
    daysCount: 3,
    img: "https://images.unsplash.com/photo-1620766165457-a8025baa82e0?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    name: "Kerala Backwaters",
    location: "Alleppey, Kerala",
    dates: "Jan 12–18, 2025",
    daysCount: 7,
    img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80"
  }
];

export default function TravelHistoryPage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Stats calculate (dummy for now, but dynamically structured)
  const tripsCount = user?.tripsCount || PAST_TRIPS.length;
  const daysTraveled = PAST_TRIPS.reduce((acc, trip) => acc + trip.daysCount, 0);

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-[120px]">
      <Helmet>
        <title>Travel History | My Itinerary</title>
      </Helmet>
      
      <TopAppBar />

      <main className="max-w-[1100px] mx-auto pt-[72px] px-[24px]">
        <div className="flex flex-col lg:flex-row gap-[32px] lg:gap-[48px]">
          
          <ProfileSidebar 
            user={user}
            onLogoutClick={() => { dispatch(logout()); navigate("/home"); }}
          />

          <div className="flex-1 flex flex-col pt-[32px]">
            {/* Header Area */}
            <div>
              <h5 className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px]">TRAVEL HISTORY</h5>
              <h1 className="font-display font-bold text-[36px] text-[#1E1410] mt-[10px]">Where you've been.</h1>
              <p className="font-jakarta text-[15px] text-[#6B4F3A] mt-[10px]">Your passport to past memories and completed journeys.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-[16px] mt-[32px]">
              <div className="bg-white border border-[#E8D5B7] rounded-[16px] p-[20px] shadow-[0_2px_8px_rgba(30,20,16,0.07)] flex flex-col items-center justify-center">
                <MapPin size={24} className="text-[#E8640C] mb-[8px]" />
                <span className="font-display font-bold text-[32px] text-[#1E1410] leading-none">{tripsCount}</span>
                <span className="font-mono-dm text-[11px] text-[#B09880] uppercase mt-[6px]">Trips Completed</span>
              </div>
              <div className="bg-white border border-[#E8D5B7] rounded-[16px] p-[20px] shadow-[0_2px_8px_rgba(30,20,16,0.07)] flex flex-col items-center justify-center">
                <Navigation size={24} className="text-[#2D6A4F] mb-[8px]" />
                <span className="font-display font-bold text-[32px] text-[#1E1410] leading-none">2</span>
                <span className="font-mono-dm text-[11px] text-[#B09880] uppercase mt-[6px]">States Visited</span>
              </div>
              <div className="bg-white border border-[#E8D5B7] rounded-[16px] p-[20px] shadow-[0_2px_8px_rgba(30,20,16,0.07)] flex flex-col items-center justify-center">
                <Calendar size={24} className="text-[#D49A00] mb-[8px]" />
                <span className="font-display font-bold text-[32px] text-[#1E1410] leading-none">{daysTraveled}</span>
                <span className="font-mono-dm text-[11px] text-[#B09880] uppercase mt-[6px]">Days Traveled</span>
              </div>
            </div>

            {/* Timeline / List */}
            <div className="mt-[32px]">
              <h3 className="font-cabinet font-semibold text-[18px] text-[#1E1410] mb-[16px]">Past Trips</h3>
              
              {PAST_TRIPS.length > 0 ? (
                <div className="flex flex-col gap-[16px]">
                  {PAST_TRIPS.map((trip) => (
                    <div key={trip.id} className="bg-white border border-[#E8D5B7] rounded-[16px] overflow-hidden shadow-[0_2px_8px_rgba(30,20,16,0.07)] flex h-[140px] transition-all hover:shadow-[0_4px_16px_rgba(30,20,16,0.12)] cursor-pointer group">
                      <div className="w-[180px] shrink-0 relative overflow-hidden">
                        <img src={trip.img} alt={trip.name} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.6)] to-white" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0) 50%, rgba(255,255,255,1) 100%)' }} />
                      </div>
                      <div className="flex-1 p-[20px] pl-[10px] flex flex-col justify-center">
                        <div className="inline-flex px-[10px] py-[4px] bg-[rgba(45,106,79,0.10)] border border-[rgba(45,106,79,0.20)] rounded-[6px] font-mono-dm text-[9px] text-[#2D6A4F] uppercase tracking-[1px] font-bold w-max mb-[8px]">
                          COMPLETED
                        </div>
                        <h3 className="font-display font-bold text-[22px] text-[#1E1410] leading-tight group-hover:text-[#E8640C] transition-colors">{trip.name}</h3>
                        <div className="flex items-center gap-[6px] mt-[6px]">
                          <span className="font-mono-dm text-[11px] text-[#6B4F3A] uppercase">{trip.location}</span>
                          <span className="w-[1px] h-[10px] bg-[#E8D5B7]" />
                          <span className="font-mono-dm text-[11px] text-[#6B4F3A] uppercase">{trip.dates}</span>
                        </div>
                      </div>
                      <div className="flex items-center pr-[24px]">
                        <button className="h-[36px] px-[16px] rounded-[10px] bg-white border border-[#E8D5B7] text-[#6B4F3A] font-cabinet font-semibold text-[13px] hover:bg-[#FEF3E2] transition-colors">
                          View Summary
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-[#E8D5B7] rounded-[16px] p-[40px] text-center shadow-[0_2px_8px_rgba(30,20,16,0.07)]">
                  <Map size={40} className="text-[#E8D5B7] mx-auto stroke-[1.5]" />
                  <h3 className="font-cabinet font-semibold text-[18px] text-[#6B4F3A] mt-[12px]">No travel history yet</h3>
                  <p className="font-jakarta text-[14px] text-[#B09880] mt-[8px]">Once you complete your trips, they will appear here as your personal travel diary.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
