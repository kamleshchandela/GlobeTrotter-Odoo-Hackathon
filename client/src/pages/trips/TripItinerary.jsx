import { useState, useEffect, useMemo } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MapPin, Clock, Map as MapIcon, ChevronRight, Plus, Shield, CheckCircle2, Sun, GripVertical, AlertTriangle, Save, Download } from "lucide-react";
import TopAppBar from "../../components/shared/TopAppBar";
import { saveTrip, fetchTripById } from "../../store/tripSlice";
import toast, { Toaster } from "react-hot-toast";

const PHOTOS = {
  hero: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1440&q=80',
  patwon: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?auto=format&fit=crop&w=600&q=80',
  gadisar: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80',
};

const ACTIVITIES = [
  { time:'9:00 AM', name:'Patwon Ki Haveli', desc:'A complex of five interconnected havelis with some of the most intricate golden sandstone carvings in Rajasthan.', tags:['Heritage','₹50 entry'], photo:PHOTOS.patwon, status:'done' },
  { time:'11:30 AM', name:'Lunch at Trilogy Café', desc:'A beloved rooftop café inside the Jaisalmer Fort walls. Rajasthani thali and cold beverages with fort views.', tags:['Food','₹300–500'], status:'active' },
  { time:'2:00 PM', name:'Nathmal Ki Haveli', desc:'Built by two brothers simultaneously from opposite ends — the two halves are mirror images but not identical. A fascinating architectural curiosity.', tags:['Heritage','Free entry'], status:'upcoming' },
  { time:'4:30 PM', name:'Gadisar Lake', desc:'A man-made reservoir built in the 14th century. Camel rides at the edge, pedal boats, and the best sunset views in Jaisalmer.', tags:['Scenic','Camel ride ₹100'], photo:PHOTOS.gadisar, status:'future' },
  { time:'7:00 PM', name:'Dinner at 1st Gate Home Fusion', desc:'Rooftop restaurant just outside the fort entrance. Known for fusion Rajasthani food and live folk music on weekends.', tags:['Food','₹400–600'], status:'future' },
];

const BUDGET = [{cat:'Accommodation',amt:'₹800'},{cat:'Activities',amt:'₹200'},{cat:'Food',amt:'₹900'},{cat:'Transport',amt:'₹0'}];

