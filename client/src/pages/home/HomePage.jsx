import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Bell, Calendar, Sun, Shield, Clock, ChevronRight, TrendingUp, HeartPulse, CheckCircle2, Circle, Users, Compass, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import TopAppBar from '../../components/shared/TopAppBar';

const PHOTOS = {
  jaisalmer: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
  varanasi: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
  ranakpur: 'https://images.unsplash.com/photo-1597078804310-7dfe09d55fdc?auto=format&fit=crop&w=600&q=80',
  kumbhalgarh: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=600&q=80',
  bundi: 'https://images.unsplash.com/photo-1593693397690-362cb9666c6b?auto=format&fit=crop&w=600&q=80',
  meghalaya: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
  ladakh: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80',
  kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
  chettinad: 'https://images.unsplash.com/photo-1620023447953-ad0db4eb7bdc?auto=format&fit=crop&w=600&q=80',
  user: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80',
  doc1: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80',
  doc2: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&q=80',
  mapThumb: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80'
};

const SectionLabel = ({ children }) => (
  <p className="font-mono-dm text-[10px] uppercase tracking-[2px] text-[#B09880] mb-[2px]">{children}</p>
);

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const firstName = user?.fullName?.split(' ')[0] || 'Traveler';
  return (
    <div className="min-h-screen bg-[#FFF8F0] relative font-jakarta">
      <Helmet>
        <title>Dashboard | My Itinerary - AI Travel & Healthcare</title>
        <meta
          name="description"
          content="Welcome to your My Itinerary dashboard. Plan your next AI-powered trip, check local safety scores, and access healthcare services near you."
        />
        <link rel="canonical" href="https://myitinerary.com/" />
      </Helmet>

      <div className="fixed inset-0 pointer-events-none opacity-[0.04] mix-blend-multiply z-50" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
      <TopAppBar variant="logo" />
      <div className="mx-auto max-w-[1440px] px-[24px] lg:px-[48px] pt-[8px]">
        {/* Welcome Banner */}
        <div className="w-full bg-gradient-to-r from-[#E8640C] to-[#F0A500] rounded-[14px] px-[24px] py-[14px] mb-[24px] flex items-center justify-between shadow-[0_4px_16px_rgba(232,100,12,0.2)]">
          <div className="flex items-center gap-[10px]">
            <Shield size={20} fill="white" className="text-transparent" />
            <div>
              <h3 className="font-cabinet font-semibold text-[14px] text-white leading-tight">Welcome, {firstName}. Your safety network is setting up.</h3>
              <p className="font-jakarta text-[12px] text-white/75 mt-0.5">Complete your safety setup to activate full protection.</p>
            </div>
          </div>
          <Link to="/safety" className="h-[36px] bg-white rounded-[10px] px-[16px] font-cabinet font-semibold text-[13px] text-[#E8640C] shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:scale-105 transition-transform flex items-center">Complete Setup</Link>
        </div>
        <main className="flex flex-col lg:grid lg:grid-cols-[280px_1fr_320px] gap-[16px] pb-20 items-start">
          <aside className="w-full lg:sticky lg:top-[104px] flex flex-col pb-4">
            <L1_Greeting user={user} />
            <L2_SafetyCard />
            <L3_GuardianNetwork />
            <L4_RecentAlerts />
          </aside>
          <section className="flex flex-col pt-4 lg:pt-0 w-full min-w-0">
            <C1_WelcomeHero />
            <C2_HowItWorks />
            <C3_SafetySnapshot />
            <C5_Trending />
          </section>
          <aside className="w-full lg:sticky lg:top-[104px] flex flex-col pt-4 lg:pt-0 pb-4">
            <R1_Doctors />
            <R2_TravelProfile user={user} />
            <R3_Notifications />
          </aside>
        </main>
      </div>
    </div>
  );
};

