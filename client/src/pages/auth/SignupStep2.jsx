import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { AuthLayout } from "../../components/layout/AuthLayout";

export default function SignupStep2() {
  const navigate = useNavigate();

  const [travelType, setTravelType] = useState([]);
  const [frequency, setFrequency] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [interests, setInterests] = useState([]);

  const travelTypesList = ["Solo", "With Friends", "With Family", "Backpacking", "Road Trip", "Work Travel"];
  const frequencyList = ["Once a year", "2-4 times a year", "Monthly", "Frequent — I am always on the road"];
  const destinationsList = ["North India", "South India", "East India", "West India", "Northeast India", "Himalayan Region", "Coastal India", "Desert Region", "Central India"];
  const interestsList = ["Cultural Heritage", "Adventure Sports", "Wildlife", "Food Trails", "Spiritual Travel", "Photography", "Offbeat Destinations", "Beaches", "Hill Stations"];

  const toggleArray = (array, setArray, item) => {
    if (array.includes(item)) setArray(array.filter((i) => i !== item));
    else setArray([...array, item]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem("signup_step2", JSON.stringify({
      travelTypes: travelType,
      frequency,
      destinations,
      interests
    }));
    navigate("/auth/signup/step3");
  };

  const stepIndicator = (
    <div className="flex flex-col items-end gap-[20px] pointer-events-none">
      <div className="flex items-center gap-4">
        <span className="font-mono-dm text-[11px] text-white flex items-center justify-center gap-1.5 bg-black/20 px-2 py-0.5 rounded backdrop-blur-sm">Basic Info <Check className="w-3 h-3 text-banyan stroke-[3px]"/></span>
        <div className="w-[10px] h-[10px] rounded-full bg-white relative z-10" />
      </div>
      <div className="w-[2px] h-[20px] bg-white/20 absolute top-[15px] right-[4px]" />
      <div className="flex items-center gap-4">
        <span className="font-mono-dm text-[11px] text-white font-bold bg-black/20 px-2 py-0.5 rounded backdrop-blur-sm">Preferences</span>
        <div className="w-[10px] h-[10px] rounded-full bg-saffron shadow-[0_0_8px_rgba(232,100,12,0.8)] relative z-10" />
      </div>
      <div className="w-[2px] h-[20px] bg-white/20 absolute top-[45px] right-[4px]" />
      <div className="flex items-center gap-4">
        <span className="font-mono-dm text-[11px] text-white/60">Safety</span>
        <div className="w-[10px] h-[10px] rounded-full bg-white/30 relative z-10" />
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
      photoUrl="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2000"
      topLabel="STEP 2 OF 3"
      quote={`The more we know about\nhow you travel, the safer we make it.`}
      stepIndicator={stepIndicator}
      topRightContent={TopRightLink}
    >
      <div>
        <h1 className="font-display font-bold text-4xl text-charcoal mb-2">Your travel style</h1>
        <p className="font-jakarta text-[15px] text-taupe mb-8">Help us personalize your safety profile and trip recommendations.</p>
        
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
            <div className="w-3 h-3 rounded-full bg-saffron shadow-[0_0_8px_rgba(232,100,12,0.5)]" />
            <span className="font-mono-dm text-[10px] font-bold text-charcoal tracking-widest uppercase">Preferences</span>
          </div>
          <div className="flex-1 h-[2px] bg-sand mx-4 -mt-5" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-sand" />
            <span className="font-mono-dm text-[10px] text-taupe tracking-widest uppercase">Safety</span>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-8">
        
        {/* Section A */}
        <div>
          <label className="block font-cabinet font-medium text-[13px] text-charcoal uppercase tracking-wide">HOW DO YOU USUALLY TRAVEL?</label>
          <p className="text-[12px] font-jakarta text-taupe mb-4">Select all that apply.</p>
          <div className="flex flex-wrap gap-2.5">
            {travelTypesList.map(type => (
              <button key={type} type="button" onClick={() => toggleArray(travelType, setTravelType, type)} 
                className={`h-[40px] px-5 rounded-[20px] font-cabinet font-medium text-[14px] transition-all border
                ${travelType.includes(type) ? 'bg-saffron text-white border-saffron shadow-sm' : 'bg-white text-charcoal border-sand hover:border-[#C8B597] hover:bg-ivory'}`}>
                {type}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[1px] w-full bg-sand/80"></div>

        {/* Section B */}
        <div>
          <label className="block font-cabinet font-medium text-[13px] text-charcoal uppercase tracking-wide mb-4">HOW OFTEN DO YOU TRAVEL?</label>
          <div className="grid grid-cols-2 gap-3">
            {frequencyList.map(item => (
              <button key={item} type="button" onClick={() => setFrequency(item)}
                className={`relative h-[80px] px-4 rounded-[12px] border transition-all flex items-center justify-center text-center shadow-sm
                ${frequency === item ? 'bg-[rgba(232,100,12,0.05)] border-saffron border-[2px]' : 'bg-white border-sand hover:border-[#C8B597] hover:bg-ivory'}`}>
                {frequency === item && <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-saffron shadow-[0_0_4px_rgba(232,100,12,0.5)]" />}
                <span className="font-cabinet font-medium text-[15px] leading-snug text-charcoal">{item}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="h-[1px] w-full bg-sand/80"></div>

        {/* Section C */}
        <div>
          <label className="block font-cabinet font-medium text-[13px] text-charcoal uppercase tracking-wide">WHICH PARTS OF INDIA INTEREST YOU?</label>
          <p className="text-[12px] font-jakarta text-taupe mb-4">Select all that apply.</p>
          <div className="flex flex-wrap gap-2.5">
            {destinationsList.map(dest => (
              <button key={dest} type="button" onClick={() => toggleArray(destinations, setDestinations, dest)} 
                className={`h-[40px] px-4 rounded-[20px] font-cabinet font-medium text-[14px] transition-all border
                ${destinations.includes(dest) ? 'bg-saffron text-white border-saffron shadow-sm' : 'bg-white text-charcoal border-sand hover:border-[#C8B597] hover:bg-ivory'}`}>
                {dest}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[1px] w-full bg-sand/80"></div>

        {/* Section D */}
        <div>
          <label className="block font-cabinet font-medium text-[13px] text-charcoal uppercase tracking-wide mb-4">WHAT DO YOU ENJOY MOST?</label>
          <div className="flex flex-wrap gap-2.5">
            {interestsList.map(interest => (
              <button key={interest} type="button" onClick={() => toggleArray(interests, setInterests, interest)} 
                className={`h-[40px] px-4 rounded-[20px] font-cabinet font-medium text-[14px] transition-all border
                ${interests.includes(interest) ? 'bg-saffron text-white border-saffron shadow-sm' : 'bg-white text-charcoal border-sand hover:border-[#C8B597] hover:bg-ivory'}`}>
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
            <button type="submit" className="w-full h-[52px] bg-saffron text-white font-cabinet font-semibold text-base rounded-[10px] flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(232,100,12,0.30)] hover:shadow-[0_6px_20px_rgba(232,100,12,0.40)] hover:bg-[#F07020] transition-all">
            Continue to Step 3 <ArrowRight className="w-[18px] h-[18px]" />
            </button>

            <Link to="/auth/signup" className="flex items-center justify-center gap-2 text-[14px] font-jakarta text-taupe hover:text-charcoal transition-colors mt-6 w-fit mx-auto">
            <ArrowLeft className="w-4 h-4" /> Back to Step 1
            </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

