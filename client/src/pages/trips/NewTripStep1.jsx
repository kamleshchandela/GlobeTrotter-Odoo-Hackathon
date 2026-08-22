import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Calendar, ChevronRight, CheckCircle2, Shield, Bell, MapPinOff, Users as PeopleIcon, Minus, Plus, Zap, Turtle, Compass, Loader2, AlertTriangle } from "lucide-react";
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from "@react-google-maps/api";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setTripStart, setTripSuccess, setTripFailure } from "../../store/tripSlice";
import TopAppBar from "../../components/shared/TopAppBar";
import { API_BASE_URL, GOOGLE_MAPS_API_KEY } from "../../config/env";

const LIBRARIES = ['places', 'geometry'];

const PHOTOS = {
  jaisalmer:'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=200&q=80',
  alleppey:'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=200&q=80',
  spiti:'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=200&q=80',
  meghalaya:'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=200&q=80',
  varanasi:'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=200&q=80',
  hampi:'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=200&q=80',
};

const DESTINATIONS = [
  { img:PHOTOS.jaisalmer, city:'Jaisalmer', state:'Rajasthan', tags:['Heritage','Desert'], lat: 26.9157, lng: 70.9160 },
  { img:PHOTOS.alleppey, city:'Alleppey', state:'Kerala', tags:['Backwaters','Serene'], lat: 9.4981, lng: 76.3388 },
  { img:PHOTOS.spiti, city:'Spiti Valley', state:'Himachal Pradesh', tags:['Mountains','Remote'], lat: 32.2426, lng: 78.0349 },
  { img:PHOTOS.meghalaya, city:'Meghalaya', state:'Northeast India', tags:['Forest','Offbeat'], lat: 25.4670, lng: 91.3662 },
  { img:PHOTOS.varanasi, city:'Varanasi', state:'Uttar Pradesh', tags:['Spiritual','Ancient'], lat: 25.3176, lng: 82.9739 },
  { img:PHOTOS.hampi, city:'Hampi', state:'Karnataka', tags:['Ruins','Surreal'], lat: 15.3350, lng: 76.4600 },
];

const INTERESTS = ['Sightseeing','Trekking','Heritage Walks','Street Food Trails','Photography','Adventure Sports','Spiritual Visits','Wildlife Safari','Boat Rides','Cycling','Local Markets','Cooking Classes','Nightlife','Shopping'];
const STAYS = ['Budget Hostel','Guesthouse','Mid-range Hotel','Luxury Resort'];
const TRANSPORT = ['Train','Bus','Own Vehicle'];
const DIETARY = ['Vegetarian','Non-Vegetarian','Vegan','Jain','No Preference'];

const Label = ({children}) => <p className="font-mono-dm text-[11px] text-[#6B4F3A] uppercase tracking-[2px]">{children}</p>;
const SubLabel = ({children}) => <p className="font-mono-dm text-[10px] text-[#B09880] mt-[6px]">{children}</p>;

const Chip = ({label, selected, onClick}) => (
  <button onClick={onClick} className={`h-[36px] px-[16px] rounded-[100px] border font-cabinet font-medium text-[13px] transition-colors ${selected ? 'bg-[#E8640C] text-white border-[#E8640C]' : 'bg-white text-[#1E1410] border-[#E8D5B7] hover:border-[#E8640C]/40'}`}>{label}</button>
);

const ChipRect = ({label, selected, onClick}) => (
  <button onClick={onClick} className={`h-[40px] px-[16px] rounded-[10px] border font-cabinet font-medium text-[13px] transition-colors ${selected ? 'bg-[#E8640C] text-white border-[#E8640C]' : 'bg-white text-[#1E1410] border-[#E8D5B7] hover:border-[#E8640C]/40'}`}>{label}</button>
);