export default function TripItinerary() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();
  const { currentTrip, loading } = useSelector((state) => state.trip);
  const [activeDay, setActiveDay] = useState(1);
  const [checked, setChecked] = useState({});
  const [showMiniBar, setShowMiniBar] = useState(false);

  // Performance Optimization: Memoize budget total
  const budgetTotal = useMemo(() => {
    return BUDGET.reduce((acc, curr) => {
      const val = parseInt(curr.amt.replace('₹', '')) || 0;
      return acc + val;
    }, 0);
  }, []);

  // Performance Optimization: Memoize activities filtering for the active day
  const filteredActivities = useMemo(() => {
    // In a real app, this would filter currentTrip.itinerary[activeDay]
    return ACTIVITIES;
  }, [activeDay]);

  // If currentTrip is not in Redux (e.g. page refresh), try fetching from DB
  useEffect(() => {
    if (!currentTrip && id && !loading) {
      dispatch(fetchTripById(id));
    }
  }, [currentTrip, id, loading, dispatch]);

  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!currentTrip?.location) return;
      try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(currentTrip.location)}&count=1&language=en&format=json`);
        const geoData = await geoRes.json();
        if (geoData.results && geoData.results.length > 0) {
          const { latitude, longitude } = geoData.results[0];
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,uv_index_max,sunrise,sunset&timezone=auto`);
          const wData = await weatherRes.json();
          if (wData.daily) {
            setWeatherData({
              temp: `${wData.daily.temperature_2m_max[0]}°C`,
              uv: `UV: ${wData.daily.uv_index_max[0] > 7 ? 'High' : wData.daily.uv_index_max[0] > 3 ? 'Mod' : 'Low'}`,
              sunrise: `Sunrise ${wData.daily.sunrise[0].split('T')[1]}`,
              sunset: `Sunset ${wData.daily.sunset[0].split('T')[1]}`
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch weather", err);
      }
    };
    fetchWeather();
  }, [currentTrip]);

  useEffect(() => {
    const onScroll = () => setShowMiniBar(window.scrollY > 340);
    window.addEventListener("scroll", onScroll, {passive:true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleCheck = (i) => setChecked(p => ({...p, [i]: !p[i]}));

  const handleSaveTrip = () => {
    dispatch(saveTrip(currentTrip))
      .unwrap()
      .then(() => toast.success("Trip saved successfully!"))
      .catch((err) => toast.error(err || "Failed to save trip"));
  };

  const downloadPDF = () => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageW = doc.internal.pageSize.getWidth();
      const margin = 15;
      const usable = pageW - margin * 2;
      let y = margin;

      const checkPage = (needed = 12) => {
        if (y + needed > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }
      };

      const addLine = (text, size, style = 'normal', color = [30, 20, 16]) => {
        doc.setFontSize(size);
        doc.setFont('helvetica', style);
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(text, usable);
        checkPage(lines.length * size * 0.45);
        doc.text(lines, margin, y);
        y += lines.length * size * 0.45 + 2;
      };

      // Title
      addLine(currentTrip.tripTitle || 'My Itinerary', 22, 'bold', [232, 100, 12]);
      addLine(currentTrip.location || '', 11, 'normal', [107, 79, 58]);
      y += 2;

      // Overview
      if (currentTrip.overview) {
        addLine(currentTrip.overview, 10, 'italic', [107, 79, 58]);
        y += 4;
      }

      // Each Day
      currentTrip.dailyItinerary.forEach(day => {
        checkPage(20);
        doc.setDrawColor(232, 100, 12);
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageW - margin, y);
        y += 6;

        addLine(`Day ${day.day} — ${day.theme}`, 14, 'bold', [30, 20, 16]);
        y += 2;

        // Activities
        day.activities.forEach((a, i) => {
          checkPage(30);
          addLine(`${a.time}  •  ${a.activity}`, 11, 'bold', [30, 20, 16]);
          if (a.location) addLine(`📍 ${a.location}`, 9, 'normal', [232, 100, 12]);
          if (a.description) addLine(a.description, 9, 'normal', [80, 70, 60]);
          y += 3;
        });

        // Safety Notes
        if (day.safetyNotes) {
          checkPage(16);
          addLine('⚠️ Safety Notes', 10, 'bold', [192, 57, 43]);
          addLine(day.safetyNotes, 9, 'normal', [80, 70, 60]);
          y += 3;
        }

        // Food Suggestions
        if (day.foodSuggestions?.length) {
          checkPage(14);
          addLine('🍽️ Food Suggestions', 10, 'bold', [45, 106, 79]);
          day.foodSuggestions.forEach(f => addLine(`  • ${f}`, 9, 'normal', [80, 70, 60]));
          y += 4;
        }
      });

      // Budget
      if (currentTrip.estimatedCosts) {
        checkPage(30);
        doc.setDrawColor(232, 100, 12);
        doc.line(margin, y, pageW - margin, y);
        y += 6;
        addLine('Estimated Budget', 14, 'bold', [30, 20, 16]);
        if (currentTrip.estimatedCosts.breakdown) {
          Object.entries(currentTrip.estimatedCosts.breakdown).forEach(([cat, amt]) => {
            addLine(`${cat.charAt(0).toUpperCase() + cat.slice(1)}: ${amt}`, 10, 'normal', [80, 70, 60]);
          });
        }
        addLine(`Total: ${currentTrip.estimatedCosts.total}`, 12, 'bold', [232, 100, 12]);
        y += 4;
      }

      // Packing List
      if (currentTrip.essentialPacking?.length) {
        checkPage(20);
        addLine('Essential Packing', 14, 'bold', [30, 20, 16]);
        currentTrip.essentialPacking.forEach(item => addLine(`  ✓ ${item}`, 9, 'normal', [80, 70, 60]));
      }

      // Footer
      checkPage(12);
      y += 6;
      addLine(`Generated by My Itinerary — ${new Date().toLocaleDateString()}`, 8, 'italic', [176, 152, 128]);

      doc.save(`${(currentTrip.location || 'Trip').replace(/[^a-zA-Z0-9]/g, '_')}_Itinerary.pdf`);
      toast.success("PDF downloaded successfully!");
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E8640C] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 font-cabinet font-bold text-[#1E1410]">Gemini is perfecting your itinerary...</p>
        </div>
      </div>
    );
  }

  if (!currentTrip) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="text-center p-8 bg-white border border-[#E8D5B7] rounded-2xl shadow-xl max-w-md">
          <AlertTriangle size={48} className="text-[#E8640C] mx-auto mb-4" />
          <h2 className="font-display font-bold text-2xl text-[#1E1410]">No Trip Found</h2>
          <p className="font-jakarta text-[#6B4F3A] mt-2 mb-6">Looks like you haven't generated an itinerary yet.</p>
          <Link to="/trips/new" className="inline-flex h-12 px-8 items-center justify-center bg-[#E8640C] text-white rounded-xl font-cabinet font-bold">Start Planning</Link>
        </div>
      </div>
    );
  }

  const dayData = currentTrip.dailyItinerary.find(d => d.day === activeDay) || currentTrip.dailyItinerary[0];

  const heroPhoto = currentTrip?.dailyItinerary?.[0]?.activities?.[0]?.photoUrl || PHOTOS.hero;

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <Toaster />
      <TopAppBar variant="logo" />

      {/* Sticky Mini-Bar */}
      <div className={`fixed top-[64px] left-0 right-0 h-[48px] bg-white border-b border-[#E8D5B7] z-40 transition-transform duration-300 ${showMiniBar ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-[1200px] mx-auto h-full px-[24px] flex items-center justify-between">
          <div className="flex items-center gap-[16px]">
            <span className="font-cabinet font-bold text-[15px] text-[#1E1410]">{currentTrip.tripTitle}</span>
            <span className="font-mono-dm text-[11px] text-[#B09880]">Day {activeDay} of {currentTrip.dailyItinerary.length}</span>
          </div>
          <Link to={location.pathname.replace('itinerary', 'map')} className="font-cabinet font-semibold text-[13px] text-[#E8640C]">View Map</Link>
        </div>
      </div>

      {/* ZONE 1 — Hero */}
      <div className="w-full h-[340px] relative">
        <img src={heroPhoto} alt={currentTrip.tripTitle} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{background:'linear-gradient(180deg, transparent 30%, rgba(20,14,10,0.75) 100%)'}} />
        <div className="absolute top-[20px] left-[20px] h-[24px] px-[14px] flex items-center rounded-[100px] bg-white/[0.18] border border-white/30">
          <span className="font-mono-dm text-[10px] text-white uppercase tracking-wider">Active Trip</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-[1200px] mx-auto px-[48px] pb-[40px] flex items-end justify-between">
            <div>
              <p className="font-mono-dm text-[12px] text-white/60 uppercase tracking-[2px]">Day {activeDay} of {currentTrip.dailyItinerary.length}</p>
              <h1 className="font-display font-extrabold text-[44px] text-white leading-none mt-[4px]">{currentTrip.tripTitle}</h1>
              <p className="font-mono-dm text-[12px] text-white/60 mt-[8px]">{currentTrip.overview}</p>
            </div>
            <div className="bg-white/[0.15] backdrop-blur-[8px] border border-white/25 rounded-[100px] px-[16px] py-[8px]">
              <span className="font-cabinet font-bold text-[14px] text-white">Day {activeDay} / {currentTrip.dailyItinerary.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ZONE 2 — Stats Bar */}
      <div className="max-w-[1200px] mx-auto px-[24px]">
        <div className="bg-white border border-[#E8D5B7] rounded-[14px] min-h-[64px] py-[12px] px-[24px] flex items-center -mt-[24px] relative z-10 shadow-[0_4px_16px_rgba(30,20,16,0.10)]">
          {[{val:currentTrip.dailyItinerary.length,label:'Days'},{val:currentTrip.estimatedCosts.total,label:'Est. Budget'},{val:currentTrip.essentialPacking.length,label:'Packing Items'},{val:'87',label:'Safety Score',green:true}].map((s,i,arr) => (
            <div key={s.label} className={`flex-1 flex flex-col items-center justify-center ${i < arr.length-1 ? 'border-r border-[#F5EDE0]' : ''}`}>
              <span className={`font-display font-bold text-[18px] lg:text-[22px] leading-none ${s.green ? 'text-[#2D6A4F]' : 'text-[#1E1410]'}`}>{s.val}</span>
              <span className="font-mono-dm text-[10px] text-[#B09880] uppercase mt-[2px]">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ZONE 3 — Day Tabs + Weather + Content */}
      <div className="max-w-[1200px] mx-auto px-[24px] mt-[28px] pb-[80px]">
        {/* Day Tabs */}
        <div className="flex gap-[8px] overflow-x-auto scrollbar-none">
          {currentTrip.dailyItinerary.map(d => (
            <button key={d.day} onClick={() => setActiveDay(d.day)} className={`h-[38px] px-[20px] rounded-[100px] font-cabinet font-medium text-[13px] transition-colors shrink-0 ${activeDay === d.day ? 'bg-[#E8640C] text-white' : d.day < activeDay ? 'bg-[#2D6A4F] text-white' : 'bg-white border border-[#E8D5B7] text-[#6B4F3A]'}`}>
              {d.day < activeDay && <CheckCircle2 size={12} className="inline mr-1" />}Day {d.day}
            </button>
          ))}
        </div>

        {/* Weather Strip */}
        {weatherData && (
          <div className="mt-[10px] h-[36px] bg-[#FEF3E2] border border-[#E8D5B7] rounded-[8px] px-[16px] flex items-center gap-[16px]">
            <Sun size={14} className="text-[#F0A500]" fill="currentColor" />
            {[weatherData.temp, weatherData.uv, weatherData.sunrise, weatherData.sunset].map((t, i) => <span key={i} className="font-mono-dm text-[10px] text-[#6B4F3A]">{t}</span>)}
          </div>
        )}

        {/* Two-column layout */}
        <div id="itinerary-content" className="flex flex-col lg:flex-row gap-[48px] mt-[48px]">
          {/* LEFT — Timeline */}
          <div className="flex-1 min-w-0">
            <p className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px]">Day {activeDay} — {dayData.theme}</p>
            <div className="mt-[20px] relative">
              {/* Rail */}
              <div className="absolute left-[11px] top-[6px] bottom-0 w-[2px] bg-[#E8D5B7]" />

              {dayData.activities.map((a, i) => {
                const isDone = checked[`${activeDay}-${i}`];
                return (
                  <div key={i} className="relative pl-[40px] mb-[16px] group">
                    {/* Node */}
                    <div className={`absolute left-0 top-[18px] z-10 flex items-center justify-center w-[12px] h-[12px]`}>
                      {isDone ? (
                        <div className="w-[12px] h-[12px] rounded-full bg-[#2D6A4F] flex items-center justify-center"><CheckCircle2 size={8} className="text-white" /></div>
                      ) : (
                        <div className="w-[12px] h-[12px] rounded-full bg-white border-[2px] border-[#E8D5B7]" />
                      )}
                    </div>
                    {/* Card */}
                    <div className={`bg-white border border-[#E8D5B7] rounded-[12px] overflow-hidden shadow-[0_2px_8px_rgba(30,20,16,0.06)] flex flex-col md:flex-row ${isDone ? 'opacity-60' : ''}`}>
                      {a.photoUrl && (
                        <div className="w-full md:w-[140px] h-[100px] shrink-0">
                          <img src={a.photoUrl} alt={a.activity} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-[16px] flex-1">
                        <div className="flex items-center justify-between">
                           <span className="font-mono-dm text-[11px] text-[#B09880]">{a.time}</span>
                           <button onClick={() => toggleCheck(`${activeDay}-${i}`)} className={`w-[20px] h-[20px] rounded-[4px] border-[1.5px] flex items-center justify-center transition-colors ${isDone ? 'bg-[#2D6A4F] border-[#2D6A4F]' : 'border-[#E8D5B7] hover:border-[#E8640C]'}`}>
                             {isDone && <CheckCircle2 size={12} className="text-white" />}
                           </button>
                        </div>
                        <h4 className="font-cabinet font-semibold text-[16px] text-[#1E1410] mt-[6px]">{a.activity}</h4>
                        <div className="flex items-center gap-1">
                          <MapPin size={10} className="text-[#E8640C]" />
                          <p className="font-mono-dm text-[10px] text-[#E8640C] uppercase tracking-tight truncate">{a.location}</p>
                        </div>
                        <p className="font-jakarta text-[13px] text-[#6B4F3A] leading-[1.5] mt-[6px]">{a.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT — Day Sidebar */}
          <div className="w-full lg:w-[320px] lg:sticky lg:top-[96px] self-start flex flex-col gap-[16px]">
            {/* Safety */}
            <div className="bg-[rgba(45,106,79,0.07)] border border-[rgba(45,106,79,0.20)] rounded-[12px] p-[16px]">
              <p className="font-mono-dm text-[10px] text-[#2D6A4F] uppercase tracking-[2px]">Day {activeDay} Safety</p>
              <div className="mt-[10px] flex flex-col gap-[8px]">
                <div className="flex items-start gap-[8px]">
                  <CheckCircle2 size={14} className="text-[#2D6A4F] shrink-0 mt-0.5" />
                  <span className="font-jakarta text-[13px] text-[#1E1410]">{dayData.safetyNotes}</span>
                </div>
              </div>
            </div>
            {/* Food */}
            <div className="bg-white border border-[#E8D5B7] rounded-[12px] p-[16px]">
              <p className="font-mono-dm text-[10px] text-[#B09880] uppercase tracking-[2px]">Food Suggestions</p>
              <div className="mt-[10px] flex flex-col gap-[6px]">
                {dayData.foodSuggestions.map(f => (
                  <div key={f} className="flex items-center gap-[8px]"><Sun size={12} className="text-[#F0A500]" /><span className="font-jakarta text-[13px] text-[#1E1410]">{f}</span></div>
                ))}
              </div>
            </div>
            {/* Budget */}
            <div className="bg-white border border-[#E8D5B7] rounded-[12px] p-[16px]">
              <p className="font-mono-dm text-[10px] text-[#B09880] uppercase tracking-[2px]">Estimated Budget</p>
              <div className="mt-[10px] flex flex-col">
                {Object.entries(currentTrip.estimatedCosts.breakdown).map(([cat, amt]) => (
                  <div key={cat} className="flex justify-between py-[6px]">
                    <span className="font-jakarta text-[13px] text-[#6B4F3A] capitalize">{cat}</span>
                    <span className="font-mono-dm text-[11px] text-[#1E1410]">{amt}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#F5EDE0] mt-[6px] pt-[10px] flex justify-between items-center">
                <span className="font-cabinet font-semibold text-[14px] text-[#1E1410]">Est. Total</span>
                <span className="font-display font-bold text-[18px] text-[#E8640C]">{currentTrip.estimatedCosts.total}</span>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="flex flex-col gap-[8px]">
              {!currentTrip._id && (
                <button onClick={handleSaveTrip} className="w-full h-[42px] rounded-[10px] bg-[#E8640C] text-white font-cabinet font-semibold text-[13px] flex items-center justify-center gap-[6px]"><Save size={14} /> Save Trip</button>
              )}
              <Link to={location.pathname.replace('itinerary', 'map')} className="w-full h-[42px] rounded-[10px] bg-white border-[1.5px] border-[#E8640C] text-[#E8640C] font-cabinet font-semibold text-[13px] flex items-center justify-center gap-[6px]"><MapIcon size={14} /> View on Map</Link>
              <button onClick={downloadPDF} className="w-full h-[42px] rounded-[10px] bg-white border border-[#E8D5B7] text-[#6B4F3A] font-cabinet font-semibold text-[13px] flex items-center justify-center gap-[6px]"><Download size={14} /> Download PDF</button>
              <Link to="/safety/sos" className="w-full h-[42px] rounded-[10px] bg-[#C0392B] text-white font-cabinet font-semibold text-[13px] flex items-center justify-center gap-[6px]"><Shield size={14} /> SOS</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