/* ── LEFT SIDEBAR ── */
const L1_Greeting = ({ user }) => {
  const firstName = user?.fullName?.split(' ')[0] || 'Traveler';
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userLocation, setUserLocation] = useState(() => {
    const saved = sessionStorage.getItem('cached_location');
    return saved ? JSON.parse(saved) : { city: "Udaipur", region: "Rajasthan" };
  });
  const [weather, setWeather] = useState(() => {
    const saved = sessionStorage.getItem('cached_weather');
    return saved ? JSON.parse(saved) : { temp: 32, condition: "Clear Sky" };
  });
  const [loading, setLoading] = useState(!sessionStorage.getItem('cached_location'));

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    
    // If already cached, don't fetch again
    if (sessionStorage.getItem('cached_location')) {
      return () => clearInterval(timer);
    }

    // Attempt to get real location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`);
          const geoData = await geoRes.json();
          const city = geoData.address.city || geoData.address.town || geoData.address.village || "Unknown";
          const region = geoData.address.state || "India";
          const locData = { city, region };
          setUserLocation(locData);
          sessionStorage.setItem('cached_location', JSON.stringify(locData));

          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
          const weatherData = await weatherRes.json();
          const temp = Math.round(weatherData.current_weather.temperature);
          const wData = { temp, condition: "Detected" };
          setWeather(wData);
          sessionStorage.setItem('cached_weather', JSON.stringify(wData));
          
          setLoading(false);
        } catch (err) {
          console.error("Location/Weather fetch failed", err);
          setLoading(false);
        }
      }, () => setLoading(false));
    } else {
      setLoading(false);
    }

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning,";
    if (hour < 17) return "Good Afternoon,";
    if (hour < 21) return "Good Evening,";
    return "Good Night,";
  };

  const formattedDate = currentTime.toLocaleDateString('en-US', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  return (
    <div className="pt-[16px] pb-[24px]">
      <p className="font-jakarta text-[14px] text-[#6B4F3A]">{getGreeting()}</p>
      <h1 className="font-display font-bold text-[32px] text-[#1E1410] leading-none mt-1">{firstName}</h1>
      <div className="mt-[12px] flex items-center gap-2">
        <span className="flex items-center gap-1.5 font-mono-dm text-[11px] text-[#6B4F3A]">
          <MapPin size={13} className={loading ? "animate-pulse text-[#B09880]" : "text-[#E8640C]"} /> 
          {loading ? "Detecting location..." : `${userLocation.city}, ${userLocation.region}`}
        </span>
        <span className="w-px h-[10px] bg-[#E8D5B7]" />
        <span className="flex items-center gap-1.5 font-mono-dm text-[11px] text-[#B09880]">
          <Calendar size={13} /> {formattedDate}
        </span>
      </div>
      <div className="mt-[16px] flex items-center gap-1.5">
        <Sun size={18} className={loading ? "animate-spin text-[#E8D5B7]" : "text-[#F0A500]"} fill="currentColor" />
        <span className="font-cabinet font-medium text-[14px] text-[#6B4F3A]">
          {loading ? "--°C" : `${weather.temp}°C · ${weather.condition}`}
        </span>
      </div>
    </div>
  );
};

const L2_SafetyCard = () => (
  <div className="w-full bg-[#FFFFFF] rounded-[20px] p-[20px] border-[1.5px] border-[#E8640C]/35 shadow-[0_4px_16px_rgba(232,100,12,0.10)] border-l-[4px] border-l-[#E8640C] relative">
    <div className="flex justify-between items-center">
      <p className="font-mono-dm text-[10px] text-[#B09880] uppercase tracking-[2px]">Your Safety Status</p>
      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#E8640C]" /><span className="font-cabinet font-semibold text-[11px] text-[#E8640C]">Setup Needed</span></div>
    </div>
    <div className="mt-[16px] flex items-center gap-3">
      <Shield size={32} className="text-[#E8640C] shrink-0" strokeWidth={1.5} />
      <div><h3 className="font-display font-bold text-[18px] text-[#1E1410] leading-tight">Safety Incomplete</h3><p className="font-jakarta text-[12px] text-[#6B4F3A] mt-0.5">Complete setup to activate protection</p></div>
    </div>
    <div className="mt-[14px] w-full h-px bg-[#E8D5B7]" />
    <div className="mt-[14px] flex flex-col gap-3">
      {[{done:true,text:'Location access enabled'},{done:true,text:'Emergency contact saved'},{done:false,text:'Request your first guardian'}].map((r,i)=>(
        <div key={i} className="flex items-center justify-between">
          <div className="flex items-center gap-2">{r.done ? <CheckCircle2 size={16} className="text-[#2D6A4F]" fill="#2D6A4F" color="white"/> : <Circle size={16} className="text-[#E8D5B7]"/>}<span className={`font-jakarta text-[13px] ${r.done?'text-[#1E1410]':'text-[#6B4F3A]'}`}>{r.text}</span></div>
          <span className={`font-mono-dm text-[10px] ${r.done?'text-[#2D6A4F]':'text-[#B09880]'}`}>{r.done?'Done':'Pending'}</span>
        </div>))}
    </div>
    <Link to="/safety" className="mt-[14px] w-full h-[40px] rounded-[10px] bg-[#E8640C] text-white font-cabinet font-semibold text-[13px] flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(232,100,12,0.25)] hover:bg-[#D5570A] transition-colors"><Shield size={14} fill="white" /> Activate Full Safety</Link>
    <p className="mt-[8px] font-jakarta text-[11px] text-[#B09880] text-center">Takes less than 2 minutes.</p>
  </div>
);

