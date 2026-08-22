import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUser, logout } from "../../store/authSlice";

import TopAppBar from "../../components/shared/TopAppBar";
import ProfileSidebar from "./components/ProfileSidebar";
import {
  PersonalInfoSection,
  ProfilePhotoSection,
  BioSection,
  TravelIdentitySection,
  LinkedAccountsSection,
  SecuritySection,
  DangerZoneSection,
} from "./components/ProfileSections";
import { PhotoChangeModal, DeactivateModal, DeleteModal } from "./components/Modals";
import { API_BASE_URL } from "../../config/env";

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);
  const [modalState, setModalState] = useState(null);

  // Map real user data
  const [personalData, setPersonalData] = useState({
    name: user?.fullName || user?.name || "Guest",
    email: user?.email || "",
    phone: user?.phone?.replace(/^\+\d+\s?/, "") || "", // strip dial code roughly if needed, or just show as is
    dob: user?.dob || "Not set",
    gender: user?.gender || "Not set",
    city: user?.city || "Not set",
  });
  
  const [bioData, setBioData] = useState({
    bio: user?.bio || "",
  });

  const handleEdit = (sectionName) => {
    setActiveSection(sectionName);
  };

  const showToast = (message, type = "success") => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-in slide-in-from-bottom-5" : "animate-out slide-out-to-bottom-5"
        } ${
          type === "success" ? "bg-[#2D6A4F]" : "bg-[#C0392B]"
        } text-white px-[20px] py-[12px] rounded-[12px] shadow-[0_4px_16px_rgba(30,20,16,0.15)] font-cabinet font-medium text-[14px] flex items-center gap-[8px]`}
      >
        {type === "success" ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        )}
        {message}
      </div>
    ), { duration: 3000, position: "bottom-center" });
  };

  const handleSavePersonal = async (newData) => {
    try {
      const payload = {
        fullName: newData.name,
        phone: newData.phone,
        dob: newData.dob,
        gender: newData.gender,
        city: newData.city
      };
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        dispatch(updateUser(data));
        setPersonalData(newData);
        setActiveSection(null);
        showToast("Changes saved.");
      } else {
        const errData = await res.json();
        showToast(errData.message || "Failed to save changes", "error");
      }
    } catch (err) {
      showToast("Network error. Could not save changes.", "error");
    }
  };

  const handleSaveBio = async (newBio) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ bio: newBio })
      });
      if (res.ok) {
        const data = await res.json();
        dispatch(updateUser(data));
        setBioData({ bio: newBio });
        setActiveSection(null);
        showToast("Changes saved.");
      } else {
        const errData = await res.json();
        showToast(errData.message || "Failed to save bio", "error");
      }
    } catch (err) {
      showToast("Network error. Could not save bio.", "error");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/home");
  };

  const isEditingAny = activeSection !== null;

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-[120px]">
      <Helmet>
        <title>My Profile | My Itinerary</title>
      </Helmet>
      
      <TopAppBar />
      <Toaster />

      <main className="max-w-[1100px] mx-auto pt-[32px] px-[24px]">
        <div className="flex flex-col lg:flex-row gap-[32px] lg:gap-[48px]">
          
          <ProfileSidebar 
            user={user}
            onOpenPhotoModal={() => setModalState('photo')}
            onDeleteClick={() => setModalState('delete')}
            onLogoutClick={handleLogout}
          />

          <div className="flex-1 flex flex-col gap-[24px]">
            {/* Personal Info */}
            <div className={`transition-opacity duration-300 ${isEditingAny && activeSection !== 'personal' ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
              <PersonalInfoSection
                data={personalData}
                isEditing={activeSection === 'personal'}
                onEdit={() => handleEdit('personal')}
                onCancel={() => setActiveSection(null)}
                onSave={handleSavePersonal}
              />
            </div>

            {/* Profile Photo */}
            <div className={`transition-opacity duration-300 ${isEditingAny ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
              <ProfilePhotoSection user={user} onOpenModal={() => setModalState('photo')} />
            </div>

            {/* Bio */}
            <div className={`transition-opacity duration-300 ${isEditingAny && activeSection !== 'bio' ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
              <BioSection
                data={bioData}
                isEditing={activeSection === 'bio'}
                onEdit={() => handleEdit('bio')}
                onCancel={() => setActiveSection(null)}
                onSave={handleSaveBio}
              />
            </div>

            {/* Travel Identity */}
            <div className={`transition-opacity duration-300 ${isEditingAny ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
              <TravelIdentitySection user={user} onEditClick={() => navigate('/account/preferences')} />
            </div>

            {/* Linked Accounts */}
            <div className={`transition-opacity duration-300 ${isEditingAny ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
              <LinkedAccountsSection user={user} />
            </div>

            {/* Account Security */}
            <div className={`transition-opacity duration-300 ${isEditingAny ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
              <SecuritySection user={user} />
            </div>

            {/* Danger Zone */}
            <div className={`transition-opacity duration-300 ${isEditingAny ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
              <DangerZoneSection
                onDeactivate={() => setModalState('deactivate')}
                onDelete={() => setModalState('delete')}
              />
            </div>
            
          </div>
        </div>
      </main>

      {/* Modals */}
      {modalState === 'photo' && (
        <PhotoChangeModal
          onClose={() => setModalState(null)}
          onSave={async (newPic) => {
            try {
              const res = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
                body: JSON.stringify({ picture: newPic })
              });
              if (res.ok) {
                const data = await res.json();
                dispatch(updateUser(data));
                showToast("Profile photo updated.");
              }
            } catch (err) {
              showToast("Network error. Could not upload photo.", "error");
            }
          }}
        />
      )}
      {modalState === 'deactivate' && (
        <DeactivateModal
          onClose={() => setModalState(null)}
          onConfirm={() => { setModalState(null); showToast("Account deactivated."); }}
        />
      )}
      {modalState === 'delete' && (
        <DeleteModal
          onClose={() => setModalState(null)}
          onConfirm={() => { setModalState(null); showToast("Account deleted."); }}
        />
      )}
    </div>
  );
}