export default function NewTripStep1() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dest, setDest] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES
  });

  const [autocomplete, setAutocomplete] = useState(null);
  const onAutocompleteLoad = (auto) => setAutocomplete(auto);
  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        setDest({
          city: place.name,
          state: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          img: place.photos ? place.photos[0].getUrl() : 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=60'
        });
      }
    }
  };

  const mapCenter = useMemo(() => ({
    lat: dest ? dest.lat : 20.5937,
    lng: dest ? dest.lng : 78.9629
  }), [dest]);

  const mapOptions = {
    disableDefaultUI: true,
    styles: [
      {
        "featureType": "all",
        "elementType": "geometry.fill",
        "stylers": [{ "color": "#fef3e2" }]
      },
      {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#6b4f3a" }]
      }
    ]
  };
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(15000);
  const [stay, setStay] = useState('Guesthouse');
  const [transport, setTransport] = useState('Train');
  const [dietary, setDietary] = useState('No Preference');
  const [interests, setInterests] = useState(['Sightseeing','Street Food Trails']);
  const [vibe, setVibe] = useState('Slow Travel');
  const [safetyToggles, setSafetyToggles] = useState([true, true, false]);
  const [generating, setGenerating] = useState(false);

  const toggleInterest = (i) => setInterests(prev => prev.includes(i) ? prev.filter(x=>x!==i) : [...prev, i]);
  const toggleSafety = (idx) => setSafetyToggles(prev => prev.map((v,i) => i===idx ? !v : v));

  const canGenerate = dest && startDate && endDate;

  const vibes = [
    { icon: Turtle, name:'Slow Travel', desc:'Take it easy, linger longer', tint:'rgba(232,100,12,0.08)' },
    { icon: Zap, name:'Action-Packed', desc:'Maximize every day', tint:'rgba(192,57,43,0.08)' },
    { icon: MapPinOff, name:'Off the Beaten Path', desc:'Avoid the tourist crowds', tint:'rgba(45,106,79,0.08)' },
    { icon: PeopleIcon, name:'Cultural Immersion', desc:'Go deep into local life', tint:'rgba(240,165,0,0.08)' },
  ];

  const safetyRows = [
    { icon: Shield, label:'Women-only guardian matching', helper:'Prioritize verified women guardians' },
    { icon: Bell, label:'Real-time safety alerts', helper:'Get alerts about conditions at your destination' },
    { icon: MapPin, label:'Share live location with emergency contacts', helper:'Recommended for solo travelers' },
  ];

  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!canGenerate) return;
    
    setGenerating(true);
    setError(null);
    dispatch(setTripStart());

    const tripPayload = {
      location: dest.city + ", " + dest.state,
      startDate,
      endDate,
      duration: days,
      travelers,
      budget,
      stay,
      transport,
      dietary,
      interests,
      vibe
    };

    try {
      const response = await fetch(`${API_BASE_URL}/trips/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripPayload)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        dispatch(setTripSuccess(data));

        // Auto-save the trip to DB so it persists across page refreshes
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const saveRes = await fetch(`${API_BASE_URL}/trips/save`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` 
              },
              body: JSON.stringify(data)
            });
            if (saveRes.ok) {
              const savedTrip = await saveRes.json();
              dispatch(setTripSuccess(savedTrip)); // Update Redux with the saved version (includes _id)
              navigate(`/trips/${savedTrip._id}/itinerary`);
              return;
            }
          } catch (saveErr) {
            console.error("Auto-save failed, proceeding without persistence:", saveErr);
          }
        }
        // Fallback if not logged in or save failed
        navigate(`/trips/${Date.now()}/itinerary`); 
      } else {
        throw new Error(data.message || 'Failed to generate itinerary');
      }
    } catch (err) {
      console.error("ITINERARY_GENERATION_FAILED:", err);
      dispatch(setTripFailure(err.message));
      setError(err.message === "API key not valid. Please pass a valid API key." 
        ? "Your Gemini API key is still propagating. Please wait 2-3 minutes and try again." 
        : err.message);
    } finally {
      setGenerating(false);
    }
  };

  const days = startDate && endDate ? Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000) + 1) : 0;

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <TopAppBar variant="back" title="Plan New Trip" />

      <div className="flex flex-col lg:flex-row max-w-[1440px] mx-auto">
        {/* ─── LEFT: FORM ─── */}
        <div className="w-full lg:w-[600px] lg:ml-[120px] px-6 lg:px-0 pt-[64px] pb-[120px]">
          {/* breadcrumb */}
          <div className="flex items-center gap-2">
            <Link to="/trips" className="font-jakarta text-[13px] text-[#B09880]">Trips</Link>
            <ChevronRight size={12} className="text-[#B09880]" />
            <span className="font-cabinet font-semibold text-[13px] text-[#1E1410]">New Trip</span>
          </div>

          <h1 className="font-display font-bold text-[40px] text-[#1E1410] leading-[1.1] mt-[20px]">Plan your trip.</h1>
          <p className="font-jakarta text-[16px] text-[#6B4F3A] leading-[1.5] mt-[10px] max-w-[480px]">Fill in what you know. We handle everything else.</p>

          {/* SEC 1 — Destination */}
          <div className="mt-[32px]">
            <Label>Where Are You Going?</Label>
            <div className="mt-[10px] relative">
              <Search size={20} className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[#B09880] z-10" />
              {isLoaded ? (
                <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={onPlaceChanged}>
                  <input 
                    className="w-full h-[56px] bg-white border-[1.5px] border-[#E8D5B7] rounded-[12px] pl-[52px] pr-[18px] font-jakarta text-[15px] text-[#1E1410] placeholder:text-[#B09880] shadow-[0_4px_16px_rgba(30,20,16,0.08)] focus:border-[#E8640C] focus:shadow-[0_0_0_4px_rgba(232,100,12,0.10)] outline-none transition-all" 
                    placeholder="Search any city or place in India…" 
                  />
                </Autocomplete>
              ) : (
                <input 
                  className="w-full h-[56px] bg-white border-[1.5px] border-[#E8D5B7] rounded-[12px] pl-[52px] pr-[18px] font-jakarta text-[15px] text-[#1E1410] placeholder:text-[#B09880] outline-none" 
                  placeholder="Loading search…" 
                  disabled
                />
              )}
            </div>
            <p className="font-mono-dm text-[10px] text-[#B09880] uppercase tracking-[2px] mt-[16px]">Popular Destinations</p>
            <div className="mt-[10px] grid grid-cols-2 gap-[16px]">
              {DESTINATIONS.map((d) => (
                <button 
                  key={d.city} 
                  onClick={() => setDest(d)} 
                  className={`bg-white border rounded-[16px] overflow-hidden h-[96px] flex text-left transition-all relative group
                    ${dest?.city === d.city 
                      ? 'border-[#E8640C] shadow-[0_8px_20px_rgba(232,100,12,0.15)] bg-ivory/50' 
                      : 'border-[#E8D5B7] hover:border-[#E8640C]/40 hover:shadow-md'}`}
                >
                  <div className="w-[88px] h-full overflow-hidden shrink-0">
                    <img 
                      src={d.img} 
                      alt={d.city} 
                      className={`w-full h-full object-cover transition-transform duration-500 ${dest?.city === d.city ? 'scale-110' : 'group-hover:scale-105'}`} 
                    />
                  </div>
                  <div className="p-[14px_16px] flex flex-col justify-center flex-1 min-w-0">
                    <h4 className="font-display font-bold text-[17px] text-[#1E1410] leading-tight truncate">{d.city}</h4>
                    <p className="font-mono-dm text-[10px] text-[#B09880] uppercase tracking-wider mt-1">{d.state}</p>
                    <div className="mt-2 flex gap-1.5 flex-wrap">
                      {d.tags.map(t => (
                        <span key={t} className="px-1.5 py-0.5 rounded-full bg-[#FEF3E2] border border-[#E8D5B7]/50 font-mono-dm text-[9px] text-[#6B4F3A] whitespace-nowrap">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  {dest?.city === d.city && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#E8640C] flex items-center justify-center shadow-lg animate-in zoom-in-50 duration-200">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* SEC 2 — Dates */}
          <div className="mt-[32px]">
            <Label>When Are You Traveling?</Label>
            <div className="mt-[10px] flex gap-[12px]">
              <div className="flex-1">
                <p className="font-mono-dm text-[10px] text-[#B09880] uppercase mb-[6px]">Departure Date</p>
                <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="w-full h-[48px] bg-white border-[1.5px] border-[#E8D5B7] rounded-[10px] px-[14px] font-jakarta text-[15px] text-[#1E1410] focus:border-[#E8640C] focus:shadow-[0_0_0_3px_rgba(232,100,12,0.12)] outline-none" />
              </div>
              <div className="flex-1">
                <p className="font-mono-dm text-[10px] text-[#B09880] uppercase mb-[6px]">Return Date</p>
                <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className="w-full h-[48px] bg-white border-[1.5px] border-[#E8D5B7] rounded-[10px] px-[14px] font-jakarta text-[15px] text-[#1E1410] focus:border-[#E8640C] focus:shadow-[0_0_0_3px_rgba(232,100,12,0.12)] outline-none" />
              </div>
            </div>
            {days > 0 && <div className="mt-[10px] inline-flex h-[28px] items-center px-[14px] rounded-[100px] bg-[#FEF3E2] border border-[#E8640C]/30"><span className="font-mono-dm text-[11px] text-[#E8640C]">{days} Days · {days-1} Nights</span></div>}
          </div>

          {/* SEC 3 — Group & Budget */}
          <div className="mt-[28px]">
            <Label>Who Is Going?</Label>
            <div className="mt-[10px] bg-white border border-[#E8D5B7] rounded-[10px] h-[48px] px-[16px] flex items-center justify-between">
              <span className="font-jakarta text-[15px] text-[#1E1410]">Total Travelers</span>
              <div className="flex items-center gap-[16px]">
                <button onClick={() => setTravelers(Math.max(1,travelers-1))} className="w-[28px] h-[28px] rounded-full bg-[#FEF3E2] border border-[#E8D5B7] flex items-center justify-center"><Minus size={14} className="text-[#6B4F3A]" /></button>
                <span className="font-display font-bold text-[20px] text-[#1E1410] w-[24px] text-center">{travelers}</span>
                <button onClick={() => setTravelers(travelers+1)} className="w-[28px] h-[28px] rounded-full bg-[#E8640C] flex items-center justify-center"><Plus size={14} className="text-white" /></button>
              </div>
            </div>
            <div className="mt-[20px]">
              <p className="font-mono-dm text-[10px] text-[#B09880] uppercase mb-[6px]">Total Budget</p>
              <div className="bg-white border-[1.5px] border-[#E8D5B7] rounded-[10px] h-[48px] flex items-center overflow-hidden focus-within:border-[#E8640C] transition-colors">
                <span className="pl-[14px] font-cabinet font-semibold text-[16px] text-[#6B4F3A]">₹</span>
                <div className="w-px h-[20px] bg-[#E8D5B7] mx-[12px]" />
                <input type="number" value={budget} onChange={e=>setBudget(Number(e.target.value))} className="flex-1 h-full outline-none font-jakarta text-[15px] text-[#1E1410] placeholder:text-[#B09880]" placeholder="0" />
              </div>
              <input type="range" min={2000} max={100000} step={1000} value={budget} onChange={e=>setBudget(Number(e.target.value))} className="w-full mt-[12px] accent-[#E8640C]" />
              <div className="flex justify-between"><span className="font-mono-dm text-[10px] text-[#B09880]">Budget</span><span className="font-mono-dm text-[10px] text-[#B09880]">Luxury</span></div>
            </div>
          </div>

          {/* SEC 4 — Preferences */}
          <div className="mt-[28px]">
            <Label>Preferences</Label>
            <SubLabel>Stay</SubLabel>
            <div className="mt-[6px] flex flex-wrap gap-[8px]">{STAYS.map(s => <ChipRect key={s} label={s} selected={stay===s} onClick={()=>setStay(s)} />)}</div>
            <SubLabel>How You'll Travel</SubLabel>
            <div className="mt-[6px] flex flex-wrap gap-[8px]">{TRANSPORT.map(t => <ChipRect key={t} label={t} selected={transport===t} onClick={()=>setTransport(t)} />)}</div>
            <SubLabel>Dietary</SubLabel>
            <div className="mt-[6px] flex flex-wrap gap-[8px]">{DIETARY.map(d => <ChipRect key={d} label={d} selected={dietary===d} onClick={()=>setDietary(d)} />)}</div>
          </div>

          {/* SEC 5 — Interests */}
          <div className="mt-[28px]">
            <Label>What Would You Like To Do?</Label>
            <p className="font-jakarta text-[12px] text-[#B09880] mt-[4px]">Select all that apply</p>
            <div className="mt-[10px] flex flex-wrap gap-[8px]">{INTERESTS.map(i => <Chip key={i} label={i} selected={interests.includes(i)} onClick={()=>toggleInterest(i)} />)}</div>
          </div>

          {/* SEC 6 — Vibe */}
          <div className="mt-[28px]">
            <Label>What Is Your Travel Vibe?</Label>
            <div className="mt-[10px] grid grid-cols-2 gap-[12px]">
              {vibes.map(v => (
                <button key={v.name} onClick={() => setVibe(v.name)} className={`bg-white border rounded-[12px] p-[16px_18px] flex items-center gap-[12px] text-left transition-all ${vibe===v.name ? 'border-[1.5px] border-[#E8640C] bg-[rgba(232,100,12,0.04)]' : 'border-[#E8D5B7]'}`}>
                  <div className="w-[40px] h-[40px] rounded-[8px] flex items-center justify-center shrink-0" style={{background:v.tint}}><v.icon size={28} className="text-[#6B4F3A]" /></div>
                  <div><p className="font-cabinet font-semibold text-[15px] text-[#1E1410]">{v.name}</p><p className="font-jakarta text-[12px] text-[#6B4F3A] leading-[1.4]">{v.desc}</p></div>
                </button>
              ))}
            </div>
          </div>

          {/* SEC 7 — Safety */}
          <div className="mt-[28px]">
            <Label>Safety Preferences</Label>
            <div className="mt-[10px] bg-white border border-[#E8D5B7] rounded-[12px] overflow-hidden">
              {safetyRows.map((r, idx) => (
                <div key={r.label} className={`px-[20px] py-[16px] flex items-center justify-between ${idx < safetyRows.length-1 ? 'border-b border-[#E8D5B7]' : ''}`}>
                  <div className="flex items-center gap-[10px]">
                    <r.icon size={18} className="text-[#2D6A4F] shrink-0" />
                    <div><p className="font-cabinet font-semibold text-[14px] text-[#1E1410]">{r.label}</p><p className="font-jakarta text-[12px] text-[#B09880] mt-[2px]">{r.helper}</p></div>
                  </div>
                  <button onClick={() => toggleSafety(idx)} className={`w-[44px] h-[24px] rounded-full relative transition-colors ${safetyToggles[idx] ? 'bg-[#2D6A4F]' : 'bg-[#E8D5B7]'}`}>
                    <span className={`absolute top-[2px] w-[20px] h-[20px] rounded-full bg-white shadow transition-transform ${safetyToggles[idx] ? 'left-[22px]' : 'left-[2px]'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── RIGHT: LIVE PREVIEW ─── */}
        <div className="hidden lg:block flex-1 lg:ml-[96px]">
          <div className="sticky top-[72px] h-[calc(100vh-72px)] flex flex-col p-[24px]">
            {/* Real Google Map */}
            <div className={`rounded-[16px] overflow-hidden relative transition-all duration-500 border border-[#E8D5B7] ${dest ? 'h-[40%]' : 'h-[55%]'}`}>
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={mapCenter}
                  zoom={dest ? 12 : 5}
                  options={mapOptions}
                >
                  {dest && <Marker position={mapCenter} icon={{
                    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
                    fillColor: "#E8640C",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "#FFFFFF",
                    scale: 1.5,
                  }} />}
                </GoogleMap>
              ) : (
                <div className="absolute inset-0 bg-[#FEF3E2] flex items-center justify-center animate-pulse">
                  <Loader2 size={32} className="text-[#E8640C] animate-spin" />
                </div>
              )}
              
              {/* Overlay for selected destination */}
              {dest && (
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-md border border-[#E8D5B7] rounded-[12px] p-3 shadow-lg pointer-events-auto">
                    <h4 className="font-display font-bold text-[18px] text-[#1E1410] leading-tight">{dest.city}</h4>
                    <p className="font-mono-dm text-[10px] text-[#6B4F3A] uppercase mt-0.5">{dest.state}</p>
                  </div>
                </div>
              )}

              {/* frosted strip */}
              {dest && (
                <div className="absolute bottom-0 left-0 right-0 h-[72px] bg-[rgba(255,248,240,0.90)] backdrop-blur-[12px] border-t border-[rgba(232,213,183,0.50)] px-[20px] flex items-center gap-[24px] z-10">
                  {[['28','Guardians'],['1.2 km','Hospital'],['87','Safety Score']].map(([v,l]) => (
                    <div key={l}><p className="font-cabinet font-semibold text-[13px] text-[#1E1410]">{v}</p><p className="font-mono-dm text-[10px] text-[#6B4F3A]">{l}</p></div>
                  ))}
                </div>
              )}
            </div>

            {/* summary card */}
            <div className="mt-[16px] flex-1 bg-white border border-[#E8D5B7] rounded-[16px] p-[20px] shadow-[0_4px_16px_rgba(30,20,16,0.08)] overflow-y-auto">
              <p className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px]">Trip Summary</p>
              <div className="mt-[12px] flex flex-col gap-[8px]">
                {[
                  ['Destination', dest ? `${dest.city}, ${dest.state}` : '—'],
                  ['Dates', startDate && endDate ? `${startDate} → ${endDate}` : '—'],
                  ['Duration', days > 0 ? `${days} Days · ${days-1} Nights` : '—'],
                  ['Travelers', `${travelers} People`],
                  ['Budget', `₹${budget.toLocaleString('en-IN')}`],
                  ['Stay', stay],
                  ['Transport', transport],
                ].map(([label, value]) => (
                  <div key={label} className="h-[40px] bg-[#F5EDE0] rounded-[8px] px-[12px] flex items-center justify-between">
                    <span className="font-mono-dm text-[10px] text-[#B09880] uppercase">{label}</span>
                    <span className="font-cabinet font-semibold text-[13px] text-[#1E1410]">{value}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#F5EDE0] my-[12px]" />
              <p className="font-mono-dm text-[10px] text-[#B09880] uppercase">Rough Cost Breakdown</p>
              <div className="mt-[8px] flex flex-col gap-[6px]">
                {[['Accommodation','₹4,000–6,000'],['Food','₹3,000–4,500'],['Transport','₹2,500–3,500'],['Activities','₹1,500–3,000']].map(([c,a]) => (
                  <div key={c} className="flex justify-between"><span className="font-jakarta text-[13px] text-[#6B4F3A]">{c}</span><span className="font-mono-dm text-[11px] text-[#1E1410]">{a}</span></div>
                ))}
              </div>
              <div className="border-t border-[#F5EDE0] my-[12px]" />
              <div className="flex justify-between items-center">
                <span className="font-jakarta font-semibold text-[13px] text-[#1E1410]">Total estimate</span>
                <span className="font-display font-bold text-[18px] text-[#E8640C]">₹11,000–17,000</span>
              </div>
              <p className="font-jakarta text-[11px] text-[#B09880] text-center mt-[8px]">Rough estimate. Final itinerary has exact costs.</p>
            </div>

            {/* generate button */}
            <div className="mt-[16px] border-t border-[#E8D5B7] pt-[20px]">
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-[12px] font-jakarta text-red-600 leading-tight">{error}</p>
                </div>
              )}
              <button disabled={!canGenerate || generating} onClick={handleGenerate} className={`w-full h-[48px] rounded-[10px] font-cabinet font-semibold text-[14px] flex items-center justify-center gap-2 transition-all ${canGenerate && !generating ? 'bg-[#E8640C] text-white shadow-[0_4px_16px_rgba(232,100,12,0.25)] hover:brightness-105' : 'bg-[#E8D5B7] text-[#B09880] cursor-not-allowed'}`}>
                {generating ? <><Loader2 size={16} className="animate-spin" /> Building your itinerary…</> : 'Generate My Itinerary →'}
              </button>
              <p className="font-jakarta text-[11px] text-[#B09880] text-center mt-[8px]">Powered by Gemini AI · Places verified by Google Maps</p>
            </div>
          </div>
        </div>
      </div>

      {/* mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#E8D5B7] p-[20px] z-40">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3">
            <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-[12px] font-jakarta text-red-600 leading-tight">{error}</p>
          </div>
        )}
        <button disabled={!canGenerate || generating} onClick={handleGenerate} className={`w-full h-[48px] rounded-[10px] font-cabinet font-semibold text-[14px] flex items-center justify-center gap-2 ${canGenerate && !generating ? 'bg-[#E8640C] text-white shadow-[0_4px_16px_rgba(232,100,12,0.25)]' : 'bg-[#E8D5B7] text-[#B09880]'}`}>
          {generating ? <><Loader2 size={16} className="animate-spin" /> Building…</> : 'Generate My Itinerary →'}
        </button>
      </div>
    </div>
  );
}
