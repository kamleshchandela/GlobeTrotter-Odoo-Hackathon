import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import { ArrowRight, Check, MapPin, Shield, Lock, Sparkles } from "lucide-react";
import { CountryCodeSelect } from "../../components/ui/CountryCodeSelect";
import { API_BASE_URL } from "../../config/env";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  // Step 2 fields
  const [travelType, setTravelType] = useState([]);
  const [frequency, setFrequency] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [interests, setInterests] = useState([]);

  // Step 3 fields
  const [identity, setIdentity] = useState("");
  const [emergencyDialCode, setEmergencyDialCode] = useState("+91");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [medicalInfo, setMedicalInfo] = useState("");
  const [locationEnabled, setLocationEnabled] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1 = preferences, 2 = safety

  const travelTypesList = ["Solo", "With Friends", "With Family", "Backpacking", "Road Trip", "Work Travel"];
  const frequencyList = ["Once a year", "2-4 times a year", "Monthly", "Frequent — always on the road"];
  const destinationsList = ["North India", "South India", "East India", "West India", "Northeast India", "Himalayan Region", "Coastal India", "Desert Region"];
  const interestsList = ["Cultural Heritage", "Adventure Sports", "Wildlife", "Food Trails", "Spiritual Travel", "Photography", "Offbeat Destinations", "Hill Stations"];

  const toggleArray = (array, setArray, item) => {
    if (array.includes(item)) setArray(array.filter((i) => i !== item));
    else setArray([...array, item]);
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        travelTypes: travelType,
        frequency,
        destinations,
        interests,
        identity,
        emergencyContact: {
          name: emergencyName,
          phone: emergencyDialCode + emergencyPhone
        },
        medicalInfo,
        locationEnabled
      };

      const res = await fetch(`${API_BASE_URL}/auth/complete-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok) {
        // Update Redux with the complete user data
        dispatch(loginSuccess({ user: { ...user, ...data }, token }));
        navigate("/home");
      } else {
        alert(data.message || "Failed to save profile");
      }
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E8D5B7] px-6 py-4">
        <div className="max-w-[640px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={user?.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName}`}
              alt={user?.fullName}
              className="w-10 h-10 rounded-full border-2 border-[#E8D5B7] object-cover"
            />
            <div>
              <p className="font-mono-dm text-[10px] uppercase tracking-[2px] text-[#B09880]">Welcome</p>
              <h2 className="font-cabinet font-bold text-[18px] text-[#1E1410]">{user?.fullName}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#FEF3E2] px-3 py-1.5 rounded-full border border-[#E8D5B7]">
            <Sparkles size={14} className="text-[#E8640C]" />
            <span className="font-mono-dm text-[11px] text-[#6B4F3A] font-bold">Step {currentStep} of 2</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[640px] mx-auto w-full px-6 py-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-[32px] text-[#1E1410] mb-2">
            {currentStep === 1 ? "Tell us how you travel" : "Set up your safety"}
          </h1>
          <p className="font-jakarta text-[15px] text-[#6B4F3A]">
            {currentStep === 1
              ? "This helps us personalize your experience and safety alerts."
              : "Your safety setup takes 60 seconds. It could matter for a lifetime."}
          </p>
        </div>

        {/* Step Progress */}
        <div className="flex gap-2 mb-10">
          <div className={`h-[4px] flex-1 rounded-full transition-all ${currentStep >= 1 ? "bg-[#E8640C]" : "bg-[#E8D5B7]"}`} />
          <div className={`h-[4px] flex-1 rounded-full transition-all ${currentStep >= 2 ? "bg-[#E8640C]" : "bg-[#E8D5B7]"}`} />
        </div>

        {currentStep === 1 && (
          <div className="flex flex-col gap-8 animate-in">
            {/* Travel Types */}
            <div>
              <label className="block font-cabinet font-medium text-[13px] text-[#1E1410] uppercase tracking-wide">HOW DO YOU USUALLY TRAVEL?</label>
              <p className="text-[12px] font-jakarta text-[#B09880] mb-4">Select all that apply.</p>
              <div className="flex flex-wrap gap-2.5">
                {travelTypesList.map(type => (
                  <button key={type} type="button" onClick={() => toggleArray(travelType, setTravelType, type)}
                    className={`h-[40px] px-5 rounded-[20px] font-cabinet font-medium text-[14px] transition-all border
                    ${travelType.includes(type) ? 'bg-[#E8640C] text-white border-[#E8640C] shadow-sm' : 'bg-white text-[#1E1410] border-[#E8D5B7] hover:border-[#C8B597] hover:bg-[#FEF3E2]'}`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[1px] w-full bg-[#E8D5B7]" />

            {/* Frequency */}
            <div>
              <label className="block font-cabinet font-medium text-[13px] text-[#1E1410] uppercase tracking-wide mb-4">HOW OFTEN DO YOU TRAVEL?</label>
              <div className="grid grid-cols-2 gap-3">
                {frequencyList.map(item => (
                  <button key={item} type="button" onClick={() => setFrequency(item)}
                    className={`relative h-[70px] px-4 rounded-[12px] border transition-all flex items-center justify-center text-center shadow-sm
                    ${frequency === item ? 'bg-[rgba(232,100,12,0.05)] border-[#E8640C] border-[2px]' : 'bg-white border-[#E8D5B7] hover:border-[#C8B597] hover:bg-[#FEF3E2]'}`}>
                    {frequency === item && <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#E8640C] shadow-[0_0_4px_rgba(232,100,12,0.5)]" />}
                    <span className="font-cabinet font-medium text-[14px] leading-snug text-[#1E1410]">{item}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[1px] w-full bg-[#E8D5B7]" />

            {/* Destinations */}
            <div>
              <label className="block font-cabinet font-medium text-[13px] text-[#1E1410] uppercase tracking-wide">WHICH PARTS OF INDIA INTEREST YOU?</label>
              <p className="text-[12px] font-jakarta text-[#B09880] mb-4">Select all that apply.</p>
              <div className="flex flex-wrap gap-2.5">
                {destinationsList.map(dest => (
                  <button key={dest} type="button" onClick={() => toggleArray(destinations, setDestinations, dest)}
                    className={`h-[40px] px-4 rounded-[20px] font-cabinet font-medium text-[14px] transition-all border
                    ${destinations.includes(dest) ? 'bg-[#E8640C] text-white border-[#E8640C] shadow-sm' : 'bg-white text-[#1E1410] border-[#E8D5B7] hover:border-[#C8B597] hover:bg-[#FEF3E2]'}`}>
                    {dest}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[1px] w-full bg-[#E8D5B7]" />

            {/* Interests */}
            <div>
              <label className="block font-cabinet font-medium text-[13px] text-[#1E1410] uppercase tracking-wide mb-4">WHAT DO YOU ENJOY MOST?</label>
              <div className="flex flex-wrap gap-2.5">
                {interestsList.map(interest => (
                  <button key={interest} type="button" onClick={() => toggleArray(interests, setInterests, interest)}
                    className={`h-[40px] px-4 rounded-[20px] font-cabinet font-medium text-[14px] transition-all border
                    ${interests.includes(interest) ? 'bg-[#E8640C] text-white border-[#E8640C] shadow-sm' : 'bg-white text-[#1E1410] border-[#E8D5B7] hover:border-[#C8B597] hover:bg-[#FEF3E2]'}`}>
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="w-full h-[52px] bg-[#E8640C] text-white font-cabinet font-semibold text-base rounded-[10px] flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(232,100,12,0.30)] hover:shadow-[0_6px_20px_rgba(232,100,12,0.40)] hover:bg-[#F07020] transition-all mt-4"
            >
              Continue to Safety <ArrowRight className="w-[18px] h-[18px]" />
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex flex-col gap-8 animate-in">
            {/* Identity */}
            <div>
              <label className="block font-cabinet font-medium text-[13px] text-[#1E1410] uppercase tracking-wide mb-4">I AM TRAVELING AS</label>
              <div className="grid grid-cols-3 gap-3">
                {["Solo Woman", "Solo Man", "Group or Couple"].map(item => (
                  <button key={item} type="button" onClick={() => setIdentity(item)}
                    className={`relative h-[70px] px-2 rounded-[12px] border transition-all flex items-center justify-center text-center shadow-sm
                    ${identity === item ? 'bg-[rgba(232,100,12,0.05)] border-[#E8640C] border-[2px]' : 'bg-white border-[#E8D5B7] hover:border-[#C8B597] hover:bg-[#FEF3E2]'}`}>
                    {identity === item && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E8640C] shadow-[0_0_4px_rgba(232,100,12,0.5)]" />}
                    <span className="font-cabinet font-medium text-[14px] leading-tight text-[#1E1410]">{item}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[1px] w-full bg-[#E8D5B7]" />

            {/* Emergency Contact */}
            <div>
              <label className="block font-cabinet font-medium text-[13px] text-[#1E1410] uppercase tracking-wide">EMERGENCY CONTACT</label>
              <p className="text-[12px] font-jakarta text-[#B09880] mb-4">This person will be alerted if you activate SOS.</p>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block font-cabinet font-bold text-[11px] text-[#B09880] uppercase tracking-widest mb-2">CONTACT FULL NAME</label>
                  <input type="text" value={emergencyName} onChange={e => setEmergencyName(e.target.value)} placeholder="Name of your trusted contact" className="w-full h-[52px] px-4 rounded-[10px] border-[1.5px] border-[#E8D5B7] bg-white font-jakarta text-[15px] outline-none focus:border-[#E8640C] focus:shadow-[0_0_0_4px_rgba(232,100,12,0.15)] transition-all" />
                </div>
                <div>
                  <label className="block font-cabinet font-bold text-[11px] text-[#B09880] uppercase tracking-widest mb-2">CONTACT PHONE NUMBER</label>
                  <div className="relative flex items-center bg-white rounded-[10px] border-[1.5px] border-[#E8D5B7] focus-within:border-[#E8640C] focus-within:shadow-[0_0_0_4px_rgba(232,100,12,0.15)] overflow-visible h-[52px] transition-all">
                    <CountryCodeSelect value={emergencyDialCode} onChange={setEmergencyDialCode} />
                    <input type="tel" value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} placeholder="Their 10-digit mobile number" className="w-full h-full pl-3 pr-4 outline-none bg-transparent font-jakarta text-[15px]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[1px] w-full bg-[#E8D5B7]" />

            {/* Medical Info */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label className="block font-cabinet font-medium text-[13px] text-[#1E1410] uppercase tracking-wide">MEDICAL INFO</label>
                <span className="border border-[#F0A500] text-[#F0A500] font-mono-dm text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] bg-[#FEF3E2]">OPTIONAL</span>
              </div>
              <p className="text-[12px] font-jakarta text-[#B09880] mb-4">Helps guardians and doctors assist you faster in an emergency.</p>
              <textarea
                value={medicalInfo}
                onChange={e => setMedicalInfo(e.target.value)}
                placeholder="Any allergies, conditions, blood group, or medications we should know about."
                className="w-full h-[120px] p-4 rounded-[10px] border-[1.5px] border-[#E8D5B7] bg-white font-jakarta text-[15px] outline-none focus:border-[#E8640C] focus:shadow-[0_0_0_4px_rgba(232,100,12,0.15)] transition-all resize-none shadow-sm"
              />
            </div>

            {/* Location Toggle */}
            <div className="bg-white border-[1.5px] border-[#E8D5B7] rounded-[12px] p-5 flex items-center justify-between shadow-sm">
              <div className="flex gap-4 items-center">
                <MapPin className="w-8 h-8 text-[#E8640C] shrink-0" />
                <div>
                  <h4 className="font-cabinet font-semibold text-[15px] text-[#1E1410] mb-0.5">Allow location access</h4>
                  <p className="font-jakarta text-[13px] text-[#6B4F3A] leading-snug">Required for guardian matching and SOS alerts.</p>
                </div>
              </div>
              <button type="button" onClick={() => setLocationEnabled(!locationEnabled)} className={`w-[44px] h-[24px] rounded-full p-1 transition-colors relative flex items-center shrink-0 ml-3 shadow-inner ${locationEnabled ? "bg-[#2D6A4F]" : "bg-[#E8D5B7]"}`}>
                <div className={`w-[16px] h-[16px] rounded-full bg-white transition-transform duration-200 shadow-sm ${locationEnabled ? "translate-x-[20px]" : "translate-x-0"}`} />
              </button>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex-1 h-[52px] bg-white border border-[#E8D5B7] text-[#1E1410] font-cabinet font-semibold text-base rounded-[10px] hover:bg-[#FEF3E2] transition-all"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={onSubmit}
                disabled={isSubmitting}
                className="flex-[2] h-[52px] bg-[#E8640C] text-white font-cabinet font-semibold text-base rounded-[10px] flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(232,100,12,0.30)] hover:shadow-[0_6px_20px_rgba(232,100,12,0.40)] hover:bg-[#F07020] transition-all disabled:opacity-70"
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <><Shield className="w-[18px] h-[18px]" /> Save & Enter App</>
                )}
              </button>
            </div>

            <div className="flex justify-center items-center gap-1.5 mt-2 pb-8">
              <Lock className="w-[14px] h-[14px] text-[#B09880]" />
              <span className="text-[12px] font-jakarta text-[#B09880]">Your data is encrypted and never sold. Ever.</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
