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
  <p className="font-mono-dm text-[10px] uppercase tracking-[2px] text-[#627D98] font-bold mb-[2px]">{children}</p>
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
    <div className="min-h-screen bg-[#F7FAFC] relative font-jakarta">
      <Helmet>
        <title>Dashboard | My Itinerary - AI Travel & Healthcare</title>
        <meta
          name="description"
          content="Welcome to your My Itinerary dashboard. Plan your next AI-powered trip, check local safety scores, and access healthcare services near you."
        />
        <link rel="canonical" href="https://myitinerary.com/" />
      </Helmet>

      <TopAppBar variant="logo" />
      
      <div className="mx-auto max-w-[1200px] px-[16px] md:px-[24px] pt-[12px] pb-[60px] flex flex-col gap-[28px]">
        {/* Banner Image - Slideshow Hero Component */}
        <div className="animate-fade-up">
          <C1_WelcomeHero />
        </div>

        {/* Top Regional Selections */}
        <div className="animate-fade-up-d1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-cabinet font-bold text-[18px] md:text-[22px] text-[#102A43] tracking-tight">Top Regional Selections</h3>
            <span className="font-mono-dm text-[11px] text-[#627D98]">Popular Spots</span>
          </div>
          <C5_Trending />
        </div>

        {/* Previous Trips Section */}
        <div className="animate-fade-up-d2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-cabinet font-bold text-[18px] md:text-[22px] text-[#102A43] tracking-tight">Previous Trips</h3>
            <span className="font-mono-dm text-[11px] text-[#627D98]">History Log</span>
          </div>
          
          {/* Main Dashboard Layout showing Safety snapshot alongside history */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
            <div className="flex flex-col gap-6">
              {/* Dynamic list of previous trips */}
              <div className="flex flex-col gap-4">
                {loading ? (
                  <div className="flex items-center justify-center p-8 bg-white/70 backdrop-blur-md border border-slate-100 rounded-[24px]">
                    <Loader2 className="animate-spin text-[#2A9D8F]" size={24} />
                  </div>
                ) : trips && trips.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trips.map((trip) => (
                      <div 
                        key={trip._id}
                        className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-[24px] p-5 shadow-[0_8px_30px_rgb(240,244,248,0.5)] hover:shadow-[0_12px_36px_rgba(42,157,143,0.08)] hover:border-[#2A9D8F]/25 transition-all duration-300 flex flex-col justify-between h-[160px] relative group"
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
                          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 flex items-center justify-center text-[#627D98] hover:text-[#C0392B] hover:border-[#C0392B]/50 transition-colors shadow-sm"
                          title="Delete Trip"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="z-0 relative pointer-events-none">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#FFE1D2] border border-[#F4A261]/20 font-mono-dm text-[8px] text-[#E8640C] uppercase tracking-wider mb-2">
                            {trip.duration} Days
                          </span>
                          <h4 className="font-cabinet font-bold text-[16px] text-[#102A43] truncate group-hover:text-[#2A9D8F] transition-colors">
                            {trip.tripTitle || trip.location}
                          </h4>
                          <p className="font-jakarta text-[12px] text-[#627D98] mt-1 truncate flex items-center gap-1">
                            <MapPin size={12} className="text-[#2A9D8F]" />
                            <span>{trip.location} · {trip.budget}</span>
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 z-0 relative pointer-events-none">
                          <span className="font-mono-dm text-[10px] text-[#627D98]">Saved Details</span>
                          <ChevronRight size={14} className="text-[#627D98] group-hover:translate-x-1 group-hover:text-[#2A9D8F] transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-[24px] p-8 text-center shadow-[0_8px_30px_rgb(240,244,248,0.5)]">
                    <p className="font-jakarta text-[13px] text-[#627D98]">No previous trips found. Plan your first adventure!</p>
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
        <div className="fixed bottom-24 right-6 z-40">
          <Link
            to="/trips/new"
            className="flex items-center gap-2 bg-gradient-to-r from-[#2A9D8F] to-[#72D6C4] text-white px-6 py-4 rounded-full font-cabinet font-bold text-[15px] shadow-[0_10px_30px_rgba(42,157,143,0.35)] hover:shadow-[0_14px_40px_rgba(42,157,143,0.45)] hover:scale-105 transition-all duration-300"
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
      <p className="font-jakarta text-[14px] text-[#627D98]">{getGreeting()}</p>
      <h1 className="font-display font-bold text-[32px] text-[#102A43] leading-none mt-1">{firstName}</h1>
      <div className="mt-[12px] flex items-center gap-2">
        <span className="flex items-center gap-1.5 font-mono-dm text-[11px] text-[#243B53]">
          <MapPin size={13} className={loading ? "animate-pulse text-[#627D98]" : "text-[#2A9D8F]"} /> 
          {loading ? "Detecting location..." : `${userLocation.city}, ${userLocation.region}`}
        </span>
        <span className="w-px h-[10px] bg-slate-200" />
        <span className="flex items-center gap-1.5 font-mono-dm text-[11px] text-[#627D98]">
          <Calendar size={13} /> {formattedDate}
        </span>
      </div>
      <div className="mt-[16px] flex items-center gap-1.5">
        <Sun size={18} className={loading ? "animate-spin text-slate-300" : "text-[#F4A261]"} fill="currentColor" />
        <span className="font-cabinet font-medium text-[14px] text-[#243B53]">
          {loading ? "--°C" : `${weather.temp}°C · ${weather.condition}`}
        </span>
      </div>
    </div>
  );
};

const L2_SafetyCard = () => (
  <div className="w-full bg-white/70 backdrop-blur-md rounded-[20px] p-[20px] border-[1.5px] border-[#2A9D8F]/25 shadow-[0_8px_30px_rgb(240,244,248,0.5)] border-l-[4px] border-l-[#2A9D8F] relative">
    <div className="flex justify-between items-center">
      <p className="font-mono-dm text-[10px] text-[#627D98] uppercase tracking-[2px]">Your Safety Status</p>
      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#F4A261]" /><span className="font-cabinet font-semibold text-[11px] text-[#F4A261]">Setup Needed</span></div>
    </div>
    <div className="mt-[16px] flex items-center gap-3">
      <Shield size={32} className="text-[#2A9D8F] shrink-0" strokeWidth={1.5} />
      <div><h3 className="font-display font-bold text-[18px] text-[#102A43] leading-tight">Safety Incomplete</h3><p className="font-jakarta text-[12px] text-[#627D98] mt-0.5">Complete setup to activate protection</p></div>
    </div>
    <div className="mt-[14px] w-full h-px bg-slate-100" />
    <div className="mt-[14px] flex flex-col gap-3">
      {[{done:true,text:'Location access enabled'},{done:true,text:'Emergency contact saved'},{done:false,text:'Request your first guardian'}].map((r,i)=>(
        <div key={i} className="flex items-center justify-between">
          <div className="flex items-center gap-2">{r.done ? <CheckCircle2 size={16} className="text-[#52B788]" fill="#52B788" color="white"/> : <Circle size={16} className="text-slate-300"/>}<span className={`font-jakarta text-[13px] ${r.done?'text-[#102A43]':'text-[#627D98]'}`}>{r.text}</span></div>
          <span className={`font-mono-dm text-[10px] ${r.done?'text-[#52B788]':'text-[#627D98]'}`}>{r.done?'Done':'Pending'}</span>
        </div>))}
    </div>
    <Link to="/safety" className="mt-[14px] w-full h-[40px] rounded-[10px] bg-gradient-to-r from-[#2A9D8F] to-[#72D6C4] text-white font-cabinet font-semibold text-[13px] flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(42,157,143,0.25)] hover:shadow-[0_6px_20px_rgba(42,157,143,0.35)] transition-shadow"><Shield size={14} fill="white" /> Activate Full Safety</Link>
    <p className="mt-[8px] font-jakarta text-[11px] text-[#627D98] text-center">Takes less than 2 minutes.</p>
  </div>
);

const L3_GuardianNetwork = () => (
  <div className="mt-[20px] bg-white/70 backdrop-blur-md border border-slate-100 rounded-[16px] p-[16px] shadow-[0_8px_30px_rgb(240,244,248,0.5)]">
    <SectionLabel>Guardian Network</SectionLabel>
    <div className="mt-[16px] flex flex-col items-center text-center">
      <Users size={32} className="text-slate-300" />
      <h3 className="mt-[10px] font-cabinet font-semibold text-[13px] text-[#243B53]">No guardians assigned yet</h3>
      <p className="mt-[6px] font-jakarta text-[12px] text-[#627D98] leading-relaxed max-w-[220px]">Guardians are local verified residents who assist you when you need help.</p>
    </div>
    <div className="mt-[12px] flex flex-col items-center gap-2 w-full">
      <div className="flex justify-center gap-2 flex-wrap w-full">
        <div className="h-[28px] bg-[#72D6C4]/10 border border-[#72D6C4]/20 rounded-[100px] px-[10px] flex items-center gap-1.5 whitespace-nowrap"><Clock size={12} className="text-[#52B788] shrink-0" /><span className="font-jakarta text-[11px] text-[#243B53]">Avg. 4 min response</span></div>
        <div className="h-[28px] bg-[#FFE1D2]/40 border border-[#F4A261]/20 rounded-[100px] px-[10px] flex items-center gap-1.5 whitespace-nowrap"><Users size={12} className="text-[#C0392B] shrink-0" /><span className="font-jakarta text-[11px] text-[#243B53]">14 women guardians</span></div>
      </div>
    </div>
    <Link to="/safety/guardians" className="mt-[16px] w-full h-[40px] rounded-[10px] bg-white border-[1.5px] border-[#2A9D8F] text-[#2A9D8F] font-cabinet font-semibold text-[13px] hover:bg-[#2A9D8F] hover:text-white transition-colors flex items-center justify-center">Find a Guardian</Link>
  </div>
);

const L4_RecentAlerts = () => (
  <div className="mt-[20px] bg-[#72D6C4]/5 border border-[#72D6C4]/15 rounded-[12px] p-[14px]">
    <SectionLabel>Recent Alerts</SectionLabel>
    <div className="mt-[10px] flex flex-col items-center text-center py-2">
      <Bell size={20} className="text-slate-300" />
      <h3 className="mt-[8px] font-cabinet font-medium text-[13px] text-[#243B53]">No alerts yet</h3>
      <p className="mt-[4px] font-jakarta text-[12px] text-[#627D98]">Safety alerts for your location will appear here.</p>
    </div>
  </div>
);

/* ── CENTER COLUMN ── */
const C1_WelcomeHero = () => {
  const slideshowImages = [
    { url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80", title: "Taj Mahal, Agra", vibe: "Heritage Wonder" },
    { url: "https://images.unsplash.com/photo-1593693397690-362cb9666c6b?auto=format&fit=crop&w=1600&q=80", title: "Alleppey Backwaters, Kerala", vibe: "Tropical Serenity" },
    { url: "https://images.unsplash.com/photo-1477587458883-47135fb640e5?auto=format&fit=crop&w=1600&q=80", title: "Amer Fort, Jaipur", vibe: "Royal Majesty" },
    { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80", title: "Himalayas, Ladakh", vibe: "Mountain Adventure" },
    { url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1600&q=80", title: "Ganga Aarti, Varanasi", vibe: "Spiritual Light" }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slideshowImages.length);
    }, 4500); // Slide every 4.5 seconds for a cinematic feel
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-[320px] sm:h-[360px] rounded-[24px] overflow-hidden relative shadow-[0_16px_36px_rgba(16,42,67,0.12)] group bg-[#102A43]">
      {/* JioHotstar-style horizontal sliding layout */}
      <div 
        className="absolute inset-0 flex transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateX(-${activeIndex * 100}%)`, width: `${slideshowImages.length * 100}%` }}
      >
        {slideshowImages.map((slide, idx) => (
          <div key={idx} className="relative w-full h-full shrink-0">
            <img
              src={slide.url}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover transform scale-100 group-hover:scale-[1.01] transition-transform duration-[6000ms] ease-out"
            />
            {/* Subtle destination badge */}
            <div className="absolute top-[20px] left-[20px] bg-black/45 backdrop-blur-md rounded-full px-[12px] py-[5px] border border-white/15 shadow-md z-25 flex items-center gap-2">
              <MapPin size={11} className="text-[#72D6C4]" />
              <span className="font-mono-dm text-[9.5px] font-bold text-white uppercase tracking-wider">
                {slide.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modern gradient overlay shading for content contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(16,42,67,0.88)] via-[rgba(16,42,67,0.3)] to-transparent pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(16,42,67,0.35)] via-transparent to-transparent pointer-events-none z-10" />

      {/* Hero Content (Overlaid above the slider track) */}
      <div className="absolute inset-x-4 bottom-4 md:inset-x-6 md:bottom-6 z-20 pointer-events-none">
        <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-[20px] p-5 md:p-6 pointer-events-auto max-w-[680px] shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#72D6C4] animate-pulse" />
            <p className="font-mono-dm text-[9.5px] text-white/95 uppercase tracking-[3px] font-extrabold">
              Discover. Plan. Travel.
            </p>
          </div>
          <h2 className="font-display font-extrabold text-[24px] md:text-[34px] text-white leading-[1.15] drop-shadow-md">
            Where in India are <span className="text-[#72D6C4]">you</span> going?
          </h2>
          <p className="font-jakarta text-[12px] md:text-[13px] text-white/85 mt-2 max-w-[560px] leading-relaxed drop-shadow-sm font-light">
            Plan personalized, safe, and memorable journeys across India. Fully customized AI-powered day itineraries enriched with verified safety scores and local helper networks.
          </p>
          
          <div className="mt-[20px] flex items-center gap-[16px] flex-wrap">
            <Link
              to="/trips/new"
              className="h-[44px] rounded-full bg-gradient-to-r from-[#2A9D8F] to-[#72D6C4] hover:from-[#227C70] hover:to-[#5CC4B0] text-white px-[24px] font-cabinet font-bold text-[13.5px] flex items-center gap-2 shadow-[0_8px_24px_rgba(42,157,143,0.4)] hover:scale-105 transition-all duration-300 pointer-events-auto"
            >
              Plan My Trip <ArrowRight size={15} />
            </Link>
            
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-4 py-2">
              <Shield size={14} className="text-[#52B788]" />
              <span className="font-mono-dm text-[10px] text-white font-medium">
                Emergency SOS & Guardians Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* JioHotstar-style indicator indicators on bottom-right */}
      <div className="absolute bottom-[24px] right-[32px] flex items-center gap-2 z-20">
        {slideshowImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-[5px] rounded-full transition-all duration-500 ${
              idx === activeIndex 
                ? "w-[30px] bg-[#72D6C4] shadow-[0_0_8px_rgba(114,214,196,0.6)]" 
                : "w-[8px] bg-white/30 hover:bg-white/70"
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
      <span className="text-[11px] font-mono-dm text-[#627D98]">Guided Steps</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
      {[
        { num:'01', title:'Custom AI Itinerary', desc:'Provide destination and interests. Our system crafts details powered by Gemini.', icon:MapPin, color:'#2A9D8F', bg:'#72D6C4' },
        { num:'02', title:'Verified Safety Net', desc:'Instant access to verified local guardians and automatic SOS alerting features.', icon:Shield, color:'#52B788', bg:'#52B788' },
        { num:'03', title:'Explore Safely', desc:'Access verified medical care, explore offbeat gems, and navigate with confidence.', icon:Compass, color:'#F4A261', bg:'#F4A261' }
      ].map((step, i) => (
        <div key={i} className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-[20px] p-[24px] shadow-[0_8px_30px_rgb(240,244,248,0.5)] relative transition-all duration-300 hover:shadow-[0_12px_36px_rgba(42,157,143,0.08)] hover:border-[#2A9D8F]/20 group">
          <span className="absolute top-[20px] right-[24px] font-display font-bold text-[28px] text-slate-200/50 leading-none group-hover:text-[#2A9D8F]/15 transition-colors">{step.num}</span>
          <div className="w-[50px] h-[50px] rounded-[14px] flex items-center justify-center transition-transform duration-300 group-hover:scale-105" style={{ backgroundColor: `${step.bg}15` }}><step.icon size={22} color={step.color} /></div>
          <h4 className="mt-[16px] font-cabinet font-bold text-[16px] text-[#102A43]">{step.title}</h4>
          <p className="mt-[8px] font-jakarta text-[13px] text-[#627D98] leading-relaxed">{step.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const C3_SafetySnapshot = () => (
  <div className="mt-[32px] w-full bg-white/70 backdrop-blur-md border border-slate-100 rounded-[24px] p-[28px] flex shadow-[0_8px_30px_rgb(240,244,248,0.5)] flex-col sm:flex-row gap-8">
    <div className="w-full sm:w-[55%] flex flex-col justify-between">
      <div>
        <SectionLabel>Live Location Security</SectionLabel>
        <h3 className="font-cabinet font-bold text-[22px] text-[#102A43] mt-1">Udaipur, Rajasthan</h3>
        
        <div className="mt-[16px] flex items-baseline gap-2">
          <span className="font-display font-bold text-[36px] text-[#52B788] leading-none">87</span>
          <span className="font-mono-dm text-[14px] text-[#627D98]">/ 100 Safety Score</span>
        </div>
        <div className="mt-[12px] w-full h-[6px] bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#52B788] to-[#2A9D8F] rounded-full w-[87%]" />
        </div>

        <div className="mt-[20px] flex flex-col gap-[12px]">
          {[
            {color:"#52B788",name:"Tourist Safety Rating",stat:"High (Safe)"},
            {color:"#2A9D8F",name:"Healthcare Facilities",stat:"Hospital 1.2 km"},
            {color:"#F4A261",name:"Peak Hour Crowds",stat:"Moderate"}
          ].map((c,i)=>(
            <div key={i} className="flex items-center justify-between text-[13px]">
              <div className="flex items-center gap-2">
                <span className="w-[8px] h-[8px] rounded-full" style={{backgroundColor:c.color}}/>
                <span className="font-cabinet font-medium text-[#102A43]">{c.name}</span>
              </div>
              <span className="font-jakarta text-[#627D98] font-medium">{c.stat}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-[24px] pt-4 border-t border-slate-100">
        <Link to="/safety" className="flex items-center gap-1 group text-[#2A9D8F] font-cabinet font-bold text-[13px]">
          <span>View Safety Analytics & Reports</span>
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/>
        </Link>
      </div>
    </div>
    
    <div className="w-full sm:w-[45%] h-[200px] sm:h-auto relative rounded-[20px] overflow-hidden border border-slate-100 shadow-inner group">
      <img src={PHOTOS.mapThumb} alt="Interactive safety map showing Udaipur landmarks" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-[#2A9D8F]/5" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[50px] h-[50px] rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
          <MapPin size={22} className="text-[#2A9D8F]" fill="currentColor" />
        </div>
      </div>
    </div>
  </div>
);



const C5_Trending = () => {
  const trending = [
    { img: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80", title: "Manali Hills", loc: "Himachal Pradesh", tags: ["Peaks", "Valleys"] },
    { img: PHOTOS.meghalaya, title: "Meghalaya Valley", loc: "Northeast India", tags: ["Forests", "Bridges"] },
    { img: PHOTOS.ladakh, title: "Leh-Ladakh Heights", loc: "Himalayan Range", tags: ["Peaks", "Cold Desert"] },
    { img: PHOTOS.kerala, title: "Alleppey Backwaters", loc: "Kerala Coast", tags: ["Houseboats", "Lakes"] },
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
        <Link to="/explore" className="flex items-center gap-1 group text-[#2A9D8F] font-cabinet font-bold text-[13px]">
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
                WebkitTextStroke: '2px rgba(42, 157, 143, 0.35)',
                fontFamily: 'Cabinet Grotesk, sans-serif'
              }}
            >
              {i + 1}
            </span>

            {/* Travel Card */}
            <div className="w-[280px] sm:w-[310px] h-[210px] rounded-[24px] overflow-hidden relative shadow-[0_8px_24px_rgba(16,42,67,0.06)] group cursor-pointer transition-all duration-300 hover:shadow-[0_16px_36px_rgba(42,157,143,0.12)] border border-slate-100 z-20">
              <img src={t.img || t.url} alt={t.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/85 via-[#102A43]/25 to-transparent" />

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
  <div className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-[24px] p-[20px] shadow-[0_8px_30px_rgb(240,244,248,0.5)] w-full">
    <div className="flex justify-between items-center mb-4">
      <SectionLabel>Verified Medical Care</SectionLabel>
      <Link to="/healthcare" className="font-cabinet font-bold text-[11px] text-[#2A9D8F] hover:underline">View Map</Link>
    </div>
    <div className="flex flex-col gap-[16px]">
      {[
        {img:PHOTOS.doc1,name:'Dr. Kavita Sharma',spec:'General Physician',dist:'0.8 km'},
        {img:PHOTOS.doc2,name:'Dr. Arjun Reddy',spec:'Emergency Response',dist:'1.4 km'}
      ].map((d,i)=>(
        <div key={i} className="flex items-center justify-between gap-2 p-2 rounded-[16px] hover:bg-[#72D6C4]/5 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <img src={d.img} className="w-[48px] h-[48px] rounded-full object-cover border border-slate-200 shrink-0 shadow-sm" alt={d.name} />
            <div className="min-w-0">
              <h4 className="font-cabinet font-bold text-[13px] text-[#102A43] leading-tight truncate">{d.name}</h4>
              <p className="font-jakarta text-[12px] text-[#627D98] mt-0.5 truncate">{d.spec}</p>
              <span className="inline-flex items-center gap-1 text-[#52B788] font-cabinet text-[10px] font-bold mt-1 bg-[#52B788]/10 px-2 py-0.5 rounded-full">
                <CheckCircle2 size={10} className="text-[#52B788]" /> Verified
              </span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <span className="font-mono-dm text-[10px] text-[#627D98]">{d.dist}</span>
            <Link to="/healthcare" className="px-3 py-1 bg-gradient-to-r from-[#2A9D8F] to-[#72D6C4] text-white font-cabinet font-bold text-[10px] rounded-full hover:shadow-md transition-shadow">Book</Link>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const R2_TravelProfile = ({ user }) => (
  <div className="mt-[20px] bg-white/70 backdrop-blur-md border border-slate-100 rounded-[24px] p-[24px] shadow-[0_8px_30px_rgb(240,244,248,0.5)] w-full">
    <div className="flex items-center gap-3">
      <div className="w-[60px] h-[60px] rounded-full bg-[#72D6C4]/10 border-2 border-[#72D6C4]/30 shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
        <span className="font-display font-bold text-[26px] text-[#2A9D8F]">{(user?.fullName || user?.name || 'T')[0]}</span>
      </div>
      <div className="min-w-0">
        <h3 className="font-cabinet font-bold text-[16px] text-[#102A43] truncate">{user?.fullName || user?.name || 'Traveler'}</h3>
        <p className="font-mono-dm text-[11px] text-[#627D98] mt-0.5">Verified Solo Traveler</p>
        <p className="font-jakarta text-[11px] text-[#627D98] mt-0.5 truncate">{user?.email}</p>
      </div>
    </div>
    <div className="w-full h-px bg-slate-100 my-[20px]" />
    <div className="grid grid-cols-2 gap-[12px]">
      {[
        {val:"0",label:"Trips Started"},
        {val:"0",label:"Saved Spots"},
        {val:"0",label:"Guardians"},
        {val:"0",label:"Total Reviews"}
      ].map((s,i) => (
        <div key={i} className="bg-[#72D6C4]/5 rounded-[16px] p-[12px] text-center border border-[#72D6C4]/10">
          <p className="font-display font-bold text-[22px] text-[#2A9D8F] leading-none">{s.val}</p>
          <p className="font-mono-dm text-[9px] text-[#627D98] uppercase mt-1 tracking-wider">{s.label}</p>
        </div>
      ))}
    </div>
  </div>
);

const R3_Notifications = () => (
  <div className="mt-[20px] bg-white/70 backdrop-blur-md border border-slate-100 rounded-[24px] p-[20px] shadow-[0_8px_30px_rgb(240,244,248,0.5)] w-full">
    <SectionLabel>Live Alert Center</SectionLabel>
    <div className="mt-[16px] flex flex-col items-center text-center py-4">
      <div className="w-[44px] h-[44px] rounded-full bg-[#72D6C4]/10 flex items-center justify-center mb-3">
        <Bell size={20} className="text-[#627D98]" />
      </div>
      <h3 className="font-cabinet font-bold text-[13px] text-[#102A43]">All Quiet for Now</h3>
      <p className="mt-[6px] font-jakarta text-[12px] text-[#627D98] max-w-[200px]">Real-time safety signals and chat messages will populate here.</p>
    </div>
  </div>
);

export default Home;
