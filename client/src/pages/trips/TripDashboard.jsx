import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTrips } from '../../store/tripSlice';
import { Helmet } from 'react-helmet-async';
import {
  Search, MapPin, Bell, Calendar, Sun, Shield, Clock, ChevronRight,
  CheckCircle2, Users, Plus, Map, Pencil, Bookmark,
} from 'lucide-react';
import TopAppBar from '../../components/shared/TopAppBar';

/* ── photos ── */
const P = {
  jaisalmer:  'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1440&q=80',
  salimSingh: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?auto=format&fit=crop&w=200&q=80',
  vyasChhatri:'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=200&q=80',
  coorg:      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=120&q=80',
  hampi:      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=120&q=80',
  ranakpur:   'https://images.unsplash.com/photo-1597078804310-7dfe09d55fdc?auto=format&fit=crop&w=120&q=80',
  tungnath:   'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=120&q=80',
  ziro:       'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=120&q=80',
  dholavira:  'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=120&q=80',
  bundi:      'https://images.unsplash.com/photo-1593693397690-362cb9666c6b?auto=format&fit=crop&w=120&q=80',
};

/* ── tiny label ── */
const Label = ({ children }) => (
  <p className="font-mono-dm text-[10px] uppercase tracking-[2px] text-[#B09880]">{children}</p>
);

/* ══════════════════════════════════════════════════════════
   ZONE 1 — Active Trip Hero Banner
   ══════════════════════════════════════════════════════════ */
