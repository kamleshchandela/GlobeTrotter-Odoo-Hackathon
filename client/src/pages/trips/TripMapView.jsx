import { useState, useMemo, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MapPin, X, ChevronRight, Shield, Star, Navigation, Bookmark, Loader2, PlusSquare, Sparkles, Route } from "lucide-react";
import TopAppBar from "../../components/shared/TopAppBar";
import { fetchTripById } from "../../store/tripSlice";
import toast, { Toaster } from "react-hot-toast";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom Leaflet Icons
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.2);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};
const activityIcon = createCustomIcon('#E8640C');
const hospitalIcon = createCustomIcon('#C0392B');
const guardianIcon = createCustomIcon('#2D6A4F');
const gemIcon = createCustomIcon('#F0A500');

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14, { duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function TripMapView() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();
  const { currentTrip, loading } = useSelector((state) => state.trip);
  const [activeDay, setActiveDay] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showGuardian, setShowGuardian] = useState(false);
  const [toggles, setToggles] = useState([true, true, true, false, true]);

  // If currentTrip is not in Redux (e.g. page refresh), try fetching from DB
  useEffect(() => {
    if (!currentTrip && id && !loading) {
      dispatch(fetchTripById(id));
    }
  }, [currentTrip, id, loading, dispatch]);

  const dayData = useMemo(() => {
    if (!currentTrip) return null;
    return currentTrip.dailyItinerary.find(d => d.day === activeDay) || currentTrip.dailyItinerary[0];
  }, [currentTrip, activeDay]);

  const center = useMemo(() => {
    if (selectedActivity && selectedActivity.lat && selectedActivity.lng) {
      return { lat: selectedActivity.lat, lng: selectedActivity.lng };
    }
    if (dayData && dayData.activities.length > 0) {
      const first = dayData.activities.find(a => a.lat && a.lng);
      if (first) return { lat: first.lat, lng: first.lng };
    }
    return { lat: 20.5937, lng: 78.9629 };
  }, [dayData, selectedActivity]);

  const toggle = (i) => setToggles(p => p.map((v, j) => j === i ? !v : v));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#E8640C] mx-auto" />
          <p className="mt-4 font-cabinet font-bold text-[#1E1410]">Loading your trip...</p>
        </div>
      </div>
    );
  }

  if (!currentTrip) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center">
        <div className="text-center p-8 bg-white border border-[#E8D5B7] rounded-2xl shadow-xl max-w-md">
          <MapPin size={48} className="text-[#E8640C] mx-auto mb-4" />
          <h2 className="font-display font-bold text-2xl text-[#1E1410]">No Trip Selected</h2>
          <p className="font-jakarta text-[#6B4F3A] mt-2 mb-6">Generate an itinerary first, then come back to view it on the map.</p>
          <Link to="/trips/new" className="inline-flex h-12 px-8 items-center justify-center bg-[#E8640C] text-white rounded-xl font-cabinet font-bold">Start Planning</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#FFF8F0]">
      <Toaster position="bottom-center" />
      <TopAppBar variant="logo" />

      {/* Map Area */}
      <div className="flex-1 relative">
        {/* Map Header Indicator */}
        <div className="absolute top-4 left-[360px] z-30 flex items-center bg-white/90 backdrop-blur-md border border-[#E8D5B7] rounded-full px-4 py-1.5 shadow-md">
          <span className="font-cabinet font-semibold text-[12px] text-[#E8640C] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
            OpenStreetMap Interactive Engine
          </span>
        </div>

        <MapContainer
          key="leaflet-map"
          center={[center.lat, center.lng]}
          zoom={14}
          style={{ width: '100%', height: '100%', zIndex: 0 }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <MapUpdater center={[center.lat, center.lng]} />

          {/* Activities (index 0) */}
          {toggles[0] && dayData?.activities.map((a, i) => (
            a.lat && a.lng ? (
              <Marker key={`activity-${i}`} position={[a.lat, a.lng]} icon={activityIcon}>
                <Popup className="custom-popup">
                  <div className="font-cabinet font-semibold text-[#1E1410]">{a.activity}</div>
                  <div className="font-mono-dm text-[10px] text-[#6B4F3A] mt-1">{a.time}</div>
                </Popup>
              </Marker>
            ) : null
          ))}

          {/* Route (index 4) */}
          {toggles[4] && dayData?.activities.map((a, i) => {
            if (dayData.activities[i+1] && a.lat && a.lng && dayData.activities[i+1].lat && dayData.activities[i+1].lng) {
              return (
                <Polyline 
                  key={`route-${i}`} 
                  positions={[[a.lat, a.lng], [dayData.activities[i+1].lat, dayData.activities[i+1].lng]]} 
                  color="#E8640C" 
                  weight={4} 
                  dashArray="8, 8" 
                />
              );
            }
            return null;
          })}

          {/* Mock Hospitals (index 1) */}
          {toggles[1] && (
            <Marker position={[center.lat + 0.005, center.lng - 0.005]} icon={hospitalIcon}>
              <Popup><div className="font-cabinet font-semibold text-[#1E1410]">City Hospital (Mock)</div></Popup>
            </Marker>
          )}

          {/* Mock Guardians (index 2) */}
          {toggles[2] && (
            <Marker position={[center.lat - 0.003, center.lng + 0.004]} icon={guardianIcon}>
              <Popup><div className="font-cabinet font-semibold text-[#1E1410]">Verified Guardian (Mock)</div></Popup>
            </Marker>
          )}

          {/* Mock Hidden Gems (index 3) */}
          {toggles[3] && (
            <Marker position={[center.lat + 0.008, center.lng + 0.006]} icon={gemIcon}>
              <Popup><div className="font-cabinet font-semibold text-[#1E1410]">Local Cafe (Hidden Gem)</div></Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Map Layer Controls — Top Right */}
        <div className="absolute top-[16px] right-[16px] bg-white border border-[#E8D5B7] rounded-[12px] p-[8px] shadow-[0_4px_16px_rgba(30,20,16,0.12)] flex flex-col gap-[6px] z-20">
          {[
            { label: 'Activities', color: '#E8640C', icon: MapPin },
            { label: 'Hospitals', color: '#C0392B', icon: PlusSquare },
            { label: 'Guardians', color: '#2D6A4F', icon: Shield },
            { label: 'Hidden Gems', color: '#F0A500', icon: Sparkles },
            { label: 'Route', color: '#E8640C', icon: Route },
          ].map((t, i) => {
            const Icon = t.icon;
            return (
              <button key={t.label} onClick={() => toggle(i)} title={t.label} className={`w-[44px] h-[44px] rounded-[10px] flex items-center justify-center transition-all duration-300 ${toggles[i] ? 'shadow-inner' : 'border border-[#E8D5B7] bg-white hover:bg-[#F5EDE0]'}`} style={toggles[i] ? { background: `${t.color}22` } : {}}>
                <Icon size={20} color={toggles[i] ? t.color : '#B09880'} />
              </button>
            );
          })}
        </div>

        {/* Left Panel — Activity List */}
        <div className="absolute top-[16px] left-[16px] w-[340px] bg-white border border-[#E8D5B7] rounded-[16px] shadow-[0_8px_24px_rgba(30,20,16,0.14)] z-20 max-h-[calc(100vh-104px)] overflow-y-auto">
          {/* Header */}
          <div className="px-[20px] py-[16px] border-b border-[#E8D5B7] sticky top-0 bg-white z-10">
            <div className="flex items-center justify-between">
              <p className="font-mono-dm text-[10px] text-[#B09880] uppercase tracking-[2px] truncate pr-2">{currentTrip.tripTitle} — Day {activeDay}</p>
              <Link to={location.pathname.replace('map', 'itinerary')} className="font-cabinet font-semibold text-[11px] text-[#E8640C] shrink-0 border border-[#E8640C] rounded-full px-2 py-1 hover:bg-[#E8640C] hover:text-white transition-colors">Back to Itinerary</Link>
            </div>
            <div className="mt-[10px] flex gap-[6px] overflow-x-auto no-scrollbar">
              {currentTrip.dailyItinerary.map(d => (
                <button key={d.day} onClick={() => setActiveDay(d.day)} className={`h-[28px] px-[16px] rounded-[100px] font-cabinet font-medium text-[12px] transition-colors shrink-0 ${activeDay === d.day ? 'bg-[#E8640C] text-white' : 'bg-[#FEF3E2] text-[#6B4F3A]'}`}>Day {d.day}</button>
              ))}
            </div>
          </div>
          {/* Activity Rows */}
          {dayData?.activities.map((a, i) => (
            <button key={i} onClick={() => setSelectedActivity(a)} className={`w-full px-[20px] py-[12px] border-b border-[#F5EDE0] flex items-center gap-[12px] text-left hover:bg-[#FEF3E2] transition-colors ${selectedActivity === a ? 'bg-[#FEF3E2] border-l-[3px] border-l-[#E8640C]' : ''}`}>
              <div className={`w-[16px] h-[16px] rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold ${selectedActivity === a ? 'bg-[#E8640C] text-white' : 'bg-[#E8D5B7] text-[#6B4F3A]'}`}>{i + 1}</div>
              <div className="flex-1 min-w-0">
                <p className="font-mono-dm text-[10px] text-[#B09880]">{a.time}</p>
                <p className="font-cabinet font-semibold text-[14px] text-[#1E1410] truncate">{a.activity}</p>
              </div>
              <ChevronRight size={14} className="text-[#B09880] shrink-0" />
            </button>
          ))}
        </div>

        {/* Activity Detail Card — Bottom Center */}
        {selectedActivity && (
          <div className="absolute bottom-[24px] left-1/2 -translate-x-1/2 w-[480px] bg-white border border-[#E8D5B7] rounded-[14px] shadow-[0_8px_32px_rgba(30,20,16,0.16)] overflow-hidden z-30 animate-in slide-in-from-bottom-5">
            <button onClick={() => setSelectedActivity(null)} className="absolute top-[12px] right-[12px] z-10 w-[28px] h-[28px] rounded-full bg-white/80 flex items-center justify-center"><X size={14} className="text-[#B09880]" /></button>
            {selectedActivity.photoUrl ? (
              <img src={selectedActivity.photoUrl} alt={selectedActivity.activity} className="w-full h-[120px] object-cover" />
            ) : (
              <div className="w-full h-[120px] bg-[#F5EDE0] flex items-center justify-center text-[#B09880] font-mono-dm text-[12px]">No image available</div>
            )}
            <div className="p-[16px]">
              <div className="flex items-center gap-[8px]">
                <span className="font-mono-dm text-[10px] text-[#B09880]">{selectedActivity.time}</span>
                <span className="px-[6px] py-[2px] rounded bg-[#FEF3E2] border border-[#E8D5B7] font-mono-dm text-[9px] text-[#6B4F3A] uppercase">{selectedActivity.location}</span>
              </div>
              <h3 className="font-cabinet font-bold text-[18px] text-[#1E1410] mt-[6px]">{selectedActivity.activity}</h3>
              <p className="font-jakarta text-[13px] text-[#6B4F3A] line-clamp-2 mt-[6px]">{selectedActivity.description}</p>
              <div className="mt-[12px] flex gap-[10px]">
                <button onClick={() => window.open(`https://www.openstreetmap.org/?mlat=${selectedActivity.lat || center.lat}&mlon=${selectedActivity.lng || center.lng}#map=16/${selectedActivity.lat || center.lat}/${selectedActivity.lng || center.lng}`, '_blank')} className="flex-1 h-[40px] rounded-[10px] border-[1.5px] border-[#E8640C] text-[#E8640C] font-cabinet font-semibold text-[13px] flex items-center justify-center gap-[6px]"><Navigation size={14} /> Open in OSM</button>
                <button onClick={() => toast.success(`${selectedActivity.activity} saved to your collection!`)} className="flex-1 h-[40px] rounded-[10px] bg-[#E8640C] text-white font-cabinet font-semibold text-[13px] flex items-center justify-center gap-[6px]"><Bookmark size={14} /> Add to Saved</button>
              </div>
            </div>
          </div>
        )}

        {/* Guardian Card Placeholder */}
        {showGuardian && (
          <div className="absolute bottom-[24px] right-[24px] w-[320px] bg-white border border-[rgba(45,106,79,0.30)] rounded-[14px] p-[16px] shadow-[0_8px_24px_rgba(30,20,16,0.14)] z-30">
            <button onClick={() => setShowGuardian(false)} className="absolute top-[12px] right-[12px] w-[24px] h-[24px] rounded-full bg-[#F5EDE0] flex items-center justify-center"><X size={12} className="text-[#B09880]" /></button>
            <p className="font-mono-dm text-[10px] text-[#2D6A4F] uppercase tracking-[2px]">Verified Guardian</p>
            <div className="mt-[12px] flex items-center gap-[12px]">
              <div className="w-[44px] h-[44px] rounded-full bg-[rgba(45,106,79,0.10)] flex items-center justify-center shrink-0"><span className="font-cabinet font-semibold text-[16px] text-[#2D6A4F]">AG</span></div>
              <div>
                <p className="font-cabinet font-semibold text-[15px] text-[#1E1410]">Anjali Gupta</p>
                <div className="flex items-center gap-[4px] mt-[2px]">
                  {[1, 2, 3].map(s => <Star key={s} size={10} className="text-[#F0A500]" fill="currentColor" />)}
                  <span className="font-mono-dm text-[10px] text-[#6B4F3A] ml-[4px]">4.9</span>
                  <span className="font-mono-dm text-[10px] text-[#4ADE80] ml-[8px]">Available now</span>
                </div>
              </div>
            </div>
            <button className="mt-[12px] w-full h-[42px] rounded-[10px] bg-[#2D6A4F] text-white font-cabinet font-semibold text-[13px] flex items-center justify-center gap-[6px]"><Shield size={14} /> Request Guardian</button>
          </div>
        )}
      </div>
    </div>
  );
}
