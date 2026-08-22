import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTrips } from '../../store/tripSlice';
import { Helmet } from 'react-helmet-async';
import {
  Search, MapPin, Bell, Calendar, Sun, Shield, Clock, ChevronRight,
  CheckCircle2, Users, Plus, Map, Pencil, Bookmark, Thermometer, CloudRain,
} from 'lucide-react';
import TopAppBar from '../../components/shared/TopAppBar';

/* ── Breathtaking Travel Photography ── */
const P = {
  jaisalmer:  'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
  salimSingh: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?auto=format&fit=crop&w=300&q=80',
  vyasChhatri:'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=300&q=80',
  coorg:      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=300&q=80',
  hampi:      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=300&q=80',
  ranakpur:   'https://images.unsplash.com/photo-1597078804310-7dfe09d55fdc?auto=format&fit=crop&w=300&q=80',
  tungnath:   'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=300&q=80',
  ziro:       'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=300&q=80',
  dholavira:  'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=300&q=80',
  bundi:      'https://images.unsplash.com/photo-1593693397690-362cb9666c6b?auto=format&fit=crop&w=300&q=80',
};

/* ── Tiny design tag label ── */
const Label = ({ children }) => (
  <p className="font-mono-dm text-[10px] uppercase tracking-[2px] text-slate-400 font-bold mb-2.5">{children}</p>
);

/* ══════════════════════════════════════════════════════════
   ZONE 1 — Active Trip Hero Banner
   ══════════════════════════════════════════════════════════ */