const ActiveTripHero = ({ trip }) => {
  if (!trip) {
    return (
      <div className="w-full min-h-[260px] md:min-h-[220px] relative flex flex-col justify-end bg-[#1E1410]">
        <div className="relative z-10 w-full">
          <div className="max-w-[1200px] mx-auto px-[24px] md:px-[48px] pb-[24px] md:pb-[36px] pt-[80px] md:pt-[60px] flex flex-col items-center justify-center text-center">
            <h2 className="font-display font-extrabold text-[32px] md:text-[38px] text-white leading-none mt-[6px]">Start Your Next Adventure</h2>
            <p className="font-mono-dm text-[12px] text-white/55 mt-[8px] mb-[16px]">Generate AI-powered itineraries instantly.</p>
            <Link to="/trips/new" className="font-cabinet font-semibold text-[14px] text-[#1E1410] bg-[#E8640C] text-white px-6 py-3 rounded-xl hover:brightness-105 transition-colors">
              Plan New Trip
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const durationStr = trip.startDate && trip.endDate ? `${new Date(trip.startDate).toLocaleDateString()} – ${new Date(trip.endDate).toLocaleDateString()}` : '';
  const heroImg = trip.dailyItinerary?.[0]?.activities?.[0]?.photoUrl || P.jaisalmer;

  return (
    <div className="w-full min-h-[260px] md:min-h-[220px] relative flex flex-col justify-end">
      <img src={heroImg} alt={trip.tripTitle} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ background:'linear-gradient(180deg, transparent 20%, rgba(20,14,10,0.72) 100%)' }} />

      <div className="absolute top-[20px] left-[20px] h-[24px] px-[14px] flex items-center rounded-[100px] bg-white/[0.18] border border-white/30 z-10">
        <span className="font-mono-dm text-[10px] text-white uppercase tracking-wider">{trip.status || 'Active Trip'}</span>
      </div>

      <div className="relative z-10 w-full">
        <div className="max-w-[1200px] mx-auto px-[24px] md:px-[48px] pb-[24px] md:pb-[36px] pt-[80px] md:pt-[60px] flex flex-col md:flex-row items-start md:items-end justify-between gap-[20px] md:gap-0">
          <div>
            <p className="font-mono-dm text-[12px] text-white/60 uppercase tracking-[2px]">Trip duration: {trip.duration} days</p>
            <h2 className="font-display font-extrabold text-[32px] md:text-[38px] text-white leading-none mt-[6px]">{trip.tripTitle}</h2>
            <p className="font-mono-dm text-[12px] text-white/55 mt-[8px]">{durationStr} · {trip.location} · {trip.budget}</p>
          </div>
          <div className="flex flex-wrap items-center gap-[12px]">
            <Link to="/trips/itinerary" className="font-cabinet font-semibold text-[13px] text-white hover:text-white/80 transition-colors whitespace-nowrap">
              View Itinerary →
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
    <div className="bg-white border border-[#E8D5B7] rounded-[14px] p-[16px] shadow-[0_2px_8px_rgba(30,20,16,0.07)] mb-[16px]">
      <Label>Current Weather</Label>
      <div className="mt-[10px] flex items-center justify-between">
        <div className="flex items-baseline gap-[6px]">
          <span className="font-display font-bold text-[36px] text-[#1E1410] leading-none">{Math.round(current.temperature_2m)}°C</span>
        </div>
        <Sun size={28} className="text-[#F0A500]" fill="currentColor" />
      </div>
      <div className="mt-[12px] flex items-center gap-[16px]">
        <span className="font-mono-dm text-[10px] text-[#6B4F3A]">Feels {Math.round(current.apparent_temperature)}°C</span>
        <span className="font-mono-dm text-[10px] text-[#B09880]">H: {Math.round(daily.temperature_2m_max?.[0] || 0)}° L: {Math.round(daily.temperature_2m_min?.[0] || 0)}°</span>
        <span className="font-mono-dm text-[10px] text-[#C0392B]">UV: {daily.uv_index_max?.[0] || 'N/A'}</span>
      </div>
      <div className="mt-[10px] border-t border-[#F5EDE0] pt-[10px] flex justify-between">
        <span className="font-mono-dm text-[10px] text-[#B09880]">Sunrise {daily.sunrise?.[0] ? new Date(daily.sunrise[0]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}</span>
        <span className="font-mono-dm text-[10px] text-[#B09880]">Sunset {daily.sunset?.[0] ? new Date(daily.sunset[0]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}</span>
      </div>
      <p className="text-center font-jakarta text-[11px] text-[#B09880] mt-[4px]">Source: Open-Meteo</p>
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
    <div className="bg-white border border-[#E8D5B7] rounded-[14px] p-[16px] shadow-[0_2px_8px_rgba(30,20,16,0.07)] mb-[16px]">
      <Label>Est. Trip Budget</Label>
      {/* donut */}
      <div className="mt-[10px] flex justify-center">
        <svg width={80} height={80} viewBox="0 0 80 80">
          <circle cx={40} cy={40} r={r} fill="none" stroke="#F5EDE0" strokeWidth={8} />
          <circle cx={40} cy={40} r={r} fill="none" stroke="#E8640C" strokeWidth={8}
            strokeDasharray={`${(pct / 100) * c} ${c}`}
            strokeLinecap="round" transform="rotate(-90 40 40)" />
          <text x={40} y={37} textAnchor="middle" className="font-display font-bold text-[16px]" fill="#1E1410">₹{spent.toLocaleString('en-IN')}</text>
          <text x={40} y={50} textAnchor="middle" className="font-mono-dm text-[9px]" fill="#B09880">spent</text>
        </svg>
      </div>
      <p className="text-center font-cabinet font-semibold text-[13px] text-[#2D6A4F] mt-[12px]">₹{(total - spent).toLocaleString('en-IN')} remaining</p>
      {/* breakdown */}
      <div className="mt-[16px] flex flex-col gap-[12px]">
        {Object.entries(breakdown).slice(0, 3).map(([cat, amt]) => (
          <div key={cat} className="flex flex-col border-b border-[#F5EDE0] last:border-0 pb-[8px]">
            <div className="flex items-center gap-[8px]">
              <span className="w-[6px] h-[6px] rounded-full bg-[#E8D5B7]" />
              <span className="font-cabinet font-bold text-[13px] text-[#1E1410] capitalize">{cat}</span>
            </div>
            <p className="font-jakarta text-[12px] text-[#6B4F3A] mt-[4px] pl-[14px] leading-[1.5]">{amt}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-[#F5EDE0] mt-[8px] pt-[12px] flex items-center justify-between">
        <span className="font-cabinet font-bold text-[14px] text-[#1E1410]">Est Total</span>
        <span className="font-display font-bold text-[16px] text-[#E8640C]">{trip.estimatedCosts?.total || 'N/A'}</span>
      </div>
    </div>
  );
};

const SafetyBlock = () => (
  <div className="bg-[rgba(45,106,79,0.07)] border border-[rgba(45,106,79,0.20)] rounded-[14px] p-[16px]">
    <Label>Safety Status</Label>
    <div className="mt-[10px] flex items-center gap-[8px]">
      <Shield size={20} className="text-[#2D6A4F]" />
      <span className="font-cabinet font-semibold text-[15px] text-[#2D6A4F]">All Clear</span>
    </div>
    <div className="mt-[12px] flex flex-col gap-[8px]">
      {[
        'Guardian Anjali G. — Available now',
        'MG Hospital — 2.3 km away',
        'Tourist helpline: 1363',
      ].map((t) => (
        <div key={t} className="flex items-center gap-[8px]">
          <CheckCircle2 size={13} className="text-[#2D6A4F] shrink-0" />
          <span className="font-jakarta text-[12px] text-[#1E1410]">{t}</span>
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
    <div>
      <Label>Today — Day 1</Label>
      <p className="font-jakarta text-[13px] text-[#6B4F3A] mt-[2px]">{day.theme}</p>
      <div className="mt-[10px] flex flex-col gap-[10px]">
        {day.activities.slice(0, 3).map((a, idx) => (
          <div key={idx} className={`bg-white border rounded-[10px] h-[56px] px-[14px] flex items-center gap-[10px] border-[#E8D5B7]`}>
            <span className="h-[20px] px-[10px] rounded-[8px] bg-[#FEF3E2] font-mono-dm text-[10px] text-[#6B4F3A] flex items-center shrink-0">{a.time}</span>
            <span className="font-cabinet font-semibold text-[14px] text-[#1E1410] flex-1 truncate">{a.activity}</span>
            <span className="font-mono-dm text-[10px] text-[#B09880] shrink-0 truncate max-w-[80px]">{a.location}</span>
          </div>
        ))}
      </div>
      <Link to="/trips/itinerary" className="mt-[12px] font-cabinet font-medium text-[13px] text-[#E8640C] inline-flex items-center gap-1 group">
        See full day itinerary <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
};

const QuickActions = () => {
  const actions = [
    { icon: Plus, label:'New Trip', color:'#E8640C', to:'/trips/new' },
    { icon: Map, label:'Map View', color:'#6B4F3A', to:'/trips/jaisalmer' },
    { icon: Shield, label:'SOS', color:'#C0392B', to:'/safety/sos', danger:true },
    { icon: Users, label:'Find Guardian', color:'#2D6A4F', to:'/safety/guardians' },
  ];
  return (
    <div className="mt-[32px]">
      <Label>Quick Actions</Label>
      <div className="mt-[10px] grid grid-cols-2 sm:grid-cols-4 gap-[12px]">
        {actions.map((a) => (
          <Link key={a.label} to={a.to} className={`bg-white border rounded-[12px] h-[72px] flex flex-col items-center justify-center gap-[6px] hover:shadow-[0_4px_12px_rgba(30,20,16,0.10)] transition-shadow ${a.danger ? 'border-[1.5px] border-[#C0392B]' : 'border-[#E8D5B7]'}`}>
            <a.icon size={20} color={a.color} />
            <span className="font-cabinet font-medium text-[12px] text-[#1E1410]">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

const TripNotes = () => (
  <div className="mt-[24px] bg-white border border-[#E8D5B7] rounded-[14px] p-[14px_16px] shadow-[0_2px_8px_rgba(30,20,16,0.07)]">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-[6px]">
        <Pencil size={14} className="text-[#B09880]" />
        <Label>My Notes</Label>
      </div>
      <span className="font-mono-dm text-[10px] text-[#4ADE80]">Auto-saved</span>
    </div>
    <textarea
      className="mt-[12px] w-full h-[80px] border-none resize-none outline-none font-jakarta text-[14px] text-[#1E1410] placeholder:text-[#B09880]"
      placeholder="Jot down anything — reminders, ideas, things to ask…"
    />
    <p className="text-right font-mono-dm text-[10px] text-[#B09880] mt-[6px]">Saved just now</p>
  </div>
);

const NearbyGems = () => {
  const gems = [
    { img: P.salimSingh, name:'Salim Singh Haveli', loc:'Inside Jaisalmer Fort', dist:'0.4 km away', tag:'Heritage' },
    { img: P.vyasChhatri, name:'Vyas Chhatri', loc:'North of Fort, Jaisalmer', dist:'1.1 km away', tag:'Scenic' },
  ];
  return (
    <div className="mt-[24px]">
      <Label>Nearby Hidden Gems</Label>
      <div className="mt-[10px] flex flex-col gap-[10px]">
        {gems.map((g) => (
          <Link key={g.name} to={`/explore/${g.name.toLowerCase().replace(/\s+/g, '-')}`} className="bg-white border border-[#E8D5B7] rounded-[12px] overflow-hidden h-[80px] flex hover:border-[#E8640C] transition-colors group">
            <img src={g.img} alt={g.name} className="w-[90px] h-[80px] object-cover shrink-0" />
            <div className="flex-1 min-w-0 p-[12px_14px] flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <span className="font-cabinet font-semibold text-[14px] text-[#1E1410] truncate group-hover:text-[#E8640C]">{g.name}</span>
                <Bookmark size={15} className="text-[#E8640C] shrink-0 cursor-pointer" />
              </div>
              <span className="font-mono-dm text-[10px] text-[#6B4F3A] mt-[3px]">{g.loc}</span>
              <div className="mt-[6px] flex items-center gap-[8px]">
                <span className="font-mono-dm text-[10px] text-[#B09880]">{g.dist}</span>
                <span className="px-[6px] py-[2px] rounded bg-[#FEF3E2] border border-[#E8D5B7] font-mono-dm text-[9px] text-[#6B4F3A]">{g.tag}</span>
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
    <div className="bg-white border border-[#E8D5B7] rounded-[14px] p-[16px] shadow-[0_2px_8px_rgba(30,20,16,0.07)] mb-[16px]">
      <div className="flex items-center justify-between">
        <Label>My Trips</Label>
        <Link to="/trips/new" className="font-cabinet font-medium text-[12px] text-[#E8640C]">+ New Trip</Link>
      </div>
      <div className="mt-[12px] flex flex-col gap-[10px]">
        {trips.length === 0 && <p className="text-[13px] text-[#6B4F3A]">No trips saved yet.</p>}
        {trips.slice(0, 3).map((t) => (
          <div key={t._id} className="h-[48px] flex items-center gap-[10px]">
            <img src={t.dailyItinerary?.[0]?.activities?.[0]?.photoUrl || P.jaisalmer} alt={t.tripTitle} className="w-[40px] h-[40px] rounded-[8px] object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-cabinet font-semibold text-[13px] text-[#1E1410] truncate">{t.tripTitle}</p>
              <p className="font-mono-dm text-[10px] text-[#B09880]">{t.startDate ? new Date(t.startDate).toLocaleDateString() : 'Dates unknown'}</p>
            </div>
            <span className="px-[8px] py-[3px] rounded-[6px] font-mono-dm text-[10px] shrink-0 bg-[#FEF3E2] text-[#E8640C] uppercase">{t.status || 'UPCOMING'}</span>
          </div>
        ))}
      </div>
      {trips.length > 0 && (
        <Link to="/account/history" className="mt-[10px] font-cabinet font-medium text-[12px] text-[#E8640C] flex justify-center items-center gap-1 group">
          View all trips <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
};

const SavedPlacesBlock = () => {
  const places = [
    { img: P.ranakpur, name:'Ranakpur Temple', state:'Rajasthan' },
    { img: P.tungnath, name:'Tungnath Temple', state:'Uttarakhand' },
    { img: P.ziro, name:'Ziro Valley', state:'Arunachal' },
  ];
  return (
    <div className="bg-white border border-[#E8D5B7] rounded-[14px] p-[16px] shadow-[0_2px_8px_rgba(30,20,16,0.07)] mb-[16px]">
      <div className="flex items-center justify-between">
        <Label>Saved Places</Label>
        <span className="w-[20px] h-[20px] rounded-full bg-[#FEF3E2] flex items-center justify-center font-mono-dm text-[10px] text-[#E8640C]">12</span>
      </div>
      <div className="mt-[10px] flex flex-col gap-[8px]">
        {places.map((p) => (
          <div key={p.name} className="h-[36px] flex items-center gap-[10px]">
            <img src={p.img} alt={p.name} className="w-[32px] h-[32px] rounded-[6px] object-cover shrink-0" />
            <span className="font-cabinet font-semibold text-[13px] text-[#1E1410] flex-1 truncate">{p.name}</span>
            <span className="font-mono-dm text-[10px] text-[#B09880] shrink-0">{p.state}</span>
          </div>
        ))}
      </div>
      <Link to="/account/saved" className="mt-[10px] font-cabinet font-medium text-[12px] text-[#E8640C] inline-flex items-center gap-1 group">
        View all saved <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
};

const CommunityBlock = () => {
  const posts = [
    { img: P.dholavira, name:'Dholavira', loc:'Gujarat', by:'Submitted by Vikram T.', tag:'UNESCO' },
    { img: P.bundi, name:'Raniji ki Baori', loc:'Bundi, Rajasthan', by:'Submitted by Priya M.', tag:'Architecture' },
  ];
  return (
    <div className="bg-white border border-[#E8D5B7] rounded-[14px] p-[16px] shadow-[0_2px_8px_rgba(30,20,16,0.07)]">
      <Label>From The Community</Label>
      <div className="mt-[10px] flex flex-col gap-[10px]">
        {posts.map((p) => (
          <div key={p.name} className="flex gap-[10px]">
            <img src={p.img} alt={p.name} className="w-[56px] h-[56px] rounded-[8px] object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-cabinet font-semibold text-[13px] text-[#1E1410]">{p.name}</p>
              <p className="font-mono-dm text-[10px] text-[#6B4F3A]">{p.loc}</p>
              <div className="mt-[4px] flex items-center gap-[6px]">
                <span className="font-jakarta text-[11px] text-[#B09880]">{p.by}</span>
                <span className="px-[6px] py-[2px] rounded bg-[#FEF3E2] border border-[#E8D5B7] font-mono-dm text-[9px] text-[#6B4F3A]">{p.tag}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link to="/community" className="mt-[10px] font-cabinet font-medium text-[12px] text-[#E8640C] inline-flex items-center gap-1 group">
        Explore community <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   PAGE ASSEMBLY
   ══════════════════════════════════════════════════════════ */
const Home = () => {
  const dispatch = useDispatch();
  const { trips, loading } = useSelector((state) => state.trip);

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  const activeTrip = trips?.[0];

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <Helmet>
        <title>Trip Dashboard | My Itinerary - Manage Your Travels</title>
        <meta
          name="description"
          content="Manage your active trips, track your budget, and access real-time safety alerts. View your daily itinerary and discover hidden gems near your current location."
        />
        <meta
          name="keywords"
          content="travel dashboard, trip planner, itinerary manager, travel budget tracker, safety alerts"
        />
      </Helmet>
      <TopAppBar variant="logo" />

      {/* ZONE 1 — Hero */}
      <ActiveTripHero trip={activeTrip} />

      {/* ZONE 2 — Body */}
      <div className="max-w-[1200px] mx-auto mt-[32px] px-[24px] lg:px-[48px]">
        <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr_320px] gap-[32px]">

          {/* LEFT */}
          <aside className="w-full lg:sticky lg:top-[96px] lg:self-start">
            <WeatherBlock trip={activeTrip} />
            <BudgetBlock trip={activeTrip} />
            <SafetyBlock />
          </aside>

          {/* CENTER */}
          <section className="min-w-0">
            <TodayActivities trip={activeTrip} />
            <QuickActions />
            <TripNotes />
            <NearbyGems />
          </section>

          {/* RIGHT */}
          <aside className="w-full lg:sticky lg:top-[96px] lg:self-start">
            <MyTripsBlock trips={trips} />
            <SavedPlacesBlock />
            <CommunityBlock />
          </aside>

        </div>
      </div>

      {/* bottom spacer for mobile nav */}
      <div className="h-[100px] lg:h-[64px]" />
    </div>
  );
};

export default Home;
