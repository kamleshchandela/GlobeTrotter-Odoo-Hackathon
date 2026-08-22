import React, { useState } from "react";
import { Info, Calendar, Turtle, Zap, Compass, Users, Shield, Bell, MapPin, Map, AlertCircle, Circle } from "lucide-react";

export const SectionCard = ({ label, helper, children }) => (
  <div className="bg-white border border-[#E8D5B7] rounded-[14px] p-[20px] mb-[24px] shadow-[0_2px_8px_rgba(30,20,16,0.07)]">
    <div className="flex items-start justify-between mb-[10px]">
      <div>
        <h3 className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px]">
          {label}
        </h3>
        {helper && (
          <p className="font-jakarta text-[12px] text-[#B09880] mt-[4px]">
            {helper}
          </p>
        )}
      </div>
      <div className="flex items-center gap-[6px] group relative cursor-help">
        <Info size={14} className="text-[#B09880]" />
        <span className="font-cabinet font-medium text-[12px] text-[#B09880]">
          Why this matters
        </span>
        <div className="absolute right-0 top-[24px] w-[260px] bg-[#1E1410] text-white font-jakarta text-[12px] p-[12px] rounded-[8px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 shadow-lg pointer-events-none">
          Your preferences directly shape your AI-generated itineraries, ensuring personalized travel recommendations and optimal safety setups.
        </div>
      </div>
    </div>
    <div className="mt-[10px]">
      {children}
    </div>
  </div>
);

export const PreferenceChip = ({ label, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`h-[40px] px-[18px] rounded-[100px] font-cabinet font-medium text-[14px] transition-all flex items-center justify-center ${
      selected
        ? "bg-[#E8640C] text-white border border-[#E8640C]"
        : "bg-white text-[#1E1410] border border-[#E8D5B7] hover:bg-[#FEF3E2]"
    }`}
  >
    {label}
  </button>
);

export const FrequencyCard = ({ icon: Icon, tint, title, description, selected, onClick }) => {
  const getTintBg = () => {
    switch(tint) {
      case 'saffron': return 'bg-[rgba(232,100,12,0.08)]';
      case 'gold': return 'bg-[rgba(251,188,5,0.08)]';
      case 'banyan': return 'bg-[rgba(45,106,79,0.08)]';
      case 'sindoor': return 'bg-[rgba(192,57,43,0.08)]';
      default: return 'bg-gray-100';
    }
  };
  const getIconColor = () => {
    switch(tint) {
      case 'saffron': return 'text-[#E8640C]';
      case 'gold': return 'text-[#FBBC05]';
      case 'banyan': return 'text-[#2D6A4F]';
      case 'sindoor': return 'text-[#C0392B]';
      default: return 'text-gray-500';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`h-[72px] bg-white border rounded-[12px] p-[16px_18px] flex items-center transition-all text-left ${
        selected
          ? "border-[1.5px] border-[#E8640C] bg-[rgba(232,100,12,0.04)]"
          : "border-[#E8D5B7] hover:border-[#E8640C]"
      }`}
    >
      <div className={`w-[40px] h-[40px] rounded-[8px] flex items-center justify-center shrink-0 ${getTintBg()}`}>
        <Icon size={20} className={getIconColor()} />
      </div>
      <div className="ml-[12px] flex-1">
        <h4 className="font-cabinet font-semibold text-[15px] text-[#1E1410] leading-none">{title}</h4>
        <p className="font-jakarta text-[12px] text-[#6B4F3A] mt-[3px] leading-tight">{description}</p>
      </div>
    </button>
  );
};

export const SafetyToggleRow = ({ icon: Icon, label, helper, checked, onChange, isLast }) => (
  <div className={`flex items-center justify-between p-[16px_20px] ${!isLast ? 'border-b border-[#E8D5B7]' : ''}`}>
    <div className="flex items-center gap-[10px]">
      <Icon size={18} className="text-[#2D6A4F] shrink-0" />
      <div>
        <h4 className="font-cabinet font-semibold text-[14px] text-[#1E1410] leading-none">{label}</h4>
        <p className="font-jakarta text-[12px] text-[#B09880] mt-[4px]">{helper}</p>
      </div>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-[44px] h-[24px] rounded-full transition-colors flex items-center shrink-0 ${
        checked ? "bg-[#2D6A4F]" : "bg-[#E8D5B7]"
      }`}
    >
      <div
        className={`absolute w-[20px] h-[20px] bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  </div>
);

export const BottomSaveBar = ({ show, onDiscard, onSave, isSaving }) => (
  <div
    className={`fixed bottom-0 left-0 w-full h-[72px] bg-white border-t border-[#E8D5B7] shadow-[0_-4px_16px_rgba(30,20,16,0.08)] px-[48px] flex items-center justify-between z-50 transition-transform duration-300 ${
      show ? "translate-y-0" : "translate-y-full"
    }`}
  >
    <div className="flex items-center gap-[8px]">
      <Circle size={8} className="text-[#E8640C] fill-[#E8640C]" />
      <span className="font-jakarta text-[14px] text-[#6B4F3A]">
        {isSaving ? "Saving your preferences..." : "You have unsaved changes"}
      </span>
    </div>
    <div className="flex items-center gap-[16px]">
      {!isSaving && (
        <button
          onClick={onDiscard}
          className="font-cabinet font-medium text-[14px] text-[#B09880] hover:text-[#6B4F3A] transition-colors"
        >
          Discard Changes
        </button>
      )}
      <button
        onClick={onSave}
        disabled={isSaving}
        className="h-[48px] px-[24px] bg-[#E8640C] text-white rounded-[10px] font-cabinet font-semibold text-[14px] shadow-[0_4px_16px_rgba(232,100,12,0.22)] flex items-center justify-center min-w-[180px] hover:bg-[#D55A0A] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSaving ? (
          <div className="w-[20px] h-[20px] border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "Save All Preferences"
        )}
      </button>
    </div>
  </div>
);
