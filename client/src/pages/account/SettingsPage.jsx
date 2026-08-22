import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Settings, Bell, Globe, Lock, Trash2, Moon, Smartphone } from "lucide-react";

import TopAppBar from "../../components/shared/TopAppBar";
import ProfileSidebar from "./components/ProfileSidebar";
import { logout } from "../../store/authSlice";

export default function SettingsPage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [currency, setCurrency] = useState("INR");
  const [language, setLanguage] = useState("English");

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-[120px]">
      <Helmet>
        <title>Account Settings | My Itinerary</title>
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
              <h5 className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px]">ACCOUNT SETTINGS</h5>
              <h1 className="font-display font-bold text-[36px] text-[#1E1410] mt-[10px]">Manage your account.</h1>
              <p className="font-jakarta text-[15px] text-[#6B4F3A] mt-[10px]">Control your notifications, app preferences, and security.</p>
            </div>

            <div className="mt-[32px] flex flex-col gap-[24px]">
              
              {/* Notifications Card */}
              <div className="bg-white border border-[#E8D5B7] rounded-[14px] shadow-[0_2px_8px_rgba(30,20,16,0.07)] overflow-hidden">
                <div className="p-[20px] border-b border-[#F5EDE0] flex items-center gap-[10px]">
                  <Bell size={18} className="text-[#E8640C]" />
                  <h3 className="font-cabinet font-semibold text-[16px] text-[#1E1410]">Notifications</h3>
                </div>
                
                <div className="p-[20px] flex flex-col gap-[16px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cabinet font-medium text-[14px] text-[#1E1410]">Email Alerts</h4>
                      <p className="font-jakarta text-[12px] text-[#B09880] mt-[2px]">Receive itinerary updates and safety warnings via email.</p>
                    </div>
                    <button onClick={() => setEmailAlerts(!emailAlerts)} className={`w-[40px] h-[22px] rounded-full p-[2px] transition-colors relative flex items-center shrink-0 shadow-inner ${emailAlerts ? "bg-[#2D6A4F]" : "bg-[#E8D5B7]"}`}>
                      <div className={`w-[18px] h-[18px] rounded-full bg-white transition-transform duration-200 shadow-sm ${emailAlerts ? "translate-x-[18px]" : "translate-x-0"}`} />
                    </button>
                  </div>
                  <div className="h-[1px] bg-[#F5EDE0] w-full" />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cabinet font-medium text-[14px] text-[#1E1410]">Push Notifications</h4>
                      <p className="font-jakarta text-[12px] text-[#B09880] mt-[2px]">Instant mobile alerts for trips and SOS signals.</p>
                    </div>
                    <button onClick={() => setPushAlerts(!pushAlerts)} className={`w-[40px] h-[22px] rounded-full p-[2px] transition-colors relative flex items-center shrink-0 shadow-inner ${pushAlerts ? "bg-[#2D6A4F]" : "bg-[#E8D5B7]"}`}>
                      <div className={`w-[18px] h-[18px] rounded-full bg-white transition-transform duration-200 shadow-sm ${pushAlerts ? "translate-x-[18px]" : "translate-x-0"}`} />
                    </button>
                  </div>
                  <div className="h-[1px] bg-[#F5EDE0] w-full" />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cabinet font-medium text-[14px] text-[#1E1410]">Marketing & Offers</h4>
                      <p className="font-jakarta text-[12px] text-[#B09880] mt-[2px]">Occasional emails about new features and travel deals.</p>
                    </div>
                    <button onClick={() => setMarketing(!marketing)} className={`w-[40px] h-[22px] rounded-full p-[2px] transition-colors relative flex items-center shrink-0 shadow-inner ${marketing ? "bg-[#2D6A4F]" : "bg-[#E8D5B7]"}`}>
                      <div className={`w-[18px] h-[18px] rounded-full bg-white transition-transform duration-200 shadow-sm ${marketing ? "translate-x-[18px]" : "translate-x-0"}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* App Preferences */}
              <div className="bg-white border border-[#E8D5B7] rounded-[14px] shadow-[0_2px_8px_rgba(30,20,16,0.07)] overflow-hidden">
                <div className="p-[20px] border-b border-[#F5EDE0] flex items-center gap-[10px]">
                  <Globe size={18} className="text-[#E8640C]" />
                  <h3 className="font-cabinet font-semibold text-[16px] text-[#1E1410]">App Preferences</h3>
                </div>
                
                <div className="p-[20px] grid grid-cols-2 gap-[20px]">
                  <div>
                    <label className="block font-mono-dm text-[11px] uppercase text-[#6B4F3A] mb-[6px]">Display Currency</label>
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full h-[44px] px-[14px] rounded-[10px] border-[1.5px] border-[#E8D5B7] bg-white font-jakarta text-[14px] text-[#1E1410] outline-none focus:border-[#E8640C] appearance-none">
                      <option value="INR">INR (₹) - Indian Rupee</option>
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono-dm text-[11px] uppercase text-[#6B4F3A] mb-[6px]">App Language</label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full h-[44px] px-[14px] rounded-[10px] border-[1.5px] border-[#E8D5B7] bg-white font-jakarta text-[14px] text-[#1E1410] outline-none focus:border-[#E8640C] appearance-none">
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="bg-white border border-[#E8D5B7] rounded-[14px] shadow-[0_2px_8px_rgba(30,20,16,0.07)] overflow-hidden">
                <div className="p-[20px] border-b border-[#F5EDE0] flex items-center gap-[10px]">
                  <Lock size={18} className="text-[#E8640C]" />
                  <h3 className="font-cabinet font-semibold text-[16px] text-[#1E1410]">Security</h3>
                </div>
                
                <div className="p-[20px] flex flex-col gap-[16px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cabinet font-medium text-[14px] text-[#1E1410]">Change Password</h4>
                      <p className="font-jakarta text-[12px] text-[#B09880] mt-[2px]">Last changed 3 months ago</p>
                    </div>
                    <button className="font-cabinet font-medium text-[13px] text-[#E8640C] hover:underline">Update</button>
                  </div>
                  <div className="h-[1px] bg-[#F5EDE0] w-full" />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cabinet font-medium text-[14px] text-[#1E1410]">Two-Factor Authentication</h4>
                      <p className="font-jakarta text-[12px] text-[#B09880] mt-[2px]">Add an extra layer of security.</p>
                    </div>
                    <button className="font-cabinet font-medium text-[13px] text-[#E8640C] hover:underline">Enable</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
