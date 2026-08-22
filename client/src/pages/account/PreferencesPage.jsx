import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Calendar, Turtle, Zap, Compass, Users, Shield, Info, Check, Bell, MapPin, Map } from "lucide-react";

import TopAppBar from "../../components/shared/TopAppBar";
import ProfileSidebar from "./components/ProfileSidebar";
import { 
  SectionCard, 
  PreferenceChip, 
  FrequencyCard, 
  SafetyToggleRow, 
  BottomSaveBar 
} from "./components/PreferenceComponents";
import { logout, updateUser } from "../../store/authSlice";
import { API_BASE_URL } from "../../config/env";

const TRAVEL_STYLES = ['Solo', 'With Partner', 'With Friends', 'With Family', 'Backpacking', 'Road Trip', 'Work Travel', 'Group Tour'];
const FREQUENCIES = [
  { id: '1', title: 'Once a Year', desc: 'Annual vacations and long trips', icon: Calendar, tint: 'saffron' },
  { id: '2', title: '2–4 Times a Year', desc: 'Regular travel when possible', icon: Calendar, tint: 'gold' },
  { id: '3', title: 'Monthly', desc: 'Frequent short getaways', icon: Calendar, tint: 'banyan' },
  { id: '4', title: 'I am Always Traveling', desc: 'Travel is a way of life', icon: Calendar, tint: 'sindoor' }
];
const REGIONS = ['North India', 'South India', 'East India', 'West India', 'Northeast India', 'Himalayan Region', 'Coastal India', 'Desert Region', 'Central India', 'Island Territories'];
const INTERESTS = ['Cultural Heritage', 'Trekking', 'Street Food Trails', 'Photography', 'Wildlife Safari', 'Spiritual Travel', 'Adventure Sports', 'Architecture', 'Local Markets', 'Cooking Classes', 'Performing Arts', 'Boat Rides', 'Cycling', 'Nightlife', 'Shopping'];
const VIBES = [
  { id: '1', title: 'Slow Travel', desc: 'Linger in fewer places, go deeper', icon: Turtle, tint: 'saffron' },
  { id: '2', title: 'Action-Packed', desc: 'See and do as much as possible', icon: Zap, tint: 'sindoor' },
  { id: '3', title: 'Off the Beaten Path', desc: 'Avoid crowds, find the unusual', icon: Compass, tint: 'banyan' },
  { id: '4', title: 'Cultural Immersion', desc: 'Connect with local life and customs', icon: Users, tint: 'gold' }
];
const DIETS = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain', 'No Preference'];
const ACCOMMODATIONS = ['Budget Hostel', 'Guesthouse', 'Mid-range Hotel', 'Luxury Resort'];
const TRANSPORTS = ['Train', 'Bus', 'Own Vehicle'];
const LANGUAGES = ['Hindi', 'English', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Malayalam', 'Kannada', 'Gujarati', 'Punjabi', 'Urdu'];

export default function PreferencesPage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initial State mapped from user
  const initialState = {
    travelStyles: user?.travelTypes?.length > 0 ? user.travelTypes : ['Solo', 'Backpacking'],
    frequency: user?.frequency || '2',
    regions: user?.destinations?.length > 0 ? user.destinations : ['South India', 'Northeast India'],
    interests: user?.interests?.length > 0 ? user.interests : ['Cultural Heritage', 'Street Food Trails', 'Photography', 'Architecture'],
    vibe: user?.vibe || '3',
    diet: user?.diet || 'Vegetarian',
    accommodation: user?.accommodation || 'Guesthouse',
    transport: user?.transport || 'Train',
    safety: user?.safetySettings || {
      womenOnly: true,
      realTimeAlerts: true,
      shareLocation: true,
      offlineGuide: false
    },
    languages: user?.languages?.length > 0 ? user.languages : ['Tamil', 'English']
  };

  const [prefs, setPrefs] = useState(initialState);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Determine if changed
  useEffect(() => {
    const isChanged = JSON.stringify(prefs) !== JSON.stringify(initialState);
    setHasChanges(isChanged);
  }, [prefs]);

  const toggleArrayItem = (key, value) => {
    setPrefs(prev => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter(i => i !== value) : [...arr, value]
      };
    });
  };

  const setSingleItem = (key, value) => {
    setPrefs(prev => ({ ...prev, [key]: value }));
  };

  const toggleSafety = (key, value) => {
    setPrefs(prev => ({
      ...prev,
      safety: { ...prev.safety, [key]: value }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        travelTypes: prefs.travelStyles,
        frequency: prefs.frequency,
        destinations: prefs.regions,
        interests: prefs.interests,
        vibe: prefs.vibe,
        diet: prefs.diet,
        accommodation: prefs.accommodation,
        transport: prefs.transport,
        safetySettings: prefs.safety,
        languages: prefs.languages
      };

      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(updateUser(data));
        setIsSaving(false);
        setHasChanges(false);
        setSaveSuccess(true);
        toast.custom((t) => (
          <div className={`${t.visible ? "animate-in slide-in-from-bottom-5" : "animate-out slide-out-to-bottom-5"} bg-[#2D6A4F] text-white px-[20px] py-[12px] rounded-[12px] shadow-[0_4px_16px_rgba(30,20,16,0.15)] font-cabinet font-medium text-[14px] flex items-center gap-[8px]`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
            Preferences saved.
          </div>
        ), { duration: 3000, position: "bottom-center" });

        setTimeout(() => setSaveSuccess(false), 2000);
      } else {
        alert(data.message || "Failed to save preferences.");
        setIsSaving(false);
      }
    } catch (err) {
      alert("Network error: " + err.message);
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (window.confirm("Discard all unsaved changes?")) {
      setPrefs(initialState);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-[120px]">
      <Helmet>
        <title>Travel Preferences | My Itinerary</title>
      </Helmet>
      
      <TopAppBar />
      <Toaster />

      <main className="max-w-[1100px] mx-auto pt-[72px] px-[24px]">
        <div className="flex flex-col lg:flex-row gap-[32px] lg:gap-[48px]">
          
          <ProfileSidebar 
            user={user}
            onLogoutClick={() => { dispatch(logout()); navigate("/home"); }}
          />

          <div className="flex-1 flex flex-col pt-[32px]">
            {/* Header Area */}
            <div className="mb-[32px] relative">
              <h5 className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px]">TRAVEL PREFERENCES</h5>
              <h1 className="font-display font-bold text-[36px] text-[#1E1410] mt-[10px]">How do you like to travel?</h1>
              <p className="font-jakarta text-[15px] text-[#6B4F3A] leading-[1.6] max-w-[620px] mt-[10px]">
                Your answers shape your AI-generated itineraries, guardian matching, and safety profile on every trip you create.
              </p>

              <button
                disabled={!hasChanges || isSaving}
                onClick={handleSave}
                className="absolute top-[32px] right-0 h-[44px] px-[24px] rounded-[10px] bg-[#E8640C] text-white font-cabinet font-semibold text-[14px] shadow-[0_4px_16px_rgba(232,100,12,0.22)] transition-all flex items-center gap-[8px] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isSaving ? (
                  <><div className="w-[16px] h-[16px] border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...</>
                ) : saveSuccess ? (
                  <><Check size={16} /> Saved</>
                ) : "Save All"}
              </button>
            </div>

            {/* Section 1 - Style */}
            <SectionCard label="TRAVEL STYLE" helper="Select all that apply. This affects the type of itinerary generated for you.">
              <div className="flex flex-wrap gap-[8px] mt-[10px]">
                {TRAVEL_STYLES.map(style => (
                  <PreferenceChip key={style} label={style} selected={prefs.travelStyles.includes(style)} onClick={() => toggleArrayItem('travelStyles', style)} />
                ))}
              </div>
            </SectionCard>

            {/* Section 2 - Frequency */}
            <SectionCard label="TRAVEL FREQUENCY" helper="How often do you take trips? This helps us tailor recommendations.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px] mt-[10px]">
                {FREQUENCIES.map(freq => (
                  <FrequencyCard key={freq.id} {...freq} selected={prefs.frequency === freq.id} onClick={() => setSingleItem('frequency', freq.id)} />
                ))}
              </div>
            </SectionCard>

            {/* Section 3 - Regions */}
            <SectionCard label="REGIONS OF INTEREST" helper="Which parts of India do you want to explore? Used to personalize discovery recommendations.">
              <div className="flex flex-wrap gap-[8px] mt-[10px]">
                {REGIONS.map(reg => (
                  <PreferenceChip key={reg} label={reg} selected={prefs.regions.includes(reg)} onClick={() => toggleArrayItem('regions', reg)} />
                ))}
              </div>
            </SectionCard>

            {/* Section 4 - Interests */}
            <SectionCard label="WHAT DO YOU ENJOY?" helper="Used to generate activity suggestions in your itinerary. Select all that genuinely interest you.">
              <div className="flex flex-wrap gap-[8px] mt-[10px]">
                {INTERESTS.map(int => (
                  <PreferenceChip key={int} label={int} selected={prefs.interests.includes(int)} onClick={() => toggleArrayItem('interests', int)} />
                ))}
              </div>
            </SectionCard>

            {/* Section 5 - Vibe */}
            <SectionCard label="YOUR TRAVEL VIBE" helper="How do you prefer to pace your trips? This shapes how busy or relaxed your generated itinerary will be.">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px] mt-[10px]">
                {VIBES.map(vibe => (
                  <FrequencyCard key={vibe.id} {...vibe} selected={prefs.vibe === vibe.id} onClick={() => setSingleItem('vibe', vibe.id)} />
                ))}
              </div>
            </SectionCard>

            {/* Section 6 - Dietary */}
            <SectionCard label="DIETARY PREFERENCE" helper="Used to suggest restaurants and food experiences in your itinerary.">
              <div className="flex flex-wrap gap-[8px] mt-[10px]">
                {DIETS.map(diet => (
                  <PreferenceChip key={diet} label={diet} selected={prefs.diet === diet} onClick={() => setSingleItem('diet', diet)} />
                ))}
              </div>
              <div className="flex items-start gap-[6px] mt-[10px]">
                <Info size={12} className="text-[#B09880] mt-[2px] shrink-0" />
                <p className="font-jakarta text-[12px] text-[#B09880]">You can change this for individual trips without affecting your default preference here.</p>
              </div>
            </SectionCard>

            {/* Section 7 - Accommodation */}
            <SectionCard label="ACCOMMODATION PREFERENCE" helper="Your default accommodation type for budget estimates. Can be changed per trip.">
              <div className="flex flex-wrap gap-[8px] mt-[10px]">
                {ACCOMMODATIONS.map(acc => (
                  <PreferenceChip key={acc} label={acc} selected={prefs.accommodation === acc} onClick={() => setSingleItem('accommodation', acc)} />
                ))}
              </div>
            </SectionCard>

            {/* Section 8 - Transport */}
            <SectionCard label="HOW DO YOU PREFER TO TRAVEL?" helper="Used to estimate transport costs and suggest routes in your itinerary.">
              <div className="flex flex-wrap gap-[8px] mt-[10px]">
                {TRANSPORTS.map(trans => (
                  <PreferenceChip key={trans} label={trans} selected={prefs.transport === trans} onClick={() => setSingleItem('transport', trans)} />
                ))}
              </div>
            </SectionCard>

            {/* Section 9 - Safety Defaults */}
            <SectionCard label="DEFAULT SAFETY SETTINGS" helper="These settings apply to every new trip you create. You can override them per trip.">
              <div className="bg-white border border-[#E8D5B7] rounded-[12px] overflow-hidden mt-[10px]">
                <SafetyToggleRow icon={Shield} label="Women-only guardian matching" helper="Always match me with verified women guardians first" checked={prefs.safety.womenOnly} onChange={(val) => toggleSafety('womenOnly', val)} />
                <SafetyToggleRow icon={Bell} label="Real-time safety alerts by default" helper="Receive destination safety alerts for every trip" checked={prefs.safety.realTimeAlerts} onChange={(val) => toggleSafety('realTimeAlerts', val)} />
                <SafetyToggleRow icon={MapPin} label="Share location with emergency contacts" helper="Automatically on for solo trips" checked={prefs.safety.shareLocation} onChange={(val) => toggleSafety('shareLocation', val)} />
                <SafetyToggleRow icon={Map} label="Offline safety guide download" helper="Auto-download safety info when trip starts" checked={prefs.safety.offlineGuide} onChange={(val) => toggleSafety('offlineGuide', val)} isLast />
              </div>
              <div className="bg-[rgba(45,106,79,0.06)] border border-[rgba(45,106,79,0.20)] rounded-[8px] p-[10px_14px] mt-[12px] flex items-center gap-[6px]">
                <Shield size={14} className="text-[#2D6A4F]" />
                <span className="font-jakarta text-[13px] text-[#2D6A4F]">These defaults make your trips safer automatically. We recommend keeping all safety toggles on.</span>
              </div>
            </SectionCard>

            {/* Section 10 - Languages */}
            <SectionCard label="PREFERRED LANGUAGE FOR DOCTORS AND GUARDIANS" helper="We will prioritize matching you with service providers who speak these languages.">
              <div className="flex flex-wrap gap-[8px] mt-[10px]">
                {LANGUAGES.map(lang => (
                  <PreferenceChip key={lang} label={lang} selected={prefs.languages.includes(lang)} onClick={() => toggleArrayItem('languages', lang)} />
                ))}
              </div>
            </SectionCard>
            
          </div>
        </div>
      </main>

      <BottomSaveBar show={hasChanges} isSaving={isSaving} onSave={handleSave} onDiscard={handleDiscard} />
    </div>
  );
}
