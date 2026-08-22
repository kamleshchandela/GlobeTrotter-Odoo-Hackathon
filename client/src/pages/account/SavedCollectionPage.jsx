import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bookmark, Map } from "lucide-react";

import TopAppBar from "../../components/shared/TopAppBar";
import ProfileSidebar from "./components/ProfileSidebar";
import SavedPlacesTab from "./components/SavedPlacesTab";
import MyTripsTab from "./components/MyTripsTab";
import { logout } from "../../store/authSlice";

export default function SavedCollectionPage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("places"); // "places" or "trips"

  // Fake counts, ideally we calculate this from real data
  const placesCount = 12;
  const tripsCount = 3;

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-[120px]">
      <Helmet>
        <title>Saved Collection | My Itinerary</title>
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
              <h5 className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px]">SAVED COLLECTION</h5>
              <h1 className="font-display font-bold text-[36px] text-[#1E1410] mt-[10px]">Your saved places and trips.</h1>
            </div>

            {/* Tab Bar */}
            <div className="mt-[20px] bg-white border border-[#E8D5B7] rounded-[12px] p-[6px] flex w-max">
              <button
                onClick={() => setActiveTab("places")}
                className={`h-[38px] px-[24px] rounded-[9px] font-cabinet font-semibold text-[14px] flex items-center gap-[8px] transition-colors ${
                  activeTab === "places" 
                    ? "bg-[#E8640C] text-white shadow-sm" 
                    : "bg-transparent text-[#6B4F3A] hover:bg-[#FEF3E2]"
                }`}
              >
                <Bookmark size={16} className={activeTab === "places" ? "text-white fill-white" : "text-[#6B4F3A]"} />
                Saved Places
                <span className={`font-mono-dm text-[10px] px-[6px] py-[2px] rounded-full flex items-center justify-center leading-none ${
                  activeTab === "places" ? "bg-white text-[#E8640C]" : "bg-[#FEF3E2] text-[#B09880]"
                }`}>
                  {placesCount}
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab("trips")}
                className={`h-[38px] px-[24px] rounded-[9px] font-cabinet font-semibold text-[14px] flex items-center gap-[8px] transition-colors ${
                  activeTab === "trips" 
                    ? "bg-[#E8640C] text-white shadow-sm" 
                    : "bg-transparent text-[#6B4F3A] hover:bg-[#FEF3E2]"
                }`}
              >
                <Map size={16} className={activeTab === "trips" ? "text-white" : "text-[#6B4F3A]"} />
                My Trips
                <span className={`font-mono-dm text-[10px] px-[6px] py-[2px] rounded-full flex items-center justify-center leading-none ${
                  activeTab === "trips" ? "bg-white text-[#E8640C]" : "bg-[#FEF3E2] text-[#B09880]"
                }`}>
                  {tripsCount}
                </span>
              </button>
            </div>

            {/* Content Area */}
            <div className="mt-[16px]">
              {activeTab === "places" ? <SavedPlacesTab /> : <MyTripsTab />}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