const ActiveTripHero = ({ trip }) => {
  if (!trip) {
    return (
      <div className="w-[90%] max-w-[1200px] mx-auto mt-6 rounded-[28px] overflow-hidden relative min-h-[220px] flex items-center justify-center bg-gradient-to-tr from-[#102A43] via-[#1A365D] to-[#2A9D8F] shadow-[0_16px_36px_rgba(16,42,67,0.15)] p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(114,214,196,0.15),transparent_60%)]" />
        <div className="relative z-10 text-center max-w-lg">
          <h2 className="font-display font-extrabold text-[28px] md:text-[34px] text-white leading-tight">Start Your Next Adventure</h2>
          <p className="font-jakarta text-[13px] text-white/80 mt-2.5 mb-6">Generate premium AI-powered custom itineraries instantly.</p>
          <Link to="/trips/new" className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-[#F4A261] hover:bg-[#F2944A] text-white font-cabinet font-bold text-[14px] shadow-lg shadow-[#F4A261]/20 hover:scale-105 transition-all duration-200">
            Plan New Trip <Plus size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const durationStr = trip.startDate && trip.endDate ? `${new Date(trip.startDate).toLocaleDateString()} – ${new Date(trip.endDate).toLocaleDateString()}` : '';
  const heroImg = trip.dailyItinerary?.[0]?.activities?.[0]?.photoUrl || P.jaisalmer;

  return (
    <div className="w-[90%] max-w-[1200px] mx-auto mt-6 rounded-[28px] overflow-hidden relative min-h-[260px] flex flex-col justify-end shadow-[0_16px_36px_rgba(16,42,67,0.12)]">
      <img src={heroImg} alt={trip.tripTitle} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/90 via-[#102A43]/40 to-transparent z-10" />

      <div className="absolute top-[20px] left-[20px] h-[26px] px-[14px] flex items-center rounded-full bg-white/15 backdrop-blur-md border border-white/20 z-10 shadow-sm">
        <span className="font-mono-dm text-[9.5px] text-white font-bold uppercase tracking-wider">{trip.status || 'Active Trip'}</span>
      </div>

      <div className="relative z-10 w-full p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-0">
          <div>
            <p className="font-mono-dm text-[11px] text-white/70 uppercase tracking-[2px]">Trip duration: {trip.duration} days</p>
            <h2 className="font-display font-extrabold text-[28px] md:text-[36px] text-white leading-tight mt-1.5">{trip.tripTitle}</h2>
            <p className="font-jakarta text-[13px] text-white/75 mt-2">{durationStr} · {trip.location} · {trip.budget}</p>
          </div>
          <div className="flex items-center shrink-0">
            <Link to="/trips/itinerary" className="h-11 px-6 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white font-cabinet font-semibold text-[13.5px] hover:bg-white/25 hover:scale-102 transition-all flex items-center gap-2">
              View Itinerary <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   LEFT COLUMN — Weather · Budget · Safety
   ══════════════════════════════════════════════════════════ */

const WeatherBlock = ({ trip }) => {
  const [weather, setWeather] = React.useState(null);

  React.useEffect(() => {
    if (!trip) return;
    const lat = trip.dailyItinerary?.[0]?.activities?.[0]?.lat || 28.6139;
    const lng = trip.dailyItinerary?.[0]?.activities?.[0]?.lng || 77.2090;
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,apparent_temperature,weather_code&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`)
      .then(res => res.json())
      .then(data => setWeather(data))
      .catch(console.error);
  }, [trip]);

  if (!weather || !trip) return null;
  const current = weather.current;
  const daily = weather.daily;

  return (
    <div className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-2xl p-5 shadow-[0_8px_30px_rgb(240,244,248,0.5)] mb-5">
      <Label>Current Weather</Label>
      <div className="mt-2.5 flex items-center justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display font-bold text-[36px] text-[#102A43] leading-none">{Math.round(current.temperature_2m)}°C</span>
        </div>
        <Sun size={28} className="text-[#F4A261]" fill="currentColor" />
      </div>
      <div className="mt-3 flex items-center gap-4">
        <span className="font-mono-dm text-[10px] text-[#627D98]">Feels {Math.round(current.apparent_temperature)}°C</span>
        <span className="font-mono-dm text-[10px] text-[#627D98]">H: {Math.round(daily.temperature_2m_max?.[0] || 0)}° L: {Math.round(daily.temperature_2m_min?.[0] || 0)}°</span>
        <span className="font-mono-dm text-[10px] text-rose-500">UV: {daily.uv_index_max?.[0] || 'N/A'}</span>
      </div>
      <div className="mt-3.5 border-t border-slate-100 pt-3 flex justify-between text-[11px] font-mono-dm text-[#627D98]/80">
        <span>Sunrise {daily.sunrise?.[0] ? new Date(daily.sunrise[0]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}</span>
        <span>Sunset {daily.sunset?.[0] ? new Date(daily.sunset[0]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}</span>
      </div>
    </div>
  );
};

const BudgetBlock = ({ trip }) => {
  if (!trip) return null;
  const totalStr = trip.estimatedCosts?.total || '0';
  const match = totalStr.replace(/,/g, '').match(/\d+/);
  const total = match ? parseInt(match[0], 10) : 20000;
  const spent = Math.floor(total * 0.4); 
  const pct = (spent / total) * 100;
  const r = 36, c = 2 * Math.PI * r;
  const breakdown = trip.estimatedCosts?.breakdown || {};

  return (
    <div className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-2xl p-5 shadow-[0_8px_30px_rgb(240,244,248,0.5)] mb-5">
      <Label>Est. Trip Budget</Label>
      <div className="mt-3 flex justify-center">
        <svg width={80} height={80} viewBox="0 0 80 80">
          <circle cx={40} cy={40} r={r} fill="none" stroke="#F1F5F9" strokeWidth={8} />
          <circle cx={40} cy={40} r={r} fill="none" stroke="#2A9D8F" strokeWidth={8}
            strokeDasharray={`${(pct / 100) * c} ${c}`}
            strokeLinecap="round" transform="rotate(-90 40 40)" />
          <text x={40} y={37} textAnchor="middle" className="font-cabinet font-bold text-[15px]" fill="#102A43">₹{spent.toLocaleString('en-IN')}</text>
          <text x={40} y={50} textAnchor="middle" className="font-mono-dm text-[9px] uppercase tracking-wider" fill="#627D98">spent</text>
        </svg>
      </div>
      <p className="text-center font-cabinet font-semibold text-[13px] text-[#52B788] mt-3">₹{(total - spent).toLocaleString('en-IN')} remaining</p>
      
      <div className="mt-4 flex flex-col gap-2.5">
        {Object.entries(breakdown).slice(0, 3).map(([cat, amt]) => (
          <div key={cat} className="flex flex-col border-b border-slate-100 last:border-0 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#72D6C4]" />
              <span className="font-cabinet font-bold text-[13px] text-[#243B53] capitalize">{cat}</span>
            </div>
            <p className="font-jakarta text-[12px] text-[#627D98] mt-1 pl-3.5 leading-relaxed">{amt}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100 mt-2.5 pt-3 flex items-center justify-between">
        <span className="font-cabinet font-bold text-[13.5px] text-[#243B53]">Est Total</span>
        <span className="font-display font-bold text-[15px] text-[#2A9D8F]">{trip.estimatedCosts?.total || 'N/A'}</span>
      </div>
    </div>
  );
};

const SafetyBlock = () => (
  <div className="bg-[#52B788]/5 border border-[#52B788]/20 rounded-2xl p-5 shadow-[0_8px_30px_rgb(240,244,248,0.5)]">
    <Label>Safety Status</Label>
    <div className="mt-2.5 flex items-center gap-2">
      <Shield size={18} className="text-[#52B788]" fill="currentColor" fillOpacity={0.1} />
      <span className="font-cabinet font-semibold text-[15px] text-[#52B788]">All Clear</span>
    </div>
    <div className="mt-3.5 flex flex-col gap-2">
      {[
        'Guardian Anjali G. — Online',
        'MG Hospital — 2.3 km away',
        'Tourist helpline: 1363',
      ].map((t) => (
        <div key={t} className="flex items-center gap-2">
          <CheckCircle2 size={13} className="text-[#52B788] shrink-0" />
          <span className="font-jakarta text-[12px] text-[#243B53]">{t}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   CENTER COLUMN — Activities · Quick Actions · Notes · Gems
   ══════════════════════════════════════════════════════════ */

const TodayActivities = ({ trip }) => {
  if (!trip) return null;
  const day = trip.dailyItinerary?.[0];
  if (!day) return null;
  
  return (
    <div className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-2xl p-5 shadow-[0_8px_30px_rgb(240,244,248,0.5)]">
      <Label>Today — Day 1</Label>
      <p className="font-jakarta text-[13px] text-[#627D98] mt-0.5">{day.theme}</p>
      <div className="mt-3.5 flex flex-col gap-2.5">
        {day.activities.slice(0, 3).map((a, idx) => (
          <div key={idx} className="bg-slate-50/50 border border-slate-100 rounded-xl h-[56px] px-[14px] flex items-center gap-3.5 hover:border-[#2A9D8F]/30 hover:bg-white transition-all duration-200">
            <span className="h-6 px-2.5 rounded-lg bg-[#FFE1D2] font-mono-dm text-[9.5px] text-[#E8640C] flex items-center shrink-0">{a.time}</span>
            <span className="font-cabinet font-semibold text-[13.5px] text-[#243B53] flex-1 truncate">{a.activity}</span>
            <span className="font-mono-dm text-[9.5px] text-[#627D98] shrink-0 truncate max-w-[80px]">{a.location}</span>
          </div>
        ))}
      </div>
      <Link to="/trips/itinerary" className="mt-4 font-cabinet font-semibold text-[12.5px] text-[#2A9D8F] hover:text-[#227C70] inline-flex items-center gap-1 group">
        See full day itinerary <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
};

const QuickActions = () => {
  const actions = [
    { icon: Plus, label:'New Trip', color:'#2A9D8F', to:'/trips/new' },
    { icon: Map, label:'Map View', color:'#F4A261', to:'/trips/jaisalmer' },
    { icon: Shield, label:'SOS Trigger', color:'#C0392B', to:'/safety/sos', danger:true },
    { icon: Users, label:'Find Helper', color:'#52B788', to:'/safety/guardians' },
  ];
  return (
    <div className="mt-7">
      <Label>Quick Actions</Label>
      <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((a) => (
          <Link key={a.label} to={a.to} className={`bg-white/70 backdrop-blur-md border rounded-2xl h-[76px] flex flex-col items-center justify-center gap-2 hover:shadow-[0_8px_20px_rgba(16,42,67,0.06)] hover:border-[#2A9D8F]/30 transition-all duration-200 ${a.danger ? 'border-red-200 bg-red-50/5 hover:border-red-400' : 'border-slate-100'}`}>
            <a.icon size={18} color={a.color} />
            <span className="font-cabinet font-semibold text-[12px] text-[#243B53]">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

const TripNotes = () => (
  <div className="mt-7 bg-white/70 backdrop-blur-md border border-slate-100 rounded-2xl p-5 shadow-[0_8px_30px_rgb(240,244,248,0.5)]">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <Pencil size={14} className="text-[#627D98]" />
        <Label>My Travel Notes</Label>
      </div>
      <span className="font-mono-dm text-[9px] text-[#52B788] bg-[#52B788]/10 px-2 py-0.5 rounded-full uppercase font-bold">Auto-saved</span>
    </div>
    <textarea
      className="mt-3.5 w-full h-[80px] bg-slate-50/30 border border-slate-100 rounded-xl p-3 resize-none outline-none font-jakarta text-[13px] text-[#243B53] placeholder:text-slate-400 focus:border-[#2A9D8F]/30 focus:bg-white transition-colors duration-250"
      placeholder="Jot down anything — reminders, ideas, things to buy, landmark names..."
    />
  </div>
);

const NearbyGems = () => {
  const gems = [
    { img: P.salimSingh, name:'Salim Singh Haveli', loc:'Inside Jaisalmer Fort', dist:'0.4 km away', tag:'Heritage' },
    { img: P.vyasChhatri, name:'Vyas Chhatri Cenotaphs', loc:'North of Fort, Jaisalmer', dist:'1.1 km away', tag:'Scenic' },
  ];
  return (
    <div className="mt-7 mb-6">
      <Label>Nearby Hidden Gems</Label>
      <div className="mt-2.5 flex flex-col gap-3">
        {gems.map((g) => (
          <Link key={g.name} to={`/explore/${g.name.toLowerCase().replace(/\s+/g, '-')}`} className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-2xl overflow-hidden h-[88px] flex hover:border-[#2A9D8F]/40 hover:shadow-md transition-all duration-200 group">
            <img src={g.img} alt={g.name} className="w-[100px] h-full object-cover shrink-0" />
            <div className="flex-1 min-w-0 p-3.5 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <span className="font-cabinet font-bold text-[13.5px] text-[#243B53] truncate group-hover:text-[#2A9D8F]">{g.name}</span>
                <Bookmark size={14} className="text-[#2A9D8F] shrink-0 cursor-pointer" />
              </div>
              <span className="font-mono-dm text-[9.5px] text-[#627D98] mt-0.5 truncate">{g.loc}</span>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-mono-dm text-[9.5px] text-slate-400">{g.dist}</span>
                <span className="px-[6px] py-[1.5px] rounded-full bg-[#FFE1D2] font-mono-dm text-[9px] text-[#E8640C] font-semibold">{g.tag}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   RIGHT COLUMN — My Trips · Saved Places · Community
   ══════════════════════════════════════════════════════════ */

const MyTripsBlock = ({ trips }) => {
  return (
    <div className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-2xl p-5 shadow-[0_8px_30px_rgb(240,244,248,0.5)] mb-5">
      <div className="flex items-center justify-between mb-3">
        <Label>My Trips</Label>
        <Link to="/trips/new" className="font-cabinet font-bold text-[12px] text-[#2A9D8F]">+ New</Link>
      </div>
      <div className="flex flex-col gap-3">
        {trips.length === 0 && <p className="text-[13px] text-[#627D98]">No trips saved yet.</p>}
        {trips.slice(0, 3).map((t) => (
          <div key={t._id} className="h-[48px] flex items-center gap-2.5">
            <img src={t.dailyItinerary?.[0]?.activities?.[0]?.photoUrl || P.jaisalmer} alt={t.tripTitle} className="w-[40px] h-[40px] rounded-lg object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-cabinet font-semibold text-[13px] text-[#243B53] truncate">{t.tripTitle}</p>
              <p className="font-mono-dm text-[9.5px] text-slate-400">{t.startDate ? new Date(t.startDate).toLocaleDateString() : 'Dates unknown'}</p>
            </div>
            <span className="px-2 py-0.5 rounded font-mono-dm text-[9px] shrink-0 bg-[#FFE1D2] text-[#E8640C] uppercase font-bold">{t.status || 'UPCOMING'}</span>
          </div>
        ))}
      </div>
      {trips.length > 0 && (
        <Link to="/account/history" className="mt-3.5 font-cabinet font-semibold text-[12px] text-[#2A9D8F] flex justify-center items-center gap-1 group">
          View all trips <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
};

const SavedPlacesBlock = () => {
  const places = [
    { img: P.ranakpur, name:'Ranakpur Temple', state:'Rajasthan' },
    { img: P.tungnath, name:'Tungnath Shrine', state:'Uttarakhand' },
    { img: P.ziro, name:'Ziro Valley Hills', state:'Arunachal' },
  ];
  return (
    <div className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-2xl p-5 shadow-[0_8px_30px_rgb(240,244,248,0.5)] mb-5">
      <div className="flex items-center justify-between mb-3">
        <Label>Saved Places</Label>
        <span className="w-5 h-5 rounded-full bg-[#FFE1D2] flex items-center justify-center font-mono-dm text-[9.5px] text-[#E8640C] font-bold">12</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {places.map((p) => (
          <div key={p.name} className="h-[36px] flex items-center gap-2.5">
            <img src={p.img} alt={p.name} className="w-[32px] h-[32px] rounded-lg object-cover shrink-0" />
            <span className="font-cabinet font-bold text-[13px] text-[#243B53] flex-1 truncate">{p.name}</span>
            <span className="font-mono-dm text-[9.5px] text-slate-400 shrink-0">{p.state}</span>
          </div>
        ))}
      </div>
      <Link to="/account/saved" className="mt-3.5 font-cabinet font-semibold text-[12px] text-[#2A9D8F] inline-flex items-center gap-1 group">
        View all saved <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
};

const CommunityBlock = () => {
  const posts = [
    { img: P.dholavira, name:'Dholavira ruins', loc:'Rann of Kutch, GJ', by:'Vikram T.', tag:'UNESCO' },
    { img: P.bundi, name:'Raniji ki Baori stepwell', loc:'Bundi, RJ', by:'Priya M.', tag:'Architecture' },
  ];
  return (
    <div className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-2xl p-5 shadow-[0_8px_30px_rgb(240,244,248,0.5)]">
      <Label>From The Community</Label>
      <div className="mt-2.5 flex flex-col gap-3.5">
        {posts.map((p) => (
          <div key={p.name} className="flex gap-2.5">
            <img src={p.img} alt={p.name} className="w-[48px] h-[48px] rounded-lg object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-cabinet font-bold text-[13px] text-[#243B53] truncate">{p.name}</p>
              <p className="font-mono-dm text-[9.5px] text-[#627D98] truncate">{p.loc}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="font-jakarta text-[10px] text-slate-400 truncate">By {p.by}</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono-dm text-[8.5px] text-[#627D98]">{p.tag}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link to="/community" className="mt-3.5 font-cabinet font-semibold text-[12px] text-[#2A9D8F] inline-flex items-center gap-1 group">
        Explore feed <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
};

/* ── PAGE ASSEMBLY ── */
const Home = () => {
  const dispatch = useDispatch();
  const { trips, loading } = useSelector((state) => state.trip);

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  const activeTrip = trips?.[0];

  return (
    <div className="min-h-screen bg-[#F7FAFC] pb-28">
      <Helmet>
        <title>Explore | My Itinerary - Plan & Discover India</title>
        <meta
          name="description"
          content="Manage your active trips, track your budget, and access real-time safety alerts. View your daily itinerary and discover hidden gems near your current location."
        />
      </Helmet>
      <TopAppBar variant="logo" />

      {/* ZONE 1 — Hero */}
      <ActiveTripHero trip={activeTrip} />

      {/* ZONE 2 — Body */}
      <div className="max-w-[1200px] mx-auto mt-8 px-6 lg:px-8">
        <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr_320px] gap-8">

          {/* LEFT COLUMN - Weather, Budget, Safety */}
          <aside className="w-full lg:sticky lg:top-[96px] lg:self-start">
            <WeatherBlock trip={activeTrip} />
            <BudgetBlock trip={activeTrip} />
            <SafetyBlock />
          </aside>

          {/* CENTER COLUMN - Activities, Actions, Notes, Nearby */}
          <section className="min-w-0 flex flex-col gap-6">
            <TodayActivities trip={activeTrip} />
            <QuickActions />
            <TripNotes />
            <NearbyGems />
          </section>

          {/* RIGHT COLUMN - Trips, Saved, Community */}
          <aside className="w-full lg:sticky lg:top-[96px] lg:self-start">
            <MyTripsBlock trips={trips} />
            <SavedPlacesBlock />
            <CommunityBlock />
          </aside>

        </div>
      </div>
    </div>
  );
};

export default Home;
