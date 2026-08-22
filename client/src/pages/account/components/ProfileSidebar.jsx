import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Camera, User, Compass, Bookmark, Map, Star, Settings, LogOut, Trash2, ChevronRight } from "lucide-react";

export default function ProfileSidebar({ user, onOpenPhotoModal, onDeleteClick, onLogoutClick }) {
  const location = useLocation();

  const navLinks = [
    { name: "My Profile", icon: User, path: "/account/profile" },
    { name: "Travel Preferences", icon: Compass, path: "/account/preferences" },
    { name: "Saved Collection", icon: Bookmark, path: "/account/saved" },
    { name: "Travel History", icon: Map, path: "/account/history" },
    { name: "Reviews & Achievements", icon: Star, path: "/account/reviews" },
    { name: "Settings", icon: Settings, path: "/account/settings" },
  ];

  return (
    <aside className="w-full lg:w-[280px] lg:sticky top-[96px] shrink-0 bg-white border border-[#E8D5B7] rounded-[16px] p-[24px] shadow-[0_4px_16px_rgba(30,20,16,0.08)] h-fit">
      {/* Profile Photo Block */}
      <div className="relative w-[100px] h-[100px] rounded-full border-[3px] border-[#E8D5B7] mx-auto">
        <img
          src={user?.picture || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"}
          alt={user?.fullName || "Guest"}
          className="w-full h-full object-cover rounded-full"
        />
        <button
          onClick={onOpenPhotoModal}
          className="absolute -bottom-[2px] -right-[2px] w-[28px] h-[28px] rounded-full bg-[#E8640C] border-2 border-white shadow-[0_2px_8px_rgba(30,20,16,0.20)] flex items-center justify-center hover:bg-[#D55A0A] transition-colors"
        >
          <Camera size={14} className="text-white" />
        </button>
      </div>

      <h2 className="font-display font-bold text-[22px] text-[#1E1410] text-center mt-[14px]">
        {user?.fullName || "Guest"}
      </h2>
      <p className="font-mono-dm text-[11px] text-[#6B4F3A] uppercase text-center mt-[6px]">
        {user?.identity || "Traveler"}
      </p>
      <p className="font-jakarta text-[13px] text-[#B09880] text-center mt-[6px]">
        {user?.email || ""}
      </p>

      {/* Quick Stats Row */}
      <div className="bg-[#FEF3E2] rounded-[12px] py-[14px] mt-[16px] flex items-center justify-between px-[8px]">
        {[
          { value: user?.tripsCount || 0, label: "TRIPS" },
          { value: user?.savedCount || 0, label: "SAVED" },
          { value: user?.reviewsCount || 0, label: "REVIEWS" },
          { value: user?.badgesCount || 0, label: "BADGES" },
        ].map((stat, i) => (
          <div key={stat.label} className="flex-1 flex flex-col items-center relative">
            <span className="font-display font-bold text-[22px] text-[#1E1410] leading-none">
              {stat.value}
            </span>
            <span className="font-mono-dm text-[9px] text-[#B09880] uppercase mt-[3px]">
              {stat.label}
            </span>
            {i < 3 && (
              <div className="absolute right-0 top-[10%] h-[80%] w-[1px] bg-[#F5EDE0]" />
            )}
          </div>
        ))}
      </div>

      {/* Navigation Links */}
      <nav className="mt-[16px] flex flex-col">
        {navLinks.map((link) => {
          // Default to /account/profile active if no match
          const isActive = location.pathname.includes(link.path) || (link.path === "/account/profile" && location.pathname === "/account");
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`h-[44px] px-[4px] rounded-[8px] flex items-center group transition-colors ${
                isActive
                  ? "bg-[#FEF3E2] border-l-[3px] border-[#E8640C]"
                  : "hover:bg-[#FEF3E2] border-l-[3px] border-transparent"
              }`}
            >
              <div className="w-[18px] flex justify-center ml-[8px]">
                <link.icon
                  size={18}
                  className={isActive ? "text-[#E8640C]" : "text-[#B09880] group-hover:text-[#1E1410]"}
                />
              </div>
              <span
                className={`ml-[10px] font-cabinet text-[14px] flex-1 ${
                  isActive ? "text-[#1E1410] font-semibold" : "text-[#6B4F3A] font-medium group-hover:text-[#1E1410]"
                }`}
              >
                {link.name}
              </span>
              <ChevronRight
                size={14}
                className={`mr-[8px] ${isActive ? "text-[#E8D5B7]" : "text-[#E8D5B7]"}`}
              />
            </Link>
          );
        })}
      </nav>

      {/* Account Actions */}
      <div className="mt-[16px] pt-[12px] border-t border-[#E8D5B7] flex flex-col gap-[8px]">
        <button onClick={onLogoutClick} className="flex items-center group h-[32px] px-[12px] rounded-[6px] hover:bg-red-50 transition-colors">
          <LogOut size={16} className="text-[#B09880] group-hover:text-[#C0392B]" />
          <span className="ml-[8px] font-cabinet font-medium text-[13px] text-[#B09880] group-hover:text-[#C0392B]">
            Log Out
          </span>
        </button>
        <button
          onClick={onDeleteClick}
          className="flex items-center group h-[32px] px-[12px] rounded-[6px] hover:bg-red-50 transition-colors"
        >
          <Trash2 size={16} className="text-[#B09880] group-hover:text-[#C0392B]" />
          <span className="ml-[8px] font-cabinet font-medium text-[13px] text-[#B09880] group-hover:text-[#C0392B]">
            Delete Account
          </span>
        </button>
      </div>
    </aside>
  );
}