const L3_GuardianNetwork = () => (
  <div className="mt-[20px] bg-[#FFFFFF] border border-[#E8D5B7] rounded-[16px] p-[16px] shadow-[0_2px_8px_rgba(30,20,16,0.07)]">
    <SectionLabel>Guardian Network</SectionLabel>
    <div className="mt-[16px] flex flex-col items-center text-center">
      <Users size={32} className="text-[#E8D5B7]" />
      <h3 className="mt-[10px] font-cabinet font-semibold text-[13px] text-[#6B4F3A]">No guardians assigned yet</h3>
      <p className="mt-[6px] font-jakarta text-[12px] text-[#B09880] leading-relaxed max-w-[220px]">Guardians are local verified residents who assist you when you need help.</p>
    </div>
    <div className="mt-[12px] flex flex-col items-center gap-2 w-full">
      <div className="flex justify-center gap-2 flex-wrap w-full">
        <div className="h-[28px] bg-[#FEF3E2] border border-[#E8D5B7] rounded-[100px] px-[10px] flex items-center gap-1.5 whitespace-nowrap"><Clock size={12} className="text-[#2D6A4F] shrink-0" /><span className="font-jakarta text-[11px] text-[#6B4F3A]">Avg. 4 min response</span></div>
        <div className="h-[28px] bg-[#FEF3E2] border border-[#E8D5B7] rounded-[100px] px-[10px] flex items-center gap-1.5 whitespace-nowrap"><Users size={12} className="text-[#C0392B] shrink-0" /><span className="font-jakarta text-[11px] text-[#6B4F3A]">14 women guardians</span></div>
      </div>
    </div>
    <Link to="/safety/guardians" className="mt-[16px] w-full h-[40px] rounded-[10px] bg-white border-[1.5px] border-[#E8640C] text-[#E8640C] font-cabinet font-semibold text-[13px] hover:bg-[#E8640C] hover:text-white transition-colors flex items-center justify-center">Find a Guardian</Link>
  </div>
);

const L4_RecentAlerts = () => (
  <div className="mt-[20px] bg-[#FEF3E2] border border-[#E8D5B7] rounded-[12px] p-[14px]">
    <SectionLabel>Recent Alerts</SectionLabel>
    <div className="mt-[10px] flex flex-col items-center text-center py-2">
      <Bell size={20} className="text-[#E8D5B7]" />
      <h3 className="mt-[8px] font-cabinet font-medium text-[13px] text-[#6B4F3A]">No alerts yet</h3>
      <p className="mt-[4px] font-jakarta text-[12px] text-[#B09880]">Safety alerts for your location will appear here.</p>
    </div>
  </div>
);

/* ── CENTER COLUMN ── */
const C1_WelcomeHero = () => (
  <div className="w-full h-[220px] rounded-[20px] overflow-hidden relative shadow-[0_8px_32px_rgba(30,20,16,0.12)] group">
    <img src={PHOTOS.jaisalmer} alt="Sunset at Jaisalmer Fort, Rajasthan" className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out" />
    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[rgba(30,20,16,0.65)] to-transparent" />
    <div className="absolute bottom-[20px] left-[20px]">
      <p className="font-mono-dm text-[11px] text-white/65 uppercase tracking-widest">Start Your Journey</p>
      <h2 className="font-display font-bold text-[26px] text-white leading-none mt-1">Where in India are you going?</h2>
      <p className="font-jakarta text-[13px] text-white/75 mt-1.5 max-w-[400px] leading-relaxed">Plan your first safe trip across India.<br/>AI-powered itinerary. Real-time safety. Local guardians.</p>
      <Link to="/trips/new" className="mt-[16px] h-[52px] w-max rounded-[28px] bg-[#E8640C] text-white px-[24px] font-cabinet font-semibold text-[14px] flex items-center gap-1.5 shadow-[0_4px_20px_rgba(232,100,12,0.40)] hover:scale-105 transition-transform">Plan My First AI Trip <ArrowRight size={14} /></Link>
    </div>
    <div className="absolute bottom-[20px] right-[20px] flex items-center gap-1.5">
      <Shield size={18} className="text-white/60" /><span className="font-mono-dm text-[10px] text-white/60">Safety included with every trip</span>
    </div>
  </div>
);

