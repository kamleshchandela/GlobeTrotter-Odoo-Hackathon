import { useState, useMemo, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MapPin, X, ChevronRight, Shield, Star, Navigation, Bookmark, Loader2 } from "lucide-react";
import { GoogleMap, useJsApiLoader, Marker, Polyline } from "@react-google-maps/api";
import TopAppBar from "../../components/shared/TopAppBar";
import { GOOGLE_MAPS_API_KEY } from "../../config/env";
import { fetchTripById } from "../../store/tripSlice";
import toast, { Toaster } from "react-hot-toast";

const LIBRARIES = ['places', 'geometry'];

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
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

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES
  });

  const dayData = useMemo(() => {
    if (!currentTrip) return null;
    return currentTrip.dailyItinerary.find(d => d.day === activeDay) || currentTrip.dailyItinerary[0];
  }, [currentTrip, activeDay]);

  const center = useMemo(() => {
    if (dayData && dayData.activities.length > 0) {
      const first = dayData.activities.find(a => a.lat);
      if (first) return { lat: first.lat, lng: first.lng };
    }
    return { lat: 20.5937, lng: 78.9629 };
  }, [dayData]);

  const polylines = useMemo(() => {
    if (!dayData || !window.google) return [];
    const lines = [];
    dayData.activities.forEach(a => {
      if (a.nextActivityRoute && a.nextActivityRoute.polyline) {
        try {
          lines.push(window.google.maps.geometry.encoding.decodePath(a.nextActivityRoute.polyline));
        } catch (e) {
          console.error("Polyline decode error", e);
        }
      }
    });
    return lines;
  }, [dayData, isLoaded]);

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
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={13}
            options={mapOptions}
          >
            {/* Activity Markers */}
            {toggles[0] && dayData?.activities.map((a, i) => (
              a.lat && (
                <Marker
                  key={i}
                  position={{ lat: a.lat, lng: a.lng }}
                  label={(i + 1).toString()}
                  onClick={() => setSelectedActivity(a)}
                  icon={{
                    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
                    fillColor: "#E8640C",
                    fillOpacity: 1,
                    strokeWeight: 1,
                    strokeColor: "#FFFFFF",
                    scale: 1.2,
                    labelOrigin: { x: 12, y: 10 }
                  }}
                />
              )
            ))}

            {/* Decoded Polylines between activities */}
            {toggles[4] && polylines.map((path, idx) => (
              <Polyline
                key={idx}
                path={path}
                options={{
                  strokeColor: "#E8640C",
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                }}
              />
            ))}
            
            {/* Fallback straight line if no polylines decoded */}
            {toggles[4] && polylines.length === 0 && dayData && (
              <Polyline
                path={dayData.activities.filter(a => a.lat).map(a => ({ lat: a.lat, lng: a.lng }))}
                options={{
                  strokeColor: "#E8640C",
                  strokeOpacity: 0.5,
                  strokeWeight: 2,
                  icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 4 }, offset: '0', repeat: '20px' }]
                }}
              />
            )}
          </GoogleMap>
        ) : (
          <div className="absolute inset-0 bg-[#FEF3E2] flex items-center justify-center">
            <Loader2 className="animate-spin text-[#E8640C]" size={48} />
          </div>
        )}

        {/* Map Controls — Top Right */}
        <div className="absolute top-[16px] right-[16px] bg-white border border-[#E8D5B7] rounded-[12px] p-[8px] shadow-[0_4px_16px_rgba(30,20,16,0.12)] flex flex-col gap-[6px] z-20">
          {[
            { label: 'Activities', color: '#E8640C' },
            { label: 'Hospitals', color: '#C0392B' },
            { label: 'Guardians', color: '#2D6A4F' },
            { label: 'Hidden Gems', color: '#F0A500' },
            { label: 'Route', color: '#E8640C' },
          ].map((t, i) => (
            <button key={t.label} onClick={() => toggle(i)} title={t.label} className={`w-[36px] h-[36px] rounded-[8px] flex items-center justify-center transition-colors ${toggles[i] ? '' : 'border border-[#E8D5B7]'}`} style={toggles[i] ? { background: `${t.color}22` } : {}}>
              <div className="w-[10px] h-[10px] rounded-full" style={{ background: t.color }} />
            </button>
          ))}
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
                <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedActivity.lat},${selectedActivity.lng}`, '_blank')} className="flex-1 h-[40px] rounded-[10px] border-[1.5px] border-[#E8640C] text-[#E8640C] font-cabinet font-semibold text-[13px] flex items-center justify-center gap-[6px]"><Navigation size={14} /> Get Directions</button>
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
