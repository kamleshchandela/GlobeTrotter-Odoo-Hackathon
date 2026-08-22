import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, MapPin, Shield, Lock } from "lucide-react";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { CountryCodeSelect } from "../../components/ui/CountryCodeSelect";
import { API_BASE_URL } from "../../config/env";

export default function SignupStep3() {
  const navigate = useNavigate();
  const [identity, setIdentity] = useState("");
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [emergencyDialCode, setEmergencyDialCode] = useState("+91");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [medicalInfo, setMedicalInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const step1 = JSON.parse(sessionStorage.getItem("signup_step1") || "{}");
      const step2 = JSON.parse(sessionStorage.getItem("signup_step2") || "{}");
      
      const payload = {
        ...step1,
        ...step2,
        identity,
        emergencyContact: {
          name: emergencyName,
          phone: emergencyDialCode + emergencyPhone
        },
        medicalInfo,
        locationEnabled
      };

      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok) {
        sessionStorage.setItem("verify_userId", data.userId);
        sessionStorage.setItem("verify_email", data.email);
        // Clear old steps
        sessionStorage.removeItem("signup_step1");
        sessionStorage.removeItem("signup_step2");
        navigate("/auth/verify-otp");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepIndicator = (
    <div className="flex flex-col items-end gap-[20px] pointer-events-none">
      <div className="flex items-center gap-4">
        <span className="font-mono-dm text-[11px] text-white flex items-center justify-center gap-1.5 bg-black/20 px-2 py-0.5 rounded backdrop-blur-sm">Basic Info <Check className="w-3 h-3 text-banyan stroke-[3px]"/></span>
        <div className="w-[10px] h-[10px] rounded-full bg-white relative z-10" />
      </div>
      <div className="w-[2px] h-[20px] bg-white/20 absolute top-[15px] right-[4px]" />
      <div className="flex items-center gap-4">
        <span className="font-mono-dm text-[11px] text-white flex items-center justify-center gap-1.5 bg-black/20 px-2 py-0.5 rounded backdrop-blur-sm">Preferences <Check className="w-3 h-3 text-banyan stroke-[3px]"/></span>
        <div className="w-[10px] h-[10px] rounded-full bg-white relative z-10" />
      </div>
      <div className="w-[2px] h-[20px] bg-white/20 absolute top-[45px] right-[4px]" />
      <div className="flex items-center gap-4">
        <span className="font-mono-dm text-[11px] text-white font-bold bg-black/20 px-2 py-0.5 rounded backdrop-blur-sm">Safety</span>
        <div className="w-[10px] h-[10px] rounded-full bg-saffron shadow-[0_0_8px_rgba(232,100,12,0.8)] relative z-10" />
      </div>
    </div>
  );

  const TopRightLink = (
    <span className="text-sm font-jakarta text-taupe">
      Already have an account?{" "}
      <Link to="/auth/login" className="text-saffron hover:underline font-medium">Log in</Link>
    </span>
  );

  return (
    <AuthLayout
      photoUrl="https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=2000"
      topLabel="STEP 3 OF 3"
      quote={`Your safety setup takes 60 seconds.\nIt could matter for a lifetime.`}
      stepIndicator={stepIndicator}
      topRightContent={TopRightLink}
    >
      <div>
        <h1 className="font-display font-bold text-4xl text-charcoal mb-2">Set up your safety</h1>
        <p className="font-jakarta text-[15px] text-taupe mb-8">This information is only used to protect you — never shared without your consent.</p>
        
        {/* Horizontal Step Strip */}
        <div className="flex justify-between items-center mb-10 pb-4 border-b border-sand text-center px-4">
          <div className="flex flex-col items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-banyan flex items-center justify-center">
                <Check className="w-[8px] h-[8px] text-white stroke-[3px]" />
            </div>
            <span className="font-mono-dm text-[10px] font-bold text-charcoal tracking-widest uppercase">Basic Info</span>
          </div>
          <div className="flex-1 h-[2px] bg-sand mx-4 -mt-5" />
          <div className="flex flex-col items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-banyan flex items-center justify-center">
                <Check className="w-[8px] h-[8px] text-white stroke-[3px]" />
            </div>
            <span className="font-mono-dm text-[10px] font-bold text-charcoal tracking-widest uppercase">Preferences</span>
          </div>
          <div className="flex-1 h-[2px] bg-sand mx-4 -mt-5" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-saffron shadow-[0_0_8px_rgba(232,100,12,0.5)]" />
            <span className="font-mono-dm text-[10px] font-bold text-charcoal tracking-widest uppercase">Safety</span>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-8">
        
        {/* Section A */}
        <div>
          <label className="block font-cabinet font-medium text-[13px] text-charcoal uppercase tracking-wide mb-4">I AM TRAVELING AS</label>
          <div className="grid grid-cols-3 gap-3">
            {["Solo Woman", "Solo Man", "Group or Couple"].map(item => (
              <button key={item} type="button" onClick={() => setIdentity(item)}
                className={`relative h-[70px] px-2 rounded-[12px] border transition-all flex items-center justify-center text-center shadow-sm
                ${identity === item ? 'bg-[rgba(232,100,12,0.05)] border-saffron border-[2px]' : 'bg-white border-sand hover:border-[#C8B597] hover:bg-ivory'}`}>
                {identity === item && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-saffron shadow-[0_0_4px_rgba(232,100,12,0.5)]" />}
                <span className="font-cabinet font-medium text-[14px] leading-tight text-charcoal">{item}</span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-[12px] font-jakarta text-taupe leading-relaxed">This helps us match you with the most relevant guardian network and safety alerts.</p>
        </div>
        <div className="h-[1px] w-full bg-sand/80"></div>

        {/* Section B */}
        <div>
          <label className="block font-cabinet font-medium text-[13px] text-charcoal uppercase tracking-wide">EMERGENCY CONTACT</label>
          <p className="text-[12px] font-jakarta text-taupe mb-4">This person will be alerted if you activate SOS.</p>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block font-cabinet font-bold text-[11px] text-taupe uppercase tracking-widest mb-2">CONTACT FULL NAME</label>
              <input type="text" value={emergencyName} onChange={e => setEmergencyName(e.target.value)} placeholder="Name of your trusted contact" className="w-full h-[52px] px-4 rounded-[10px] border-[1.5px] border-sand bg-white font-jakarta text-[15px] outline-none focus:border-saffron focus:shadow-[0_0_0_4px_rgba(232,100,12,0.15)] transition-all" />
            </div>
            <div>
              <label className="block font-cabinet font-bold text-[11px] text-taupe uppercase tracking-widest mb-2">CONTACT PHONE NUMBER</label>
              <div className="relative flex items-center bg-white rounded-[10px] border-[1.5px] border-sand focus-within:border-saffron focus-within:shadow-[0_0_0_4px_rgba(232,100,12,0.15)] overflow-visible h-[52px] transition-all">
                <CountryCodeSelect 
                  value={emergencyDialCode} 
                  onChange={setEmergencyDialCode} 
                />
                <input type="tel" value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} placeholder="Their 10-digit mobile number" className="w-full h-full pl-3 pr-4 outline-none bg-transparent font-jakarta text-[15px]" />
              </div>
            </div>
          </div>
        </div>
        <div className="h-[1px] w-full bg-sand/80"></div>

        {/* Section C */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="block font-cabinet font-medium text-[13px] text-charcoal uppercase tracking-wide">MEDICAL INFO</label>
            <span className="border border-turmeric text-turmeric font-mono-dm text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] bg-[#FEF3E2]">OPTIONAL</span>
          </div>
          <p className="text-[12px] font-jakarta text-taupe mb-4">Helps guardians and doctors assist you faster in an emergency.</p>
          <textarea 
            value={medicalInfo}
            onChange={e => setMedicalInfo(e.target.value)}
            placeholder="Any allergies, conditions, blood group, or medications we should know about." 
            className="w-full h-[120px] p-4 rounded-[10px] border-[1.5px] border-sand bg-white font-jakarta text-[15px] outline-none focus:border-saffron focus:shadow-[0_0_0_4px_rgba(232,100,12,0.15)] transition-all resize-none shadow-sm"
          />
        </div>

        {/* Section D */}
        <div className="bg-white border-[1.5px] border-sand rounded-[12px] p-5 flex items-center justify-between shadow-sm">
          <div className="flex gap-4 items-center">
            <MapPin className="w-8 h-8 text-saffron shrink-0" />
            <div>
              <h4 className="font-cabinet font-semibold text-[15px] text-charcoal mb-0.5">Allow location access</h4>
              <p className="font-jakarta text-[13px] text-taupe leading-snug">Required for guardian matching and SOS alerts to function.</p>
            </div>
          </div>
          <button type="button" onClick={() => setLocationEnabled(!locationEnabled)} className={`w-[44px] h-[24px] rounded-full p-1 transition-colors relative flex items-center shrink-0 ml-3 shadow-inner ${locationEnabled ? "bg-banyan" : "bg-sand"}`}>
            <div className={`w-[16px] h-[16px] rounded-full bg-white transition-transform duration-200 shadow-sm ${locationEnabled ? "translate-x-[20px]" : "translate-x-0"}`} />
          </button>
        </div>

        <div className="mt-2 text-center pb-8">
            <button type="submit" disabled={isSubmitting} className="w-full h-[52px] bg-saffron text-white font-cabinet font-semibold text-base rounded-[10px] flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(232,100,12,0.30)] hover:shadow-[0_6px_20px_rgba(232,100,12,0.40)] hover:bg-[#F07020] transition-all disabled:opacity-70 disabled:cursor-not-allowed">
            {isSubmitting ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <><Shield className="w-[18px] h-[18px] fill-white stroke-saffron" /> Complete Setup and Enter App</>
            )}
            </button>
            <div className="flex justify-center items-center gap-1.5 mt-5">
                <Lock className="w-[14px] h-[14px] text-taupe" />
                <span className="text-[12px] font-jakarta text-taupe">Your data is encrypted and never sold. Ever.</span>
            </div>
            <Link to="/auth/signup/step2" className="flex items-center justify-center gap-2 text-[14px] font-jakarta text-taupe hover:text-charcoal transition-colors mt-8 w-fit mx-auto">
                <ArrowLeft className="w-4 h-4" /> Back to Step 2
            </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