const C2_HowItWorks = () => (
  <div className="mt-[24px]">
    <SectionLabel>Get Started In 3 Steps</SectionLabel>
    <div className="mt-[14px] grid grid-cols-1 md:grid-cols-3 gap-[12px]">
      {[
        { num:'01', title:'Plan your trip', desc:'Enter your destination, budget, and interests. Gemini AI builds your personalized itinerary.', icon:MapPin, color:'#E8640C', bg:'rgba(232,100,12,0.10)' },
        { num:'02', title:'Activate your safety', desc:'Request a verified local guardian. Get real-time alerts for your destination.', icon:Shield, color:'#2D6A4F', bg:'rgba(45,106,79,0.10)' },
        { num:'03', title:'Travel freely', desc:'Discover hidden gems, find local doctors, and explore India with confidence.', icon:Compass, color:'#F0A500', bg:'rgba(240,165,0,0.10)' }
      ].map((step, i) => (
        <div key={i} className="bg-white border border-[#E8D5B7] rounded-[16px] p-[20px] shadow-[0_2px_8px_rgba(30,20,16,0.07)] relative hover:scale-[1.015] hover:border-[#E8640C]/30 transition-all">
          <span className="absolute top-[16px] left-[16px] font-display font-bold text-[36px] text-[#E8D5B7]/30 leading-none pointer-events-none">{step.num}</span>
          <div className="w-[44px] h-[44px] rounded-[10px] flex items-center justify-center relative z-10" style={{ backgroundColor: step.bg }}><step.icon size={22} color={step.color} /></div>
          <h4 className="mt-[10px] font-cabinet font-bold text-[16px] text-[#1E1410] relative z-10">{step.title}</h4>
          <p className="mt-[6px] font-jakarta text-[13px] text-[#6B4F3A] leading-relaxed relative z-10">{step.desc}</p>
        </div>
      ))}
    </div>
    <div className="mt-[16px] w-full bg-[#FEF3E2] border border-[#E8D5B7] rounded-[12px] p-[14px] flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2"><Sparkles size={16} className="text-[#E8640C]" /><span className="font-cabinet font-semibold text-[14px] text-[#1E1410]">Ready to start?</span></div>
      <Link to="/trips/new" className="h-[36px] flex items-center rounded-[100px] bg-[#E8640C] text-white px-[16px] font-cabinet font-semibold text-[13px] hover:scale-105 transition-transform shadow-[0_4px_12px_rgba(232,100,12,0.25)]">Plan My First Trip</Link>
    </div>
  </div>
);

