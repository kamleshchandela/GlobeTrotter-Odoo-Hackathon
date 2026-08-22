import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Star, Shield, Award, Edit3 } from "lucide-react";

import TopAppBar from "../../components/shared/TopAppBar";
import ProfileSidebar from "./components/ProfileSidebar";
import { logout } from "../../store/authSlice";

const REVIEWS_DATA = [];

const BADGES_DATA = [
  { id: 1, name: "Pioneer Traveler", desc: "Completed your first AI-generated trip.", unlocked: true, icon: Award, color: "#E8640C" },
  { id: 2, name: "Safety First", desc: "Set up your safety profile and emergency contacts.", unlocked: true, icon: Shield, color: "#2D6A4F" },
  { id: 3, name: "Local Explorer", desc: "Visited 5 Community Spots.", unlocked: false, icon: Map, color: "#B09880" },
  { id: 4, name: "Top Reviewer", desc: "Left 10 reviews on destinations.", unlocked: false, icon: Star, color: "#B09880" }
];

export default function ReviewsPage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("reviews");

  const reviewsCount = user?.reviewsCount || REVIEWS_DATA.length;
  const badgesCount = user?.badgesCount || BADGES_DATA.filter(b => b.unlocked).length;

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-[120px]">
      <Helmet>
        <title>Reviews & Achievements | My Itinerary</title>
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
              <h5 className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px]">REVIEWS & ACHIEVEMENTS</h5>
              <h1 className="font-display font-bold text-[36px] text-[#1E1410] mt-[10px]">Your contributions.</h1>
              <p className="font-jakarta text-[15px] text-[#6B4F3A] mt-[10px]">Track your reviews, helpfulness, and unlocked badges.</p>
            </div>

            {/* Tab Bar */}
            <div className="mt-[32px] bg-white border border-[#E8D5B7] rounded-[12px] p-[6px] flex w-max">
              <button
                onClick={() => setActiveTab("reviews")}
                className={`h-[38px] px-[24px] rounded-[9px] font-cabinet font-semibold text-[14px] flex items-center gap-[8px] transition-colors ${
                  activeTab === "reviews" 
                    ? "bg-[#E8640C] text-white shadow-sm" 
                    : "bg-transparent text-[#6B4F3A] hover:bg-[#FEF3E2]"
                }`}
              >
                <Edit3 size={16} className={activeTab === "reviews" ? "text-white" : "text-[#6B4F3A]"} />
                My Reviews
                <span className={`font-mono-dm text-[10px] px-[6px] py-[2px] rounded-full flex items-center justify-center leading-none ${
                  activeTab === "reviews" ? "bg-white text-[#E8640C]" : "bg-[#FEF3E2] text-[#B09880]"
                }`}>
                  {reviewsCount}
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab("badges")}
                className={`h-[38px] px-[24px] rounded-[9px] font-cabinet font-semibold text-[14px] flex items-center gap-[8px] transition-colors ${
                  activeTab === "badges" 
                    ? "bg-[#E8640C] text-white shadow-sm" 
                    : "bg-transparent text-[#6B4F3A] hover:bg-[#FEF3E2]"
                }`}
              >
                <Award size={16} className={activeTab === "badges" ? "text-white" : "text-[#6B4F3A]"} />
                Badges
                <span className={`font-mono-dm text-[10px] px-[6px] py-[2px] rounded-full flex items-center justify-center leading-none ${
                  activeTab === "badges" ? "bg-white text-[#E8640C]" : "bg-[#FEF3E2] text-[#B09880]"
                }`}>
                  {badgesCount}
                </span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="mt-[24px]">
              {activeTab === "reviews" && (
                <div className="animate-in fade-in duration-300">
                  {REVIEWS_DATA.length > 0 ? (
                    <div className="flex flex-col gap-[16px]">
                      {REVIEWS_DATA.map(review => (
                        <div key={review.id} className="bg-white border border-[#E8D5B7] rounded-[16px] p-[20px] shadow-[0_2px_8px_rgba(30,20,16,0.07)] hover:shadow-[0_4px_16px_rgba(30,20,16,0.12)] transition-shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-cabinet font-semibold text-[16px] text-[#1E1410]">{review.place}</h3>
                              <p className="font-mono-dm text-[10px] text-[#B09880] uppercase mt-[4px]">{review.location}</p>
                            </div>
                            <span className="font-mono-dm text-[10px] text-[#B09880] uppercase">{review.date}</span>
                          </div>
                          
                          <div className="flex items-center gap-[2px] mt-[12px]">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} className={i < review.rating ? "text-[#FBBC05] fill-[#FBBC05]" : "text-[#E8D5B7] fill-transparent"} />
                            ))}
                          </div>

                          <p className="font-jakarta text-[14px] text-[#6B4F3A] mt-[12px] leading-[1.6]">
                            "{review.text}"
                          </p>
                          
                          <div className="mt-[16px] flex gap-[8px]">
                            <button className="font-cabinet font-medium text-[13px] text-[#E8640C] hover:underline">Edit</button>
                            <span className="text-[#E8D5B7]">•</span>
                            <button className="font-cabinet font-medium text-[13px] text-[#B09880] hover:text-[#C0392B]">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-[#E8D5B7] rounded-[16px] p-[40px] text-center shadow-[0_2px_8px_rgba(30,20,16,0.07)]">
                      <Edit3 size={40} className="text-[#E8D5B7] mx-auto stroke-[1.5]" />
                      <h3 className="font-cabinet font-semibold text-[18px] text-[#6B4F3A] mt-[12px]">No reviews yet</h3>
                      <p className="font-jakarta text-[14px] text-[#B09880] mt-[8px]">Share your experiences to help other travelers stay safe and informed.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "badges" && (
                <div className="animate-in fade-in duration-300">
                  <div className="grid grid-cols-2 gap-[16px]">
                    {BADGES_DATA.map(badge => (
                      <div key={badge.id} className={`border rounded-[16px] p-[20px] flex items-center gap-[16px] transition-all ${
                        badge.unlocked ? "bg-white border-[#E8D5B7] shadow-[0_2px_8px_rgba(30,20,16,0.07)]" : "bg-[#FAFAF8] border-[#F5EDE0] opacity-60"
                      }`}>
                        <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center shrink-0 ${
                          badge.unlocked ? "bg-[rgba(232,100,12,0.1)]" : "bg-[#E8D5B7]"
                        }`} style={{ backgroundColor: badge.unlocked ? `${badge.color}15` : undefined }}>
                          <badge.icon size={20} color={badge.unlocked ? badge.color : "#FFFFFF"} />
                        </div>
                        <div>
                          <h4 className="font-cabinet font-semibold text-[15px] text-[#1E1410]">{badge.name}</h4>
                          <p className="font-jakarta text-[12px] text-[#6B4F3A] mt-[2px]">{badge.desc}</p>
                          <span className="font-mono-dm text-[9px] uppercase tracking-[1px] mt-[6px] block" style={{ color: badge.unlocked ? badge.color : "#B09880" }}>
                            {badge.unlocked ? "Unlocked" : "Locked"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
