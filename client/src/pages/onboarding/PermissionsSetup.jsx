import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Bell, Lock, CheckCircle2, Shield } from "lucide-react";

export default function PermissionsSetup() {
  const navigate = useNavigate();
  const [locationState, setLocationState] = useState("idle"); // idle, granted, denied
  const [notificationState, setNotificationState] = useState("idle");
  const [bothGranted, setBothGranted] = useState(false);

  useEffect(() => {
    if (locationState === "granted" && notificationState === "granted") {
      setBothGranted(true);
    } else {
      setBothGranted(false);
    }
  }, [locationState, notificationState]);

  const requestLocation = () => {
    // In real app, standard API call here navigator.geolocation.getCurrentPosition
    setLocationState("granted");
  };

  const requestNotifications = () => {
    // In real app, Notification.requestPermission()
    setNotificationState("granted");
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col font-jakarta relative overflow-hidden selection:bg-saffron/20">
      
      {/* Top Strip (Absolute over photo) */}
      <div className="absolute top-[32px] left-0 right-0 px-6 flex justify-between items-center z-20">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[13px] text-taupe font-jakarta hover:text-charcoal transition-colors bg-white/80 px-2 py-1 rounded-full backdrop-blur-sm">
          <ArrowLeft className="w-5 h-5 text-charcoal/70" /> Back
        </button>
        <div className="flex gap-2 items-center bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
          <div className="w-[8px] h-[8px] rounded-full bg-saffron" />
          <div className="w-[8px] h-[8px] rounded-full bg-saffron" />
          <div className="w-[24px] h-[8px] rounded-full bg-saffron" />
        </div>
        <div className="w-[60px]" /> {/* Spacer for flex balance */}
      </div>

      {/* Top Photograph Header */}
      <div className="relative w-full h-[220px] shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=800" 
          alt="Jodhpur City Roofs"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1e1410]/45" />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <span className="font-mono-dm text-[12px] text-white uppercase tracking-[2px] mb-2">Almost Ready</span>
          <h2 className="font-display font-bold text-[28px] text-white text-center">Just two quick<br/>permissions.</h2>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col px-6 pt-7 pb-[120px] max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <span className="font-mono-dm text-[11px] text-taupe uppercase tracking-[1.5px] block mb-3">Why We Need Access</span>
          <h3 className="font-display font-bold text-[24px] text-charcoal mb-3 leading-tight">These two permissions power everything.</h3>
          <p className="font-jakarta text-[14px] text-taupe max-w-[300px] mx-auto leading-relaxed">
            Without location, we cannot assign guardians or activate SOS. Without notifications, we cannot alert you to safety conditions.
          </p>
        </div>

        <div className="flex flex-col gap-5 relative z-10 w-full mb-8">
          
          {/* Location Access Card */}
          <div className={`w-full rounded-[16px] p-5 shadow-[0_4px_16px_rgba(45,106,79,0.12)] transition-all duration-300
            ${locationState === 'granted' ? 'bg-[#2D6A4F]/5 border-[1.5px] border-banyan' : 
              locationState === 'denied' ? 'bg-white border-[1.5px] border-sand' : 
              'bg-white border-[1.5px] border-banyan/40'}`}>
            
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-[56px] h-[56px] rounded-[14px] flex items-center justify-center shrink-0 transition-colors
                ${locationState === 'denied' ? 'bg-sand/30' : 'bg-banyan/10'}`}>
                <MapPin className={`w-[28px] h-[28px] ${locationState === 'denied' ? 'text-taupe' : 'text-banyan'}`} />
              </div>
              <div className="flex-1">
                <h4 className="font-cabinet font-bold text-[18px] text-charcoal leading-none mb-2">Location Access</h4>
                <div className="inline-block bg-sindoor/10 text-sindoor font-mono-dm text-[10px] px-2 py-0.5 rounded-[4px] uppercase font-bold tracking-wider">Required</div>
              </div>
            </div>

            {locationState === "idle" && (
              <div className="animate-fade-in">
                <p className="font-jakarta text-[14px] text-taupe leading-[1.55] mb-3.5">
                  Used for: Guardian matching near your location, finding hospitals and safe zones, and activating precise SOS.
                </p>
                <div className="flex flex-col gap-3 mb-4">
                  {["Guardian assignments by proximity", "SOS location broadcast", "Nearby hospital discovery"].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-banyan shrink-0" />
                      <span className="font-jakarta text-[13px] text-charcoal">{feat}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-2 mb-4 bg-sand/20 p-3 rounded-lg">
                  <Lock className="w-4 h-4 text-taupe shrink-0 mt-0.5" />
                  <span className="font-jakarta text-[12px] text-taupe leading-snug">Your location is never sold or shared with advertisers. Ever.</span>
                </div>
                <button onClick={requestLocation} className="w-full h-[44px] rounded-[10px] bg-banyan text-white font-cabinet font-semibold text-[14px] shadow-[0_2px_8px_rgba(45,106,79,0.3)] hover:brightness-110 active:scale-[0.98] transition-all">
                  Allow Location Access
                </button>
                <p className="text-center font-jakarta text-[12px] text-[#A08E7D] mt-2">You can change this in Settings at any time.</p>
              </div>
            )}

            {locationState === "granted" && (
              <div className="flex items-center justify-center gap-2 h-[44px] bg-white rounded-[10px] animate-fade-in border border-banyan/20 shadow-sm mt-2">
                <CheckCircle2 className="w-5 h-5 text-banyan shrink-0" />
                <span className="font-cabinet font-semibold text-[15px] text-banyan">Location Access Granted</span>
              </div>
            )}
          </div>

          {/* Notifications Card */}
          <div className={`w-full rounded-[16px] p-5 shadow-[0_4px_16px_rgba(232,100,12,0.08)] transition-all duration-300
            ${notificationState === 'granted' ? 'bg-[#E8640C]/5 border-[1.5px] border-saffron' : 
              notificationState === 'denied' ? 'bg-white border-[1.5px] border-sand' : 
              'bg-white border-[1.5px] border-saffron/40'}`}>
            
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-[56px] h-[56px] rounded-[14px] flex items-center justify-center shrink-0 transition-colors
                ${notificationState === 'denied' ? 'bg-sand/30' : 'bg-saffron/10'}`}>
                <Bell className={`w-[28px] h-[28px] ${notificationState === 'denied' ? 'text-taupe' : 'text-saffron fill-saffron/20'}`} />
              </div>
              <div className="flex-1">
                <h4 className="font-cabinet font-bold text-[18px] text-charcoal leading-none mb-2">Push Notifications</h4>
                <div className="inline-block bg-turmeric/12 text-turmeric font-mono-dm text-[10px] px-2 py-0.5 rounded-[4px] uppercase font-bold tracking-wider">Recommended</div>
              </div>
            </div>

            {notificationState === "idle" && (
              <div className="animate-fade-in">
                <p className="font-jakarta text-[14px] text-taupe leading-[1.55] mb-3.5">
                  Used for: Real-time safety alerts, guardian responses, and SOS confirmation updates on your route.
                </p>
                <div className="flex flex-col gap-3 mb-4">
                  {["Safety condition alerts", "Guardian response updates", "Trip digest & reminders"].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-saffron shrink-0" />
                      <span className="font-jakarta text-[13px] text-charcoal">{feat}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-2 mb-4 bg-sand/20 p-3 rounded-lg">
                  <Bell className="w-4 h-4 text-taupe shrink-0 mt-0.5" />
                  <span className="font-jakarta text-[12px] text-taupe leading-snug">We do not send marketing notifications without opt-in.</span>
                </div>
                <button onClick={requestNotifications} className="w-full h-[44px] rounded-[10px] bg-saffron text-white font-cabinet font-semibold text-[14px] shadow-saffron hover:brightness-110 active:scale-[0.98] transition-all">
                  Allow Notifications
                </button>
                <p className="text-center font-jakarta text-[12px] text-[#A08E7D] mt-2">You can customise notification types in Settings.</p>
              </div>
            )}

            {notificationState === "granted" && (
              <div className="flex items-center justify-center gap-2 h-[44px] bg-white rounded-[10px] animate-fade-in border border-saffron/20 shadow-sm mt-2">
                <CheckCircle2 className="w-5 h-5 text-saffron shrink-0" />
                <span className="font-cabinet font-semibold text-[15px] text-saffron">Notifications Enabled</span>
              </div>
            )}
          </div>

          {/* Success Confirmation Row */}
          {bothGranted && (
            <div className="w-full bg-banyan/10 rounded-[12px] p-3.5 flex items-center justify-center gap-2.5 animate-fade-in border border-banyan/20 mb-2">
              <Shield className="w-6 h-6 text-banyan fill-banyan/20 shrink-0" />
              <span className="font-cabinet font-semibold text-[15px] text-banyan">You are fully protected. Ready to go.</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-cream via-cream to-transparent z-50 flex justify-center">
        <div className="w-full max-w-md flex flex-col gap-2">
           {!bothGranted && <p className="text-center font-jakarta text-[14px] text-taupe mb-1">You must enable permissions to enter.</p>}
           <button 
             onClick={() => navigate('/home')}
             disabled={!bothGranted}
             className={`w-full h-[56px] rounded-[14px] font-cabinet font-bold text-[16px] transition-all duration-300
             ${bothGranted 
               ? "bg-saffron text-white shadow-[0_4px_16px_rgba(232,100,12,0.3)] hover:shadow-[0_6px_20px_rgba(232,100,12,0.4)] active:scale-[0.98] cursor-pointer" 
               : "bg-sand/60 text-[#a38a70] shadow-none cursor-not-allowed border border-sand"}`}>
             Enter My Itinerary
           </button>
        </div>
      </div>
    </div>
  );
}