const C3_SafetySnapshot = () => (
  <div className="mt-[28px] w-full bg-[#FEF3E2] border border-[#E8D5B7] rounded-[20px] p-[24px] flex shadow-[0_2px_8px_rgba(30,20,16,0.04)] flex-col sm:flex-row gap-6 sm:gap-0">
    <div className="w-full sm:w-[60%] pr-0 sm:pr-6">
      <SectionLabel>Safety At Your Current Location</SectionLabel>
      <h3 className="font-cabinet font-bold text-[18px] text-[#1E1410] mt-1">Udaipur, Rajasthan</h3>
      <div className="mt-[12px] flex items-end gap-3"><span className="font-mono-dm text-[11px] text-[#6B4F3A] mb-1">Safety Score</span><span className="font-display font-bold text-[28px] text-[#2D6A4F] leading-none">87 / 100</span></div>
      <div className="mt-[8px] w-full h-[6px] bg-[#E8D5B7] rounded-full overflow-hidden"><div className="h-full bg-[#2D6A4F] rounded-full w-[87%]" /></div>
      <div className="mt-[14px] flex flex-col gap-[10px]">
        {[{color:"#4ADE80",name:"Tourist Safety",stat:"Generally Safe"},{color:"#4ADE80",name:"Healthcare Access",stat:"Hospital 1.2 km"},{color:"#F0A500",name:"Crowd Conditions",stat:"Moderate in Old City"}].map((c,i)=>(
          <div key={i} className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-[8px] h-[8px] rounded-full" style={{backgroundColor:c.color}}/><span className="font-cabinet font-semibold text-[13px] text-[#1E1410]">{c.name}</span></div><span className="font-jakarta text-[13px] text-[#6B4F3A]">{c.stat}</span></div>
        ))}
      </div>
      <p className="mt-[12px] font-jakarta text-[12px] text-[#B09880] italic">Start a trip to see destination-specific safety data.</p>
      <Link to="/safety" className="mt-[12px] flex items-center gap-1 group w-max"><span className="font-cabinet font-medium text-[12px] text-[#E8640C]">View Full Safety Report</span><ChevronRight size={12} className="text-[#E8640C] group-hover:translate-x-0.5 transition-transform"/></Link>
    </div>
    <div className="w-full sm:w-[40%] h-[150px] sm:h-auto relative rounded-[12px] overflow-hidden border border-[#E8D5B7]">
      <img src={PHOTOS.mapThumb} alt="Interactive safety map showing Udaipur landmarks" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-[#E8640C] opacity-10 mix-blend-color" />
      <div className="absolute inset-0 flex items-center justify-center"><MapPin size={28} className="text-[#E8640C] drop-shadow-md" fill="currentColor" /></div>
    </div>
  </div>
);



const C5_Trending = () => {
  const trending = [
    { img:PHOTOS.meghalaya, title:"Meghalaya", loc:"Northeast India", tags:["Forest","Offbeat"] },
    { img:PHOTOS.ladakh, title:"Leh-Ladakh", loc:"Jammu & Kashmir", tags:["Mountains","Remote"] },
    { img:PHOTOS.kerala, title:"Alleppey", loc:"Kerala", tags:["Backwaters","Serene"] },
    { img:PHOTOS.chettinad, title:"Chettinad", loc:"Tamil Nadu", tags:["Heritage","Culture"] }
  ];
  return (
    <div className="mt-[28px]">
      <div className="flex justify-between items-center"><SectionLabel>Trending In India</SectionLabel><Link to="/explore" className="flex items-center gap-1 group"><span className="font-cabinet font-medium text-[12px] text-[#E8640C]">See All</span><ChevronRight size={12} className="text-[#E8640C] group-hover:translate-x-0.5 transition-transform"/></Link></div>
      <div className="mt-[14px] flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x">
        {trending.map((t,i) => (
          <div key={i} className="shrink-0 w-[280px] sm:w-[320px] h-[180px] rounded-[16px] overflow-hidden relative shadow-[0_4px_16px_rgba(30,20,16,0.10)] group cursor-pointer hover:scale-[1.015] transition-all snap-center">
            <img src={t.img} alt={t.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-[16px] left-[16px]">
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-white/18 border border-white/30 backdrop-blur-sm font-mono-dm text-[10px] text-white uppercase tracking-wider mb-1">Trending</span>
              <h4 className="font-display font-bold text-[20px] text-white leading-tight mt-1">{t.title}</h4>
              <p className="font-mono-dm text-[11px] text-white/60 mt-0.5">{t.loc}</p>
              <div className="mt-1.5 flex gap-1.5">{t.tags.map((tag,j) => <span key={j} className="px-1.5 py-0.5 rounded bg-white/15 border border-white/30 font-mono-dm text-[10px] text-white backdrop-blur-sm">{tag}</span>)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── RIGHT SIDEBAR ── */
const R1_Doctors = () => (
  <div className="bg-white border border-[#E8D5B7] rounded-[16px] p-[16px] shadow-[0_2px_8px_rgba(30,20,16,0.07)]">
    <div className="flex justify-between items-center"><SectionLabel>Doctors Near You</SectionLabel><Link to="/healthcare" className="font-cabinet font-medium text-[11px] text-[#E8640C]">View All</Link></div>
    <div className="mt-[12px] flex flex-col gap-[10px]">
      {[{img:PHOTOS.doc1,name:'Dr. Kavita Sharma',spec:'General Physician',dist:'0.8 km'},{img:PHOTOS.doc2,name:'Dr. Arjun Reddy',spec:'Emergency Med',dist:'1.4 km'}].map((d,i)=>(
        <React.Fragment key={i}>
          {i>0 && <div className="w-full h-px bg-[#E8D5B7]/50 my-1"/>}
          <div className="flex items-center">
            <img src={d.img} className="w-[44px] h-[44px] rounded-full object-cover border-[1.5px] border-[#E8D5B7] shrink-0" alt={`Verified Doctor: ${d.name}`} loading="lazy" />
            <div className="ml-[12px] flex-1 min-w-0">
              <h4 className="font-cabinet font-semibold text-[14px] text-[#1E1410] truncate">{d.name}</h4>
              <p className="font-jakarta text-[12px] text-[#6B4F3A]">{d.spec}</p>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#2D6A4F]/10 text-[#2D6A4F] font-mono-dm text-[9px] rounded mt-0.5"><CheckCircle2 size={9}/> Verified</span>
            </div>
            <div className="flex flex-col items-end gap-1.5 ml-2">
              <span className="font-mono-dm text-[11px] text-[#E8640C]">{d.dist}</span>
              <Link to="/healthcare" className="w-auto px-3 h-[30px] rounded-[8px] bg-[#E8640C] text-white font-cabinet font-semibold text-[11px] shadow-[0_4px_12px_rgba(232,100,12,0.25)] hover:scale-105 transition-transform flex items-center justify-center whitespace-nowrap">Book Appointment</Link>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
    <Link to="/healthcare" className="mt-[12px] flex items-center gap-1 group w-max"><span className="font-cabinet font-medium text-[12px] text-[#E8640C]">Find More Doctors</span><ChevronRight size={12} className="text-[#E8640C] group-hover:translate-x-0.5 transition-transform"/></Link>
  </div>
);

const R2_TravelProfile = ({ user }) => (
  <div className="mt-[20px] bg-white border border-[#E8D5B7] rounded-[16px] p-[20px] shadow-[0_2px_8px_rgba(30,20,16,0.07)]">
    <div className="flex items-center">
      <div className="w-[56px] h-[56px] rounded-full bg-ivory border-[2px] border-[#E8D5B7] shrink-0 flex items-center justify-center overflow-hidden">
        <span className="font-display font-bold text-[24px] text-[#E8D5B7]">{(user?.fullName || user?.name || 'T')[0]}</span>
      </div>
      <div className="ml-[12px]">
        <h3 className="font-cabinet font-bold text-[16px] text-[#1E1410]">{user?.fullName || user?.name || 'Traveler'}</h3>
        <p className="font-mono-dm text-[11px] text-[#6B4F3A] mt-0.5">Solo Traveler · Udaipur</p>
        <p className="font-jakarta text-[12px] text-[#B09880] mt-0.5 truncate max-w-[180px]">{user?.email}</p>
      </div>
    </div>
    <div className="w-full h-px bg-[#E8D5B7] my-[16px]" />
    <div className="grid grid-cols-2 gap-[10px]">
      {[{val:"0",label:"Trips"},{val:"0",label:"Gems Saved"},{val:"0",label:"Guardians"},{val:"0",label:"Reviews"}].map((s,i) => (
        <div key={i} className="bg-[#FEF3E2] rounded-[12px] p-[12px] text-center"><p className="font-display font-bold text-[22px] text-[#E8D5B7] leading-none">{s.val}</p><p className="font-mono-dm text-[10px] text-[#B09880] uppercase mt-1">{s.label}</p></div>
      ))}
    </div>
    <div className="mt-[14px] bg-[#FEF3E2] border-l-[3px] border-l-[#E8640C] rounded-[10px] p-[12px] flex items-start gap-2">
      <Sparkles size={14} className="text-[#E8640C] shrink-0 mt-0.5" />
      <div><p className="font-jakarta text-[12px] text-[#6B4F3A] leading-snug">Plan your first trip to start building your travel story.</p><Link to="/trips/new" className="mt-2 flex items-center gap-1 group w-max"><span className="font-cabinet font-medium text-[12px] text-[#E8640C]">Plan a Trip</span><ChevronRight size={12} className="text-[#E8640C] group-hover:translate-x-0.5 transition-transform"/></Link></div>
    </div>
  </div>
);

const R3_Notifications = () => (
  <div className="mt-[20px] bg-white border border-[#E8D5B7] rounded-[16px] p-[16px] shadow-[0_2px_8px_rgba(30,20,16,0.07)]">
    <SectionLabel>Notifications</SectionLabel>
    <div className="mt-[16px] flex flex-col items-center text-center py-2">
      <Bell size={24} className="text-[#E8D5B7]" />
      <h3 className="mt-[10px] font-cabinet font-semibold text-[13px] text-[#6B4F3A]">No notifications yet</h3>
      <p className="mt-[6px] font-jakarta text-[12px] text-[#B09880] max-w-[240px] leading-relaxed">Safety alerts, trip updates, and guardian messages will appear here.</p>
    </div>
  </div>
);

export default Home;
