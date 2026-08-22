import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Bell, Calendar, Sun, Shield, Clock, ChevronRight, TrendingUp, HeartPulse, CheckCircle2, Circle, Users, Compass, Sparkles, ArrowRight, Loader2, Trash2 } from 'lucide-react';
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

import { useDispatch } from 'react-redux';
import { fetchTrips, deleteTrip } from '../../store/tripSlice';
import toast from 'react-hot-toast';

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const { trips, loading } = useSelector((state) => state.trip);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

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
      
      <div className="mx-auto max-w-[1200px] px-[16px] md:px-[24px] pt-[12px] pb-[60px] flex flex-col gap-[28px]">
        {/* Banner Image - Slideshow Hero Component */}
        <C1_WelcomeHero />



        {/* Top Regional Selections */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-cabinet font-bold text-[18px] md:text-[22px] text-[#1E1410] tracking-tight">Top Regional Selections</h3>
            <span className="font-mono-dm text-[11px] text-[#B09880]">Popular Spots</span>
          </div>
          <C5_Trending />
        </div>

        {/* Previous Trips Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-cabinet font-bold text-[18px] md:text-[22px] text-[#1E1410] tracking-tight">Previous Trips</h3>
            <span className="font-mono-dm text-[11px] text-[#B09880]">History Log</span>
          </div>
          
          {/* Main Dashboard Layout showing Safety snapshot alongside history */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
            <div className="flex flex-col gap-6">
              {/* Dynamic list of previous trips */}
              <div className="flex flex-col gap-4">
                {loading ? (
                  <div className="flex items-center justify-center p-8 bg-white border border-[#E8D5B7]/40 rounded-[24px]">
                    <Loader2 className="animate-spin text-[#E8640C]" size={24} />
                  </div>
                ) : trips && trips.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trips.map((trip) => (
                      <div 
                        key={trip._id}
                        className="bg-white border border-[#E8D5B7]/40 rounded-[24px] p-5 shadow-[0_4px_20px_rgba(30,20,16,0.03)] hover:shadow-[0_8px_30px_rgba(30,20,16,0.08)] hover:border-[#E8640C]/25 transition-all flex flex-col justify-between h-[160px] relative group"
                      >
                        <Link to={`/trips/${trip._id}`} className="absolute inset-0 z-0 rounded-[24px]" />
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (window.confirm("Are you sure you want to delete this trip?")) {
                              dispatch(deleteTrip(trip._id))
                                .unwrap()
                                .then(() => toast.success("Trip deleted successfully"))
                                .catch((err) => toast.error(err || "Failed to delete trip"));
                            }
                          }}
                          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white border border-[#E8D5B7]/60 flex items-center justify-center text-[#B09880] hover:text-[#C0392B] hover:border-[#C0392B]/50 transition-colors shadow-sm"
                          title="Delete Trip"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="z-0 relative pointer-events-none">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#FFF8F0] border border-[#E8D5B7]/30 font-mono-dm text-[8px] text-[#E8640C] uppercase tracking-wider mb-2">
                            {trip.duration} Days
                          </span>
                          <h4 className="font-cabinet font-bold text-[16px] text-[#1E1410] truncate group-hover:text-[#E8640C] transition-colors">
                            {trip.tripTitle || trip.location}
                          </h4>
                          <p className="font-jakarta text-[12px] text-[#6B4F3A] mt-1 truncate flex items-center gap-1">
                            <MapPin size={12} className="text-[#E8640C]" />
                            <span>{trip.location} · {trip.budget}</span>
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#FFF8F0] z-0 relative pointer-events-none">
                          <span className="font-mono-dm text-[10px] text-[#B09880]">Saved Details</span>
                          <ChevronRight size={14} className="text-[#B09880] group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-[#E8D5B7]/40 rounded-[24px] p-8 text-center shadow-[0_4px_24px_rgba(30,20,16,0.03)]">
                    <p className="font-jakarta text-[13px] text-[#6B4F3A]">No previous trips found. Plan your first adventure!</p>
                  </div>
                )}
              </div>
              
              <C3_SafetySnapshot />
              <C2_HowItWorks />
            </div>
            
            {/* Sidebar Controls */}
            <div className="flex flex-col gap-6 lg:sticky lg:top-[104px]">
              <R1_Doctors />
              <R3_Notifications />
            </div>
          </div>
        </div>
        
        {/* Floating Action Button to plan trip */}
        <div className="fixed bottom-6 right-6 z-40">
          <Link
            to="/trips/new"
            className="flex items-center gap-2 bg-[#E8640C] text-white px-6 py-4 rounded-full font-cabinet font-bold text-[15px] shadow-[0_10px_30px_rgba(232,100,12,0.4)] hover:scale-105 transition-transform"
          >
            <span>+ Plan a trip</span>
          </Link>
        </div>
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
const C1_WelcomeHero = () => {
  const slideshowImages = [
    { url: PHOTOS.jaisalmer, title: "Jaisalmer Fort, Rajasthan", vibe: "Desert Romance" },
    { url: PHOTOS.varanasi, title: "Ganga Ghats, Varanasi", vibe: "Spiritual Awakening" },
    { url: PHOTOS.meghalaya, title: "Double Decker Bridge, Meghalaya", vibe: "Nature Trails" },
    { url: PHOTOS.ladakh, title: "Pangong Lake, Ladakh", vibe: "Adventure Peak" },
    { url: PHOTOS.kerala, title: "Munnar Tea Estates, Kerala", vibe: "Serene Backwaters" }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slideshowImages.length);
    }, 4500); // Slide every 4.5 seconds for a cinematic feel
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-[420px] rounded-[28px] overflow-hidden relative shadow-[0_20px_50px_rgba(30,20,16,0.18)] group bg-[#140C08]">
      {/* Dynamic Background Slideshow with Cross-Fade Effect */}
      {slideshowImages.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === activeIndex ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <img
            src={slide.url}
            alt={slide.title}
            className={`absolute inset-0 w-full h-full object-cover transform transition-transform duration-[4500ms] ease-out ${
              idx === activeIndex ? "scale-105" : "scale-100"
            }`}
          />
          {/* Subtle overlay helper for readability */}
          <div className="absolute top-[24px] left-[24px] bg-black/30 backdrop-blur-md rounded-full px-[14px] py-[6px] border border-white/10 shadow-sm z-25 flex items-center gap-1.5">
            <MapPin size={12} className="text-[#F0A500]" />
            <span className="font-mono-dm text-[10px] font-bold text-[#FEF3E2] uppercase tracking-wider">
              {slide.title}
            </span>
          </div>
        </div>
      ))}

      {/* Premium Cinematic Ambient Bright-Contrast Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,12,8,0.75)] via-[rgba(20,12,8,0.25)] to-transparent" />

      {/* Hero Content */}
      <div className="absolute inset-x-0 bottom-0 p-[32px] md:p-[40px] flex flex-col justify-end h-full z-20">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#E8640C] animate-ping" />
          <p className="font-mono-dm text-[11px] text-[#F0A500] uppercase tracking-[3px] font-bold">
            Start Your Journey
          </p>
        </div>
        <h2 className="font-display font-bold text-[32px] md:text-[42px] text-white leading-tight max-w-[650px] drop-shadow-md">
          Where in India are you going?
        </h2>
        <p className="font-jakarta text-[14px] text-white/85 mt-2 max-w-[550px] leading-relaxed drop-shadow-md">
          Plan your first safe trip across India. Fully customized AI-powered day itineraries enriched with verified safety scores and local helper networks.
        </p>
        
        <div className="mt-[28px] flex items-center gap-[20px] flex-wrap">
          <Link
            to="/trips/new"
            className="h-[52px] rounded-full bg-[#E8640C] hover:bg-[#F0731E] text-white px-[32px] font-cabinet font-bold text-[15px] flex items-center gap-2.5 shadow-[0_8px_30px_rgba(232,100,12,0.45)] hover:scale-105 transition-all duration-300"
          >
            Plan My First AI Trip <ArrowRight size={16} />
          </Link>
          
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
            <Shield size={16} className="text-[#4ADE80]" />
            <span className="font-mono-dm text-[11px] text-white/90">
              Emergency SOS & Guardians Active
            </span>
          </div>
        </div>
      </div>

      {/* Slideshow Indicators */}
      <div className="absolute bottom-[32px] right-[40px] flex items-center gap-2 z-20">
        {slideshowImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-[6px] rounded-full transition-all duration-300 ${
              idx === activeIndex ? "w-[32px] bg-[#E8640C]" : "w-[8px] bg-white/40 hover:bg-white/85"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const C2_HowItWorks = () => (
  <div className="mt-[32px]">
    <div className="flex items-center justify-between mb-4">
      <SectionLabel>Your Travel Journey</SectionLabel>
      <span className="text-[11px] font-mono-dm text-[#B09880]">Guided Steps</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
      {[
        { num:'01', title:'Custom AI Itinerary', desc:'Provide destination and interests. Our system crafts details powered by Gemini.', icon:MapPin, color:'#E8640C', bg:'#FFF3EB' },
        { num:'02', title:'Verified Safety Net', desc:'Instant access to verified local guardians and automatic SOS alerting features.', icon:Shield, color:'#2D6A4F', bg:'#EBF5EE' },
        { num:'03', title:'Explore Safely', desc:'Access verified medical care, explore offbeat gems, and navigate with confidence.', icon:Compass, color:'#F0A500', bg:'#FFFBEB' }
      ].map((step, i) => (
        <div key={i} className="bg-white border border-[#E8D5B7]/40 rounded-[20px] p-[24px] shadow-[0_4px_20px_rgba(30,20,16,0.03)] relative transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,20,16,0.06)] hover:border-[#E8640C]/20 group">
          <span className="absolute top-[20px] right-[24px] font-display font-bold text-[28px] text-[#E8D5B7]/40 leading-none group-hover:text-[#E8640C]/20 transition-colors">{step.num}</span>
          <div className="w-[50px] h-[50px] rounded-[14px] flex items-center justify-center transition-transform duration-300 group-hover:scale-105" style={{ backgroundColor: step.bg }}><step.icon size={22} color={step.color} /></div>
          <h4 className="mt-[16px] font-cabinet font-bold text-[16px] text-[#1E1410]">{step.title}</h4>
          <p className="mt-[8px] font-jakarta text-[13px] text-[#6B4F3A] leading-relaxed">{step.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const C3_SafetySnapshot = () => (
  <div className="mt-[32px] w-full bg-[#FFFFFF] border border-[#E8D5B7]/40 rounded-[24px] p-[28px] flex shadow-[0_4px_24px_rgba(30,20,16,0.03)] flex-col sm:flex-row gap-8">
    <div className="w-full sm:w-[55%] flex flex-col justify-between">
      <div>
        <SectionLabel>Live Location Security</SectionLabel>
        <h3 className="font-cabinet font-bold text-[22px] text-[#1E1410] mt-1">Udaipur, Rajasthan</h3>
        
        <div className="mt-[16px] flex items-baseline gap-2">
          <span className="font-display font-bold text-[36px] text-[#2D6A4F] leading-none">87</span>
          <span className="font-mono-dm text-[14px] text-[#B09880]">/ 100 Safety Score</span>
        </div>
        <div className="mt-[12px] w-full h-[6px] bg-[#E8D5B7]/30 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#4ADE80] to-[#2D6A4F] rounded-full w-[87%]" />
        </div>

        <div className="mt-[20px] flex flex-col gap-[12px]">
          {[
            {color:"#2D6A4F",name:"Tourist Safety Rating",stat:"High (Safe)"},
            {color:"#2D6A4F",name:"Healthcare Facilities",stat:"Hospital 1.2 km"},
            {color:"#F0A500",name:"Peak Hour Crowds",stat:"Moderate"}
          ].map((c,i)=>(
            <div key={i} className="flex items-center justify-between text-[13px]">
              <div className="flex items-center gap-2">
                <span className="w-[8px] h-[8px] rounded-full" style={{backgroundColor:c.color}}/>
                <span className="font-cabinet font-medium text-[#1E1410]">{c.name}</span>
              </div>
              <span className="font-jakarta text-[#6B4F3A] font-medium">{c.stat}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-[24px] pt-4 border-t border-[#E8D5B7]/30">
        <Link to="/safety" className="flex items-center gap-1 group text-[#E8640C] font-cabinet font-bold text-[13px]">
          <span>View Safety Analytics & Reports</span>
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/>
        </Link>
      </div>
    </div>
    
    <div className="w-full sm:w-[45%] h-[200px] sm:h-auto relative rounded-[20px] overflow-hidden border border-[#E8D5B7]/40 shadow-inner group">
      <img src={PHOTOS.mapThumb} alt="Interactive safety map showing Udaipur landmarks" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-[#E8640C]/5" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[50px] h-[50px] rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
          <MapPin size={22} className="text-[#E8640C]" fill="currentColor" />
        </div>
      </div>
    </div>
  </div>
);



const C5_Trending = () => {
  const trending = [
    { img: PHOTOS.meghalaya, title: "Meghalaya Valley", loc: "Northeast India", tags: ["Forests", "Bridges"] },
    { img: PHOTOS.ladakh, title: "Leh-Ladakh Heights", loc: "Himalayan Range", tags: ["Peaks", "Cold Desert"] },
    { img: PHOTOS.kerala, title: "Alleppey Backwaters", loc: "Kerala Coast", tags: ["Houseboats", "Lakes"] },
    { img: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80", title: "Junagadh Girnar", loc: "Gujarat Hills", tags: ["Temples", "Forest"] },
    { img: PHOTOS.jaisalmer, title: "Jaisalmer Fort", loc: "Rajasthan Desert", tags: ["Dunes", "Culture"] },
    { img: PHOTOS.varanasi, title: "Varanasi Ghats", loc: "Uttar Pradesh", tags: ["Spiritual", "Ganga"] },
    { img: PHOTOS.ranakpur, title: "Ranakpur Temples", loc: "Rajasthan Forest", tags: ["Carvings", "Peace"] },
    { img: PHOTOS.kumbhalgarh, title: "Kumbhalgarh Wall", loc: "Mewar Kingdom", tags: ["Fortress", "History"] },
    { img: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80", title: "Bundi stepwells", loc: "Rajasthan Oasis", tags: ["Architecture", "Heritage"] },
    { img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80", title: "Chettinad Mansions", loc: "Tamil Nadu Coast", tags: ["Palaces", "Feasts"] }
  ];

  const carouselRef = React.useRef(null);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let scrollAmt = 0;
    const interval = setInterval(() => {
      if (el.scrollWidth - el.clientWidth <= el.scrollLeft + 10) {
        scrollAmt = 0;
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollAmt += 320;
        el.scrollTo({ left: scrollAmt, behavior: 'smooth' });
      }
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-[32px]">
      <div className="flex justify-between items-center mb-4">
        <SectionLabel>Top 10 Indian Journeys</SectionLabel>
        <Link to="/explore" className="flex items-center gap-1 group text-[#E8640C] font-cabinet font-bold text-[13px]">
          <span>Explore All</span>
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/>
        </Link>
      </div>
      
      {/* Container with hidden scrollbars and snapping logic */}
      <div 
        ref={carouselRef}
        className="flex gap-[48px] overflow-x-auto overflow-y-hidden pb-6 pt-4 scroll-smooth snap-x select-none pl-12"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {trending.map((t, i) => (
          <div key={i} className="shrink-0 relative snap-center flex items-end h-[240px]">
            {/* Netflix-style giant background number */}
            <span 
              className="absolute left-[-42px] bottom-[-15px] font-cabinet font-extrabold text-[120px] leading-none select-none pointer-events-none text-transparent z-10 transition-all duration-300 group-hover:scale-105"
              style={{
                WebkitTextStroke: '2px rgba(232, 100, 12, 0.45)',
                fontFamily: 'Cabinet Grotesk, sans-serif'
              }}
            >
              {i + 1}
            </span>

            {/* Travel Card */}
            <div className="w-[280px] sm:w-[310px] h-[210px] rounded-[24px] overflow-hidden relative shadow-[0_8px_24px_rgba(30,20,16,0.06)] group cursor-pointer transition-all duration-300 hover:shadow-[0_16px_36px_rgba(30,20,16,0.12)] border border-[#E8D5B7]/25 z-20">
              <img src={t.img || t.url} alt={t.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              <div className="absolute bottom-[20px] left-[20px] right-[20px]">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/20 border border-white/10 backdrop-blur-md font-mono-dm text-[8px] text-white uppercase tracking-wider mb-1">Ranked #{i+1}</span>
                <h4 className="font-display font-bold text-[19px] text-white leading-tight mt-1">{t.title}</h4>
                <p className="font-mono-dm text-[11px] text-white/70 mt-0.5">{t.loc}</p>
                <div className="mt-2.5 flex gap-1.5 flex-wrap">
                  {t.tags.map((tag, j) => (
                    <span key={j} className="px-2 py-0.5 rounded-full bg-white/10 border border-white/5 font-mono-dm text-[9px] text-white backdrop-blur-md">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── RIGHT SIDEBAR ── */
const R1_Doctors = () => (
  <div className="bg-white border border-[#E8D5B7]/40 rounded-[24px] p-[20px] shadow-[0_4px_24px_rgba(30,20,16,0.03)] w-full">
    <div className="flex justify-between items-center mb-4">
      <SectionLabel>Verified Medical Care</SectionLabel>
      <Link to="/healthcare" className="font-cabinet font-bold text-[11px] text-[#E8640C] hover:underline">View Map</Link>
    </div>
    <div className="flex flex-col gap-[16px]">
      {[
        {img:PHOTOS.doc1,name:'Dr. Kavita Sharma',spec:'General Physician',dist:'0.8 km'},
        {img:PHOTOS.doc2,name:'Dr. Arjun Reddy',spec:'Emergency Response',dist:'1.4 km'}
      ].map((d,i)=>(
        <div key={i} className="flex items-center justify-between gap-2 p-2 rounded-[16px] hover:bg-[#FFF8F0] transition-colors duration-300">
          <div className="flex items-center gap-3">
            <img src={d.img} className="w-[48px] h-[48px] rounded-full object-cover border border-[#E8D5B7] shrink-0 shadow-sm" alt={d.name} />
            <div className="min-w-0">
              <h4 className="font-cabinet font-bold text-[13px] text-[#1E1410] leading-tight truncate">{d.name}</h4>
              <p className="font-jakarta text-[12px] text-[#6B4F3A] mt-0.5 truncate">{d.spec}</p>
              <span className="inline-flex items-center gap-1 text-[#2D6A4F] font-cabinet text-[10px] font-bold mt-1 bg-[#2D6A4F]/10 px-2 py-0.5 rounded-full">
                <CheckCircle2 size={10} className="text-[#2D6A4F]" /> Verified
              </span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <span className="font-mono-dm text-[10px] text-[#B09880]">{d.dist}</span>
            <Link to="/healthcare" className="px-3 py-1 bg-[#E8640C] text-white font-cabinet font-bold text-[10px] rounded-full hover:bg-[#F0731E] transition-colors shadow-sm">Book</Link>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const R2_TravelProfile = ({ user }) => (
  <div className="mt-[20px] bg-white border border-[#E8D5B7]/40 rounded-[24px] p-[24px] shadow-[0_4px_24px_rgba(30,20,16,0.03)] w-full">
    <div className="flex items-center gap-3">
      <div className="w-[60px] h-[60px] rounded-full bg-[#FFF8F0] border-2 border-[#E8D5B7] shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
        <span className="font-display font-bold text-[26px] text-[#E8640C]">{(user?.fullName || user?.name || 'T')[0]}</span>
      </div>
      <div className="min-w-0">
        <h3 className="font-cabinet font-bold text-[16px] text-[#1E1410] truncate">{user?.fullName || user?.name || 'Traveler'}</h3>
        <p className="font-mono-dm text-[11px] text-[#6B4F3A] mt-0.5">Verified Solo Traveler</p>
        <p className="font-jakarta text-[11px] text-[#B09880] mt-0.5 truncate">{user?.email}</p>
      </div>
    </div>
    <div className="w-full h-px bg-[#E8D5B7]/30 my-[20px]" />
    <div className="grid grid-cols-2 gap-[12px]">
      {[
        {val:"0",label:"Trips Started"},
        {val:"0",label:"Saved Spots"},
        {val:"0",label:"Guardians"},
        {val:"0",label:"Total Reviews"}
      ].map((s,i) => (
        <div key={i} className="bg-[#FFF8F0] rounded-[16px] p-[12px] text-center border border-[#E8D5B7]/20">
          <p className="font-display font-bold text-[22px] text-[#E8640C] leading-none">{s.val}</p>
          <p className="font-mono-dm text-[9px] text-[#B09880] uppercase mt-1 tracking-wider">{s.label}</p>
        </div>
      ))}
    </div>
  </div>
);

const R3_Notifications = () => (
  <div className="mt-[20px] bg-white border border-[#E8D5B7]/40 rounded-[24px] p-[20px] shadow-[0_4px_24px_rgba(30,20,16,0.03)] w-full">
    <SectionLabel>Live Alert Center</SectionLabel>
    <div className="mt-[16px] flex flex-col items-center text-center py-4">
      <div className="w-[44px] h-[44px] rounded-full bg-[#FFF8F0] flex items-center justify-center mb-3">
        <Bell size={20} className="text-[#B09880]" />
      </div>
      <h3 className="font-cabinet font-bold text-[13px] text-[#1E1410]">All Quiet for Now</h3>
      <p className="mt-[6px] font-jakarta text-[12px] text-[#B09880] max-w-[200px]">Real-time safety signals and chat messages will populate here.</p>
    </div>
  </div>
);

export default Home;
