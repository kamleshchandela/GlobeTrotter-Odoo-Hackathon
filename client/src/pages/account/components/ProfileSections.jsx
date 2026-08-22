import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Pencil,
  Check,
  Camera,
  ArrowRight,
  Lock,
  Shield,
  Phone,
  Archive,
  Trash2,
} from "lucide-react";

// Helper components for layout
const SectionCard = ({ title, titleColor = "text-[#B09880]", isEditing, onEdit, children, hideEdit, editNode, customBorder, className = "" }) => (
  <div className={`bg-white rounded-[14px] p-[20px] transition-all duration-300 ${isEditing ? "border-l-[3px] border-l-[#E8640C] border-y-[1.5px] border-r-[1.5px] border-y-[#E8D5B7] border-r-[#E8D5B7] shadow-[0_4px_16px_rgba(30,20,16,0.12)]" : customBorder || "border-[1px] border-[#E8D5B7] shadow-[0_2px_8px_rgba(30,20,16,0.07)]"} ${className}`}>
    <div className="flex items-center justify-between mb-[14px]">
      <h3 className={`font-mono-dm text-[11px] ${titleColor} uppercase tracking-[2px]`}>
        {title}
      </h3>
      {!hideEdit && !isEditing && (
        <button
          onClick={onEdit}
          className="flex items-center gap-[4px] group"
        >
          <Pencil size={14} className="text-[#E8640C]" />
          <span className="font-cabinet font-medium text-[13px] text-[#E8640C] group-hover:text-[#D55A0A] transition-colors">
            Edit
          </span>
        </button>
      )}
      {isEditing && editNode}
    </div>
    {children}
  </div>
);

const InfoRow = ({ label, value, badge, isLast }) => (
  <div className={`flex justify-between items-center py-[10px] ${!isLast ? "border-b border-[#F5EDE0]" : ""}`}>
    <span className="font-mono-dm text-[10px] text-[#B09880] uppercase">{label}</span>
    <div className="flex items-center gap-[8px]">
      <span className="font-jakarta text-[14px] text-[#1E1410]">{value}</span>
      {badge && (
        <span className="px-[8px] py-[2px] rounded-[6px] bg-[rgba(45,106,79,0.10)] border border-[rgba(45,106,79,0.20)] font-mono-dm text-[10px] text-[#2D6A4F]">
          {badge}
        </span>
      )}
    </div>
  </div>
);

const FormField = ({ label, value, onChange, placeholder, disabled, icon: Icon, extraText, type = "text", inputClass = "" }) => (
  <div className="mb-[12px]">
    <label className="block font-mono-dm text-[11px] uppercase text-[#6B4F3A] mb-[6px]">{label}</label>
    <div className="relative">
      {Icon && <Icon size={18} className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#B09880]" />}
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full h-[48px] bg-white border-[1.5px] border-[#E8D5B7] rounded-[10px] px-[14px] font-jakarta text-[15px] text-[#1E1410] outline-none transition-shadow focus:border-[#E8640C] focus:shadow-[0_0_0_4px_rgba(232,100,12,0.12)] disabled:bg-[#FAFAF8] disabled:text-[#B09880] ${Icon ? "pl-[40px]" : ""} ${inputClass}`}
      />
    </div>
    {extraText && <p className="font-jakarta text-[12px] text-[#B09880] mt-[4px]">{extraText}</p>}
  </div>
);

// Specific Sections
export function PersonalInfoSection({ isEditing, onEdit, onSave, onCancel, data }) {
  const [formData, setFormData] = useState(data);

  return (
    <SectionCard
      title="Personal Information"
      isEditing={isEditing}
      onEdit={onEdit}
      editNode={
        <div className="flex items-center gap-[10px]">
          <button onClick={onCancel} className="font-cabinet font-medium text-[13px] text-[#B09880] hover:text-[#6B4F3A]">Cancel</button>
          <button onClick={() => onSave(formData)} className="h-[40px] px-[10px] rounded-[8px] bg-[#E8640C] text-white font-cabinet font-semibold text-[13px]">Save Changes</button>
        </div>
      }
    >
      {isEditing ? (
        <div className="flex flex-col gap-[12px]">
          <FormField label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <div className="flex items-end gap-[12px] mb-[12px]">
            <div className="flex-1">
              <FormField label="Email Address" value={formData.email} disabled extraText="To change your email, go to Account Settings." />
            </div>
            <div className="mb-[28px]">
              <span className="px-[8px] py-[2px] rounded-[6px] bg-[rgba(45,106,79,0.10)] border border-[rgba(45,106,79,0.20)] font-mono-dm text-[10px] text-[#2D6A4F]">Verified</span>
            </div>
          </div>
          <div className="mb-[12px]">
            <label className="block font-mono-dm text-[11px] uppercase text-[#6B4F3A] mb-[6px]">Phone Number</label>
            <div className="flex items-center h-[48px] bg-white border-[1.5px] border-[#E8D5B7] rounded-[10px] focus-within:border-[#E8640C] focus-within:shadow-[0_0_0_4px_rgba(232,100,12,0.12)] overflow-hidden">
              <div className="w-[60px] h-full flex items-center justify-center border-r border-[#E8D5B7] shrink-0 bg-[#FAFAF8]">
                <span className="font-jakarta text-[14px] text-[#1E1410]">+91</span>
              </div>
              <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="flex-1 h-full px-[14px] outline-none font-jakarta text-[15px] text-[#1E1410]" />
            </div>
          </div>
          <FormField label="Date of Birth" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} />
          <div className="mb-[12px]">
            <label className="block font-mono-dm text-[11px] uppercase text-[#6B4F3A] mb-[6px]">Gender</label>
            <div className="flex h-[44px] border border-[#E8D5B7] rounded-[10px] overflow-hidden p-[2px] bg-white">
              {['Woman', 'Man', 'Prefer not to say'].map(g => (
                <button
                  key={g}
                  onClick={() => setFormData({ ...formData, gender: g })}
                  className={`flex-1 rounded-[8px] font-cabinet font-medium text-[13px] transition-colors ${formData.gender === g ? 'bg-[#E8640C] text-white' : 'text-[#6B4F3A] hover:bg-[#FEF3E2]'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <FormField label="City of Residence" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
        </div>
      ) : (
        <div className="flex flex-col">
          <InfoRow label="Full Name" value={data.name} />
          <InfoRow label="Email" value={data.email} badge="Verified" />
          <InfoRow label="Phone" value={`+91 ${data.phone}`} badge="Verified" />
          <InfoRow label="Date of Birth" value={data.dob} />
          <InfoRow label="Gender" value={data.gender} />
          <InfoRow label="City of Residence" value={data.city} isLast />
        </div>
      )}
    </SectionCard>
  );
}

export function ProfilePhotoSection({ user, onOpenModal }) {
  return (
    <SectionCard
      title="Profile Photo"
      hideEdit
      editNode={
        <button onClick={onOpenModal} className="flex items-center gap-[4px] group">
          <Camera size={14} className="text-[#E8640C]" />
          <span className="font-cabinet font-medium text-[13px] text-[#E8640C] group-hover:text-[#D55A0A] transition-colors">Change Photo</span>
        </button>
      }
    >
      <div className="flex justify-between items-start mt-[-14px]">
        <div className="hidden"></div>
      </div>
      <div className="flex items-center justify-between mb-[14px] mt-[-34px]">
          <h3 className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px] opacity-0">.</h3>
          <button onClick={onOpenModal} className="flex items-center gap-[4px] group">
          <Camera size={14} className="text-[#E8640C]" />
          <span className="font-cabinet font-medium text-[13px] text-[#E8640C] group-hover:text-[#D55A0A] transition-colors">Change Photo</span>
        </button>
      </div>

      <div className="flex items-start gap-[20px]">
        <img src={user?.picture || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"} alt="Profile" className="w-[80px] h-[80px] rounded-full object-cover border-[2px] border-[#E8D5B7] shrink-0" />
        <div className="flex-1">
          <h4 className="font-cabinet font-semibold text-[15px] text-[#1E1410]">{user?.fullName || "Guest"}</h4>
          <p className="font-jakarta text-[12px] text-[#B09880] mt-[4px]">JPG or PNG · Max 5MB · Square crop recommended</p>
          <div className="flex items-center gap-[10px] mt-[10px]">
            <button onClick={onOpenModal} className="h-[38px] px-[16px] rounded-[10px] bg-[#E8640C] text-white font-cabinet font-semibold text-[13px] flex items-center gap-[6px]">
              <Camera size={13} className="text-white" /> Upload New Photo
            </button>
            <button className="h-[38px] px-[16px] rounded-[10px] bg-white border border-[#C0392B] text-[#C0392B] font-cabinet font-semibold text-[13px]">
              Remove Photo
            </button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

export function BioSection({ isEditing, onEdit, onSave, onCancel, data }) {
  const [bio, setBio] = useState(data.bio);

  return (
    <SectionCard
      title="Bio"
      isEditing={isEditing}
      onEdit={onEdit}
      editNode={
        <div className="flex items-center gap-[10px]">
          <button onClick={onCancel} className="font-cabinet font-medium text-[13px] text-[#B09880] hover:text-[#6B4F3A]">Cancel</button>
          <button onClick={() => onSave(bio)} className="h-[40px] px-[10px] rounded-[8px] bg-[#E8640C] text-white font-cabinet font-semibold text-[13px]">Save Changes</button>
        </div>
      }
    >
      {isEditing ? (
        <div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full min-h-[100px] border-[1.5px] border-[#E8D5B7] rounded-[10px] p-[12px_14px] font-jakarta text-[15px] text-[#1E1410] resize-y outline-none focus:border-[#E8640C] focus:shadow-[0_0_0_4px_rgba(232,100,12,0.12)]"
          />
          <p className="text-right font-mono-dm text-[10px] text-[#B09880] mt-[4px]">{bio.length} / 200</p>
        </div>
      ) : (
        <p className={`font-jakarta text-[15px] leading-[1.7] ${bio ? 'text-[#1E1410]' : 'text-[#B09880] italic'}`}>
          {bio || "No bio added yet."} {!bio && <button onClick={onEdit} className="text-[#E8640C] not-italic ml-[4px]">Add a bio</button>}
        </p>
      )}
    </SectionCard>
  );
}

const Badge = ({ children }) => (
  <span className="px-[10px] py-[4px] bg-[#FEF3E2] border border-[#E8D5B7] rounded-[6px] font-mono-dm text-[10px] text-[#6B4F3A] uppercase">
    {children}
  </span>
);

export function TravelIdentitySection({ user, onEditClick }) {
  return (
    <SectionCard title="Travel Identity" onEdit={onEditClick}>
      <div className="flex flex-col gap-[14px]">
        <div className="flex justify-between items-start">
          <span className="font-mono-dm text-[10px] text-[#B09880] uppercase w-[140px] shrink-0 pt-[4px]">Travel Style</span>
          <div className="flex flex-wrap gap-[6px] flex-1 justify-end">
            {user?.travelTypes?.length > 0 ? user.travelTypes.map(t => <Badge key={t}>{t}</Badge>) : <span className="font-jakarta text-[12px] text-[#B09880]">Not set</span>}
          </div>
        </div>
        <div className="flex justify-between items-start">
          <span className="font-mono-dm text-[10px] text-[#B09880] uppercase w-[140px] shrink-0 pt-[4px]">Regions of Interest</span>
          <div className="flex flex-wrap gap-[6px] flex-1 justify-end">
            {user?.destinations?.length > 0 ? user.destinations.map(d => <Badge key={d}>{d}</Badge>) : <span className="font-jakarta text-[12px] text-[#B09880]">Not set</span>}
          </div>
        </div>
        <div className="flex justify-between items-start">
          <span className="font-mono-dm text-[10px] text-[#B09880] uppercase w-[140px] shrink-0 pt-[4px]">Interests</span>
          <div className="flex flex-wrap gap-[6px] flex-1 justify-end">
            {user?.interests?.length > 0 ? user.interests.map(i => <Badge key={i}>{i}</Badge>) : <span className="font-jakarta text-[12px] text-[#B09880]">Not set</span>}
          </div>
        </div>
        <div className="flex justify-between items-start">
          <span className="font-mono-dm text-[10px] text-[#B09880] uppercase w-[140px] shrink-0 pt-[4px]">Dietary Preference</span>
          <div className="flex flex-wrap gap-[6px] flex-1 justify-end">
            {user?.dietaryPreference ? <Badge>{user.dietaryPreference}</Badge> : <span className="font-jakarta text-[12px] text-[#B09880]">Not set</span>}
          </div>
        </div>
      </div>
      <Link to="/account/preferences" className="inline-flex items-center gap-[4px] mt-[12px] font-cabinet font-medium text-[13px] text-[#E8640C] hover:underline">
        Edit full travel preferences <ArrowRight size={14} />
      </Link>
    </SectionCard>
  );
}

export function LinkedAccountsSection({ user }) {
  return (
    <SectionCard title="Linked Accounts" hideEdit>
      <div className="flex flex-col gap-[10px] mt-[12px]">
        <div className="flex items-center justify-between h-[52px] border-b border-[#F5EDE0]">
          <div className="flex items-center gap-[12px]">
            <div className="w-[36px] h-[36px] bg-[#FEF3E2] rounded-full flex items-center justify-center">
              {/* Google SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            </div>
            <div>
              <p className="font-cabinet font-semibold text-[14px] text-[#1E1410]">Google</p>
              <p className="font-jakarta text-[12px] text-[#6B4F3A]">Connected · {user?.email || ""}</p>
            </div>
          </div>
          <span className="px-[8px] py-[2px] rounded-[6px] bg-[rgba(45,106,79,0.10)] border border-[rgba(45,106,79,0.20)] font-mono-dm text-[10px] text-[#2D6A4F]">Connected</span>
        </div>
        <div className="flex items-center justify-between h-[52px] border-b border-[#F5EDE0]">
          <div className="flex items-center gap-[12px]">
            <div className="w-[36px] h-[36px] bg-[#FEF3E2] rounded-full flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#000000"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.05 2.25.68 2.74.68.42 0 1.5-.75 3.05-.75 1.7 0 2.87.68 3.65 1.5-3.34 1.95-2.57 5.92.54 7.02-.75 1.9-1.9 3.57-2.98 4.52zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
            </div>
            <div>
              <p className="font-cabinet font-semibold text-[14px] text-[#1E1410]">Apple ID</p>
              <p className="font-jakarta text-[12px] text-[#B09880]">Not connected</p>
            </div>
          </div>
          <button className="font-cabinet font-medium text-[13px] text-[#E8640C] hover:underline">Connect</button>
        </div>
      </div>
    </SectionCard>
  );
}

export function SecuritySection({ user }) {
  return (
    <SectionCard title="Account Security" hideEdit>
      <div className="flex flex-col gap-[10px] mt-[12px]">
        <div className="flex items-center justify-between h-[52px] border-b border-[#F5EDE0]">
          <div className="flex items-center gap-[12px]">
            <Lock size={16} className="text-[#B09880]" />
            <div>
              <p className="font-cabinet font-semibold text-[14px] text-[#1E1410]">Password</p>
              <p className="font-jakarta text-[12px] text-[#6B4F3A]">Update your account password</p>
            </div>
          </div>
          <button className="font-cabinet font-medium text-[13px] text-[#E8640C] hover:underline">Change</button>
        </div>
        <div className="flex items-center justify-between h-[52px] border-b border-[#F5EDE0]">
          <div className="flex items-center gap-[12px]">
            <Shield size={16} className="text-[#2D6A4F]" />
            <div>
              <p className="font-cabinet font-semibold text-[14px] text-[#1E1410]">Two-factor authentication</p>
              <p className="font-jakarta text-[12px] text-[#B09880]">Not enabled</p>
            </div>
          </div>
          <button className="font-cabinet font-medium text-[13px] text-[#E8640C] hover:underline">Enable</button>
        </div>
        <div className="flex items-center justify-between h-[52px] border-b border-[#F5EDE0]">
          <div className="flex items-center gap-[12px]">
            <Phone size={16} className="text-[#B09880]" />
            <div>
              <p className="font-cabinet font-semibold text-[14px] text-[#1E1410]">Phone number</p>
              <p className="font-jakarta text-[12px] text-[#6B4F3A]">{user?.phone ? `+91 ${user.phone.replace(/^\+\d+\s?/, "")}` : "Not set"}</p>
            </div>
          </div>
          <button className="font-cabinet font-medium text-[13px] text-[#E8640C] hover:underline">Change</button>
        </div>
      </div>
    </SectionCard>
  );
}

export function DangerZoneSection({ onDeactivate, onDelete }) {
  return (
    <SectionCard
      title="Account Actions"
      titleColor="text-[#C0392B]"
      hideEdit
      customBorder="border-[1.5px] border-[rgba(192,57,43,0.25)] shadow-[0_2px_8px_rgba(192,57,43,0.06)]"
    >
      <div className="flex flex-col gap-[10px] mt-[12px]">
        <div className="flex items-start justify-between py-[12px] border-b border-[#F5EDE0]">
          <div className="flex items-start gap-[12px]">
            <Archive size={16} className="text-[#B09880] mt-[2px]" />
            <div>
              <p className="font-cabinet font-medium text-[14px] text-[#6B4F3A]">Deactivate Account</p>
              <p className="font-jakarta text-[12px] text-[#B09880] mt-[2px]">Temporarily disable your account</p>
            </div>
          </div>
          <button onClick={onDeactivate} className="font-cabinet font-medium text-[13px] text-[#C0392B] hover:underline">Deactivate</button>
        </div>
        <div className="flex items-start justify-between py-[12px]">
          <div className="flex items-start gap-[12px]">
            <Trash2 size={16} className="text-[#B09880] mt-[2px]" />
            <div>
              <p className="font-cabinet font-medium text-[14px] text-[#6B4F3A]">Delete Account</p>
              <p className="font-jakarta text-[12px] text-[#B09880] mt-[2px] pr-[16px]">Permanently deletes all your data. Cannot be undone.</p>
            </div>
          </div>
          <button onClick={onDelete} className="font-cabinet font-medium text-[13px] text-[#C0392B] hover:underline">Delete</button>
        </div>
      </div>
    </SectionCard>
  );
}
