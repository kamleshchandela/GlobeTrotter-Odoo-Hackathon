import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { 
  X, Calendar, Clock, DollarSign, MapPin, ChevronLeft, ChevronRight, 
  SlidersHorizontal, Sparkles, Star, Plus, Shield, CheckCircle2, ArrowRight,
  TrendingUp, Trash2, Edit3, Compass, Plane, Hotel, Coffee, Utensils, AlertTriangle, Play,
  HelpCircle, Loader2
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { fetchTrips, saveTrip } from "../../store/tripSlice";
import { API_BASE_URL } from "../../config/env";
import { setCalendarOpen } from "../../store/uiSlice";

const EVENT_TYPES = {
  activity: { label: "Activity", icon: Star, color: "border-saffron bg-[#FFF8F0] text-saffron" },
  transport: { label: "Transport", icon: Plane, color: "border-banyan bg-[#FEF3E2] text-banyan" },
  hotel: { label: "Hotel", icon: Hotel, color: "border-violet-400 bg-violet-50/50 text-violet-600" },
  meal: { label: "Meal", icon: Utensils, color: "border-[#4D908E] bg-[#4D908E]/5 text-[#4D908E]" },
  free: { label: "Free Time", icon: Coffee, color: "border-taupe/40 bg-ivory text-taupe" }
};

export default function TravelCalendar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { trips, loading } = useSelector((state) => state.trip);

  // Calendar Workspace states
  const [selectedTripId, setSelectedTripId] = useState("all");
  const [currentView, setCurrentView] = useState("month"); // month, week, timeline, day
  const [viewDate, setViewDate] = useState(new Date(2026, 7, 1)); // Default to August 2026 for demo
  const [activeDayIndex, setActiveDayIndex] = useState(1);
  
  // Dialog/Editor states
  const [editingEvent, setEditingEvent] = useState(null);
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addDayTarget, setAddDayTarget] = useState(1);

  // New Event Form State
  const [eventForm, setEventForm] = useState({
    time: "10:00 AM",
    activity: "",
    description: "",
    location: "",
    cost: "",
    type: "activity"
  });

  // Load trips on mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchTrips());
    }
  }, [isAuthenticated, dispatch]);

  // Lock body scroll when calendar overlay is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Selected Trip object
  const activeTrip = useMemo(() => {
    if (selectedTripId === "all") return null;
    return trips.find(t => t._id === selectedTripId) || null;
  }, [trips, selectedTripId]);

  // Sync active day
  useEffect(() => {
    if (activeTrip && activeTrip.dailyItinerary?.length > 0) {
      setActiveDayIndex(1);
      if (activeTrip.startDate) {
        setViewDate(new Date(activeTrip.startDate));
      }
    }
  }, [selectedTripId, activeTrip]);

  // Transform Trip data to linear calendar events
  const calendarEvents = useMemo(() => {
    const eventsList = [];
    const targetTrips = activeTrip ? [activeTrip] : trips;

    targetTrips.forEach(trip => {
      if (!trip.dailyItinerary) return;
      
      const baseDate = trip.startDate ? new Date(trip.startDate) : new Date(2026, 7, 3);

      trip.dailyItinerary.forEach(day => {
        const dayOffset = day.day - 1;
        const eventDate = new Date(baseDate);
        eventDate.setDate(baseDate.getDate() + dayOffset);

        if (day.activities) {
          day.activities.forEach((act, actIndex) => {
            let deducedType = "activity";
            const nameLower = act.activity.toLowerCase();
            if (nameLower.includes("flight") || nameLower.includes("train") || nameLower.includes("cab") || nameLower.includes("transport") || nameLower.includes("drive")) {
              deducedType = "transport";
            } else if (nameLower.includes("hotel") || nameLower.includes("resort") || nameLower.includes("check-in") || nameLower.includes("stay")) {
              deducedType = "hotel";
            } else if (nameLower.includes("lunch") || nameLower.includes("dinner") || nameLower.includes("breakfast") || nameLower.includes("cafe") || nameLower.includes("dine")) {
              deducedType = "meal";
            } else if (nameLower.includes("free") || nameLower.includes("leisure") || nameLower.includes("relax")) {
              deducedType = "free";
            }

            let estimatedCost = 0;
            const costMatch = (act.description || "").match(/₹\s?(\d+[\d,]*)/) || act.activity.match(/₹\s?(\d+[\d,]*)/);
            if (costMatch) {
              estimatedCost = parseInt(costMatch[1].replace(/,/g, "")) || 0;
            }

            eventsList.push({
              id: `${trip._id}-${day.day}-${actIndex}`,
              tripId: trip._id,
              tripTitle: trip.tripTitle,
              day: day.day,
              theme: day.theme,
              activityIndex: actIndex,
              title: act.activity,
              description: act.description || "",
              time: act.time || "Flexible",
              location: act.location || trip.location || "",
              cost: act.cost || estimatedCost,
              type: deducedType,
              date: eventDate,
              photoUrl: act.photoUrl
            });
          });
        }
      });
    });

    return eventsList;
  }, [trips, activeTrip]);

  // Navigate Date
  const handlePrevDate = () => {
    setViewDate(prev => {
      const nextDate = new Date(prev);
      if (currentView === "month") {
        nextDate.setMonth(prev.getMonth() - 1);
      } else if (currentView === "week") {
        nextDate.setDate(prev.getDate() - 7);
      } else {
        nextDate.setDate(prev.getDate() - 1);
      }
      return nextDate;
    });
  };

  const handleNextDate = () => {
    setViewDate(prev => {
      const nextDate = new Date(prev);
      if (currentView === "month") {
        nextDate.setMonth(prev.getMonth() + 1);
      } else if (currentView === "week") {
        nextDate.setDate(prev.getDate() + 7);
      } else {
        nextDate.setDate(prev.getDate() + 1);
      }
      return nextDate;
    });
  };

  const handleJumpToToday = () => {
    setViewDate(new Date(2026, 7, 22)); 
    toast.success("Navigated to Today!");
  };

  // Quick Event Editing
  const openEditor = (event, e) => {
    if (e) e.stopPropagation();
    setEditingEvent({ ...event });
    setEditorModalOpen(true);
  };

  const saveEventEdits = async () => {
    if (!editingEvent.title.trim()) return;

    try {
      const targetTrip = trips.find(t => t._id === editingEvent.tripId);
      if (!targetTrip) return;

      const updatedTrip = JSON.parse(JSON.stringify(targetTrip));
      const dayData = updatedTrip.dailyItinerary.find(d => d.day === editingEvent.day);
      if (dayData && dayData.activities[editingEvent.activityIndex]) {
        dayData.activities[editingEvent.activityIndex].activity = editingEvent.title;
        dayData.activities[editingEvent.activityIndex].description = editingEvent.description;
        dayData.activities[editingEvent.activityIndex].time = editingEvent.time;
        dayData.activities[editingEvent.activityIndex].location = editingEvent.location;
        dayData.activities[editingEvent.activityIndex].cost = parseInt(editingEvent.cost) || 0;
      }

      let costSum = 0;
      updatedTrip.dailyItinerary.forEach(day => {
        day.activities.forEach(act => {
          costSum += parseInt(act.cost) || 0;
        });
      });
      updatedTrip.estimatedCosts.total = `₹${costSum.toLocaleString()}`;

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/trips/${editingEvent.tripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedTrip)
      });

      if (!response.ok) throw new Error("Failed to save changes");
      
      toast.success("Event updated successfully!");
      setEditorModalOpen(false);
      dispatch(fetchTrips());
    } catch (err) {
      toast.error("Failed to update activity: " + err.message);
    }
  };

  // Delete Activity
  const deleteActivityEvent = async (event) => {
    if (!window.confirm("Are you sure you want to remove this activity?")) return;

    try {
      const targetTrip = trips.find(t => t._id === event.tripId);
      if (!targetTrip) return;

      const updatedTrip = JSON.parse(JSON.stringify(targetTrip));
      const dayData = updatedTrip.dailyItinerary.find(d => d.day === event.day);
      if (dayData) {
        dayData.activities.splice(event.activityIndex, 1);
      }

      let costSum = 0;
      updatedTrip.dailyItinerary.forEach(day => {
        day.activities.forEach(act => {
          costSum += parseInt(act.cost) || 0;
        });
      });
      updatedTrip.estimatedCosts.total = `₹${costSum.toLocaleString()}`;

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/trips/${event.tripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedTrip)
      });

      if (!response.ok) throw new Error("Failed to remove activity");
      
      toast.success("Activity deleted!");
      dispatch(fetchTrips());
    } catch (err) {
      toast.error("Failed to delete activity: " + err.message);
    }
  };

  // Add Event directly from Calendar
  const handleAddEvent = async () => {
    if (!eventForm.activity.trim()) return;

    try {
      const targetTrip = activeTrip || trips[0];
      if (!targetTrip) {
        toast.error("Plan a trip first to add events!");
        return;
      }

      const updatedTrip = JSON.parse(JSON.stringify(targetTrip));
      let dayData = updatedTrip.dailyItinerary.find(d => d.day === addDayTarget);
      if (!dayData) {
        dayData = { day: addDayTarget, theme: "Explore", activities: [] };
        updatedTrip.dailyItinerary.push(dayData);
      }

      dayData.activities.push({
        time: eventForm.time,
        activity: eventForm.activity,
        description: eventForm.description,
        location: eventForm.location,
        cost: parseInt(eventForm.cost) || 0
      });

      let costSum = 0;
      updatedTrip.dailyItinerary.forEach(day => {
        day.activities.forEach(act => {
          costSum += parseInt(act.cost) || 0;
        });
      });
      updatedTrip.estimatedCosts.total = `₹${costSum.toLocaleString()}`;

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/trips/${targetTrip._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedTrip)
      });

      if (!response.ok) throw new Error("Failed to append activity");
      
      toast.success(`Event added to Day ${addDayTarget}!`);
      setAddModalOpen(false);
      setEventForm({
        time: "10:00 AM",
        activity: "",
        description: "",
        location: "",
        cost: "",
        type: "activity"
      });
      dispatch(fetchTrips());
    } catch (err) {
      toast.error("Failed to add event: " + err.message);
    }
  };

  // Drag & Drop Sorting
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  
  const handleDragStart = (idx) => {
    setDraggedItemIndex(idx);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = async (index) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    if (!activeTrip) return;

    try {
      const updatedTrip = JSON.parse(JSON.stringify(activeTrip));
      const dayData = updatedTrip.dailyItinerary.find(d => d.day === activeDayIndex);
      
      if (dayData && dayData.activities) {
        const [movedAct] = dayData.activities.splice(draggedItemIndex, 1);
        dayData.activities.splice(index, 0, movedAct);

        const token = localStorage.getItem('token');
        await fetch(`${API_BASE_URL}/trips/${activeTrip._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(updatedTrip)
        });

        dispatch(fetchTrips());
        toast.success("Itinerary order updated!");
      }
    } catch (err) {
      toast.error("Failed to reorder: " + err.message);
    } finally {
      setDraggedItemIndex(null);
    }
  };

  // Month Days Calculator
  const monthDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay(); 
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNum: null, date: null });
    }
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i);
      days.push({ dayNum: i, date });
    }
    return days;
  }, [viewDate]);

  // Filtered Events
  const currentViewEvents = useMemo(() => {
    return calendarEvents.filter(evt => {
      const evtDate = new Date(evt.date);
      if (currentView === "day") {
        const activeTripBase = activeTrip?.startDate ? new Date(activeTrip.startDate) : new Date(2026, 7, 3);
        const activeDayDate = new Date(activeTripBase);
        activeDayDate.setDate(activeTripBase.getDate() + activeDayIndex - 1);
        return evtDate.toDateString() === activeDayDate.toDateString();
      }
      if (currentView === "month") {
        return evtDate.getMonth() === viewDate.getMonth() && evtDate.getFullYear() === viewDate.getFullYear();
      }
      return true;
    });
  }, [calendarEvents, currentView, viewDate, activeTrip, activeDayIndex]);

  // Overall Trip stats
  const tripSummary = useMemo(() => {
    if (!activeTrip) return null;
    let totalSpend = 0;
    let activityCount = 0;
    activeTrip.dailyItinerary?.forEach(day => {
      day.activities?.forEach(act => {
        activityCount++;
        totalSpend += parseInt(act.cost) || 0;
      });
    });

    const budgetLimit = parseInt(activeTrip.budget?.replace(/[^0-9]/g, "")) || 100000;
    const remaining = budgetLimit - totalSpend;

    return {
      title: activeTrip.tripTitle,
      duration: activeTrip.duration,
      location: activeTrip.location,
      activities: activityCount,
      totalSpend,
      budgetLimit,
      remaining,
      safetyScore: 91
    };
  }, [activeTrip]);

  // Today Budget Stats
  const todayBudgetTotal = useMemo(() => {
    let spend = 0;
    currentViewEvents.forEach(e => {
      spend += parseInt(e.cost) || 0;
    });
    return spend;
  }, [currentViewEvents]);

  return (
    <div className="h-screen flex flex-col bg-[#FAF5EE] font-jakarta overflow-hidden relative">
      
      {/* Premium ambient design glows */}
      <div className="absolute top-1/4 left-1/4 w-[280px] h-[280px] rounded-full bg-saffron/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-1/3 right-1/4 w-[320px] h-[320px] rounded-full bg-banyan/10 blur-[140px] pointer-events-none z-0" />

      <Toaster position="top-right" />

      {/* ---- CALENDAR WORKSPACE ---- */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="w-[310px] bg-white/80 backdrop-blur-md border-r border-sand hidden lg:flex flex-col shrink-0 shadow-md">
          {/* Custom Vibrant Header banner */}
          <div className="p-6 bg-gradient-to-r from-[#1B4332] to-[#E8640C] text-white">
            <div className="flex items-center gap-2">
              <Compass className="animate-spin-slow shrink-0 text-amber-300" size={18} />
              <h3 className="font-cabinet font-extrabold text-[16px] tracking-tight">Travel Command Center</h3>
            </div>
            <p className="font-jakarta text-[11px] text-white/95 mt-1.5 leading-relaxed">
              Track stops, daily itineraries, dynamic budgets & warnings in real-time.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* Active Trip Details card */}
            {tripSummary ? (
              <div className="bg-white border border-sand/75 rounded-3xl p-5 space-y-4 shadow-sm hover:shadow-md hover:border-saffron/30 transition-all duration-350">
                <div className="flex items-center justify-between">
                  <span className="font-mono-dm text-[9px] text-saffron uppercase tracking-widest font-bold bg-[#E8640C]/10 px-2 py-0.5 rounded-full">Selected Trip</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h4 className="font-display font-extrabold text-[16px] text-charcoal tracking-tight">{tripSummary.title}</h4>
                
                <div className="space-y-3 text-[12.5px] font-cabinet font-semibold text-taupe">
                  <div className="flex items-center gap-2.5"><MapPin size={15} className="text-saffron shrink-0" /> {tripSummary.location}</div>
                  <div className="flex items-center gap-2.5"><Calendar size={15} className="text-saffron shrink-0" /> {tripSummary.duration} Days Plan</div>
                  <div className="flex items-center gap-2.5"><Clock size={15} className="text-saffron shrink-0" /> {tripSummary.activities} Scheduled Stops</div>
                  <div className="flex items-center gap-2.5"><Shield size={15} className="text-[#1B4332] shrink-0" /> {tripSummary.safetyScore}/100 Safe Score</div>
                </div>

                {/* Progress Budget Bar */}
                <div className="pt-3 border-t border-sand/50">
                  <div className="flex justify-between text-[11px] font-mono-dm mb-1.5">
                    <span className="text-taupe">Spent: <b className="text-charcoal font-cabinet font-extrabold">₹{tripSummary.totalSpend.toLocaleString()}</b></span>
                    <span className="text-charcoal font-bold">Limit: ₹{tripSummary.budgetLimit.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-sand/35 h-2 rounded-full overflow-hidden mt-1 shadow-inner">
                    <div 
                      className={`h-full transition-all duration-500 ${tripSummary.remaining < 0 ? 'bg-[#C0392B]' : 'bg-[#1B4332]'}`}
                      style={{ width: `${Math.min(100, (tripSummary.totalSpend / tripSummary.budgetLimit) * 100)}%` }}
                    />
                  </div>
                  {tripSummary.remaining < 0 ? (
                    <span className="text-[10px] text-[#C0392B] font-extrabold mt-2 flex items-center gap-1">
                      <AlertTriangle size={11} /> Budget exceeded by ₹{Math.abs(tripSummary.remaining).toLocaleString()}!
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#2D6A4F] font-extrabold mt-2 block">₹{tripSummary.remaining.toLocaleString()} remaining budget</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-dashed border-sand/70 rounded-3xl p-6 text-center space-y-3 shadow-inner">
                <Compass className="text-sand/70 mx-auto mb-1 animate-spin-slow" size={32} />
                <h4 className="font-cabinet font-extrabold text-[13px] text-charcoal">All Travel Routes Active</h4>
                <p className="font-jakarta text-[11.5px] text-taupe leading-relaxed">
                  Select a specific trip in the toolbar to unlock day planning, drag-and-drop reordering, and budget limits.
                </p>
              </div>
            )}

            {/* Premium AI Agent assistant planner */}
            <div className="p-5 bg-gradient-to-br from-[#1B4332]/5 to-[#E8640C]/5 border border-sand/70 rounded-3xl space-y-2.5 shadow-sm">
              <div className="flex items-center gap-2 text-saffron font-cabinet font-extrabold text-[12.5px]">
                <Sparkles size={14} className="animate-pulse text-amber-500" /> AI Agent Advisor
              </div>
              <p className="font-jakarta text-[11.5px] text-taupe leading-relaxed">
                <b>Itinerary Optimization:</b> Your afternoon schedule in Jaisalmer seems dense. Consider rescheduling Patwon Haveli to 4:00 PM to avoid heat and secure the best lighting for photography!
              </p>
            </div>

            {/* Travel Advisory Card */}
            <div className="p-5 bg-[#C0392B]/5 border border-red-100 rounded-3xl space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-[#C0392B] font-cabinet font-extrabold text-[12.5px]">
                <Shield size={13} /> Safety Advisory
              </div>
              <p className="font-jakarta text-[11.5px] text-taupe leading-relaxed">
                Monsoon rain reported in North India. Leh highway restricted. Ensure paragliding operations are verified by local guides.
              </p>
            </div>
          </div>
        </aside>

        {/* CENTER CALENDAR WORKSPACE AREA */}
        <section className="flex-1 flex flex-col min-w-0 bg-transparent">
          
          {/* Top calendar header controls row */}
          <div className="bg-white/80 backdrop-blur-md border-b border-sand px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-md relative z-10">
            <div className="flex flex-row items-center gap-3">
              <button 
                onClick={() => dispatch(setCalendarOpen(false))}
                className="p-2 hover:bg-sand/35 rounded-full text-taupe hover:text-charcoal hover:scale-105 transition-all shrink-0 border border-sand shadow-sm"
                title="Close Calendar"
              >
                <X size={16} />
              </button>
              <h2 className="font-display font-extrabold text-[18px] text-charcoal leading-none">Travel Calendar</h2>
              
              {/* Trip selector dropdown */}
              <select 
                value={selectedTripId}
                onChange={e => setSelectedTripId(e.target.value)}
                className="h-[36px] px-3.5 rounded-xl border border-sand/80 bg-white text-charcoal font-cabinet font-bold text-[12.5px] outline-none focus:border-saffron focus:ring-1 focus:ring-saffron"
              >
                <option value="all">All Trips</option>
                {trips.map(t => <option key={t._id} value={t._id}>{t.tripTitle || t.location}</option>)}
              </select>
            </div>

            {/* Middle Nav Range Controls */}
            <div className="flex items-center gap-1.5">
              <button onClick={handlePrevDate} className="p-2 hover:bg-sand/35 rounded-xl border border-sand bg-white hover:scale-105 transition-all shadow-sm">
                <ChevronLeft size={15} />
              </button>
              
              <span className="font-cabinet font-extrabold text-[14px] text-charcoal px-3">
                {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>

              <button onClick={handleNextDate} className="p-2 hover:bg-sand/35 rounded-xl border border-sand bg-white hover:scale-105 transition-all shadow-sm">
                <ChevronRight size={15} />
              </button>

              <button onClick={handleJumpToToday} className="h-[34px] px-4 rounded-xl border border-sand bg-white hover:bg-ivory hover:border-saffron text-taupe font-cabinet font-extrabold text-[12px] ml-2 transition-all shadow-sm">
                Today
              </button>
            </div>

            {/* View Switchers */}
            <div className="flex bg-[#FAF5EE] p-1 border border-sand/80 rounded-xl shrink-0 shadow-inner">
              {["month", "week", "timeline", "day"].map(view => (
                <button
                  key={view}
                  onClick={() => setCurrentView(view)}
                  className={`h-[30px] px-4 rounded-lg font-cabinet font-bold text-[11px] capitalize transition-all ${
                    currentView === view 
                      ? "bg-gradient-to-r from-saffron to-amber-500 text-white shadow-md" 
                      : "text-taupe hover:text-charcoal"
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN CALENDAR DISPLAY GRIDS */}
          <div className="flex-1 overflow-y-auto p-6 relative">
            
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-saffron" size={40} />
              </div>
            ) : trips.length === 0 ? (
              <div className="max-w-md mx-auto text-center py-20 bg-white border border-sand rounded-3xl p-8 shadow-sm">
                <Calendar size={48} className="text-saffron mx-auto mb-4" />
                <h3 className="font-display font-extrabold text-[18px] text-charcoal">Your calendar is waiting for a journey 🌍</h3>
                <p className="font-jakarta text-[13px] text-taupe mt-2 mb-6">Create your first trip itinerary and your travel schedule will automatically populate here!</p>
                <Link to="/trips/new" className="inline-flex h-11 px-6 items-center bg-saffron text-white rounded-xl font-cabinet font-bold text-[12px] shadow-sm hover:scale-[1.02] transition-transform">
                  Plan a Trip
                </Link>
              </div>
            ) : (
              <>
                {/* 1. MONTH VIEW */}
                {currentView === "month" && (
                  <div className="grid grid-cols-7 gap-3 h-full min-h-[500px]">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                      <div key={day} className="text-center font-cabinet font-extrabold text-[11px] text-[#1B4332] uppercase py-2 bg-[#FEF3E2] border border-sand/60 rounded-xl shadow-xs">
                        {day}
                      </div>
                    ))}
                    {monthDays.map((day, idx) => {
                      if (!day.dayNum) {
                        return <div key={`pad-${idx}`} className="bg-sand/5 border border-dashed border-sand/35 rounded-2xl min-h-[85px] opacity-30" />;
                      }

                      // Find events for this day
                      const dayEvents = calendarEvents.filter(e => e.date.toDateString() === day.date.toDateString());
                      const daySpend = dayEvents.reduce((sum, e) => sum + (parseInt(e.cost) || 0), 0);

                      return (
                        <div 
                          key={day.dayNum}
                          onClick={() => {
                            if (dayEvents.length > 0) {
                              const ev = dayEvents[0];
                              setSelectedTripId(ev.tripId);
                              setActiveDayIndex(ev.day);
                              setCurrentView("day");
                            } else {
                              setAddDayTarget(1);
                              setAddModalOpen(true);
                            }
                          }}
                          className={`border rounded-2xl p-3 min-h-[90px] flex flex-col justify-between hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer ${
                            dayEvents.length > 0 
                              ? 'bg-emerald-50/65 border-emerald-300 text-emerald-950 hover:border-emerald-500 hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)]' 
                              : 'bg-white border-sand/70 text-charcoal hover:border-saffron hover:shadow-md'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-cabinet font-extrabold text-[12.5px]">{day.dayNum}</span>
                            {dayEvents.length > 0 && (
                              <span className="font-mono-dm text-[8.5px] text-emerald-800 bg-emerald-100/80 border border-emerald-200/50 px-1.5 py-0.5 rounded-full truncate tracking-tight max-w-[85px]">
                                📍 {dayEvents[0].location || dayEvents[0].tripTitle}
                              </span>
                            )}
                          </div>

                          {/* Minimalist text summary instead of heavy capsules */}
                          {dayEvents.length > 0 ? (
                            <div className="space-y-1.5 mt-2 flex-1">
                              <div className="text-[10px] text-emerald-800/80 font-cabinet font-extrabold text-left flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                {dayEvents.length} Stops Planned
                              </div>
                              {daySpend > 0 && (
                                <span className="font-mono-dm text-[9.5px] text-[#1B4332] font-extrabold block text-left">
                                  ₹{daySpend.toLocaleString()} spend
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="flex-1" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 2. WEEK VIEW */}
                {currentView === "week" && (
                  <div className="bg-white border border-sand rounded-3xl overflow-x-auto shadow-md p-5">
                    <div className="min-w-[800px] grid grid-cols-8 gap-4">
                      {/* Time slot column */}
                      <div className="border-r border-sand/60 pr-3">
                        <div className="h-[48px] flex items-center">
                          <span className="font-mono-dm text-[10px] text-taupe uppercase font-extrabold">Hour Slot</span>
                        </div>
                        {["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM", "07:00 PM"].map(time => (
                          <div key={time} className="h-[80px] flex items-start pt-2">
                            <span className="font-mono-dm text-[10px] text-taupe/70 font-bold">{time}</span>
                          </div>
                        ))}
                      </div>

                      {/* 7 Days of the week columns */}
                      {[0, 1, 2, 3, 4, 5, 6].map(offset => {
                        const dayDate = new Date(viewDate);
                        dayDate.setDate(viewDate.getDate() + offset - viewDate.getDay()); 
                        const dayEvents = calendarEvents.filter(e => e.date.toDateString() === dayDate.toDateString());

                        return (
                          <div key={offset} className="flex-1 flex flex-col">
                            <div className="h-[48px] border-b border-sand/65 pb-2 text-center flex flex-col justify-center bg-[#FEF3E2]/30 rounded-xl">
                              <span className="font-cabinet font-extrabold text-[12.5px] text-charcoal">{dayDate.toLocaleString('default', { weekday: 'short' })}</span>
                              <span className="font-mono-dm text-[10px] text-saffron/80 font-bold mt-0.5">{dayDate.getDate()}</span>
                            </div>

                            <div className="relative min-h-[480px] mt-2 bg-[#FAF5EE]/50 border border-sand/40 rounded-2xl p-1.5">
                              {dayEvents.map((evt, idx) => {
                                const TypeIcon = EVENT_TYPES[evt.type]?.icon || Star;
                                return (
                                  <div
                                    key={idx}
                                    onClick={() => openEditor(evt)}
                                    className={`mb-2.5 p-2.5 border-l-4 rounded-xl shadow-sm hover:scale-[1.03] hover:shadow-md transition-all cursor-pointer text-left ${
                                      EVENT_TYPES[evt.type]?.color || 'border-sand bg-white'
                                    }`}
                                  >
                                    <div className="flex items-center gap-1.5">
                                      <TypeIcon size={11} className="shrink-0" />
                                      <span className="font-mono-dm text-[9.5px] font-bold truncate">{evt.time}</span>
                                    </div>
                                    <h5 className="font-cabinet font-extrabold text-[11.5px] text-charcoal truncate mt-1">{evt.title}</h5>
                                    {evt.cost > 0 && <span className="font-mono-dm text-[9px] block mt-1 font-extrabold">₹{evt.cost}</span>}
                                  </div>
                                );
                              })}
                              {dayEvents.length === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="font-cabinet text-[11px] text-taupe/40 italic">Free Day</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. TIMELINE VIEW */}
                {currentView === "timeline" && (
                  <div className="bg-white border border-sand rounded-3xl p-6 shadow-md space-y-8 max-w-[800px] mx-auto">
                    <div className="flex items-center justify-between pb-3 border-b border-sand">
                      <h3 className="font-display font-extrabold text-[16px] text-[#1B4332]">Travel Boarding Passes</h3>
                      <span className="font-mono-dm text-[10px] bg-[#FEF3E2] px-2 py-0.5 rounded border border-sand text-taupe font-bold">Journey Ticket Stubs</span>
                    </div>

                    <div className="relative pl-8 space-y-8">
                      <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-dashed border-l-2 border-sand" />

                      {trips.map((trip, tripIdx) => {
                        if (selectedTripId !== "all" && trip._id !== selectedTripId) return null;
                        
                        return (
                          <div key={trip._id} className="space-y-4">
                            <div className="relative flex items-center gap-3">
                              <div className="absolute -left-[29px] w-6 h-6 rounded-full bg-saffron border-4 border-white shadow flex items-center justify-center z-10 animate-bounce">
                                <Compass size={10} className="text-white" />
                              </div>
                              <div>
                                <h4 className="font-cabinet font-extrabold text-[15px] text-charcoal flex items-center gap-2">
                                  {trip.location}
                                  <span className="font-mono-dm text-[9.5px] text-taupe bg-[#FEF3E2] px-2 py-0.5 rounded border border-sand">
                                    {trip.duration} Days
                                  </span>
                                </h4>
                              </div>
                            </div>

                            <div className="grid gap-4 pl-3">
                              {trip.dailyItinerary?.map(day => (
                                <div key={day.day} className="bg-gradient-to-br from-[#FEF3E2]/10 to-[#FFF8F0]/30 border border-sand/70 rounded-2xl p-4.5 space-y-3.5 shadow-sm">
                                  <h5 className="font-cabinet font-extrabold text-[13px] text-charcoal">
                                    Day {day.day} — {day.theme}
                                  </h5>

                                  {/* Color coded vertical boarding pass cards in timeline view */}
                                  <div className="grid gap-3">
                                    {day.activities?.map((act, actIdx) => {
                                      // Deduce event type for styling
                                      let deducedType = "activity";
                                      const nameLower = act.activity.toLowerCase();
                                      if (nameLower.includes("flight") || nameLower.includes("train") || nameLower.includes("cab") || nameLower.includes("transport")) deducedType = "transport";
                                      if (nameLower.includes("hotel") || nameLower.includes("resort") || nameLower.includes("stay")) deducedType = "hotel";
                                      if (nameLower.includes("lunch") || nameLower.includes("dinner") || nameLower.includes("meal")) deducedType = "meal";

                                      let stubTheme = "bg-[#E8640C]/5 border-[#E8640C]/10 text-saffron";
                                      let stubBorder = "border-[#E8640C]";
                                      if (deducedType === "transport") {
                                        stubTheme = "bg-[#1B4332]/5 border-[#1B4332]/10 text-banyan";
                                        stubBorder = "border-[#1B4332]";
                                      }
                                      if (deducedType === "hotel") {
                                        stubTheme = "bg-violet-50/50 border-violet-100 text-violet-600";
                                        stubBorder = "border-violet-500";
                                      }
                                      if (deducedType === "meal") {
                                        stubTheme = "bg-[#4D908E]/5 border-[#4D908E]/10 text-[#4D908E]";
                                        stubBorder = "border-[#4D908E]";
                                      }

                                      return (
                                        <div key={actIdx} className={`bg-white border rounded-2xl flex overflow-hidden shadow-sm hover:shadow-md transition-all border-l-4 ${stubBorder}`}>
                                          <div className={`px-4 py-3 flex flex-col items-center justify-center border-r border-dashed border-sand ${stubTheme}`}>
                                            <span className="font-mono-dm text-[9.5px] font-extrabold uppercase tracking-wider">{act.time}</span>
                                          </div>
                                          <div className="p-3.5 flex-1 text-left min-w-0">
                                            <h6 className="font-cabinet font-extrabold text-[13.5px] text-charcoal truncate">{act.activity}</h6>
                                            {act.location && (
                                              <span className="font-mono-dm text-[9.5px] text-taupe/65 block mt-0.5 truncate">📍 {act.location}</span>
                                            )}
                                            {act.cost > 0 && (
                                              <span className="font-mono-dm text-[9.5px] text-[#1B4332] font-extrabold mt-1 block">₹{parseInt(act.cost).toLocaleString()}</span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. DAY VIEW */}
                {currentView === "day" && activeTrip && (
                  <div className="flex flex-col md:flex-row gap-6 max-w-[900px] mx-auto">
                    <div className="flex-1 space-y-4">
                      
                      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-sand/40">
                        {activeTrip.dailyItinerary?.map(d => (
                          <button 
                            key={d.day} 
                            onClick={() => setActiveDayIndex(d.day)}
                            className={`h-[32px] px-4 rounded-full font-cabinet font-bold text-[11px] transition-all shrink-0 ${
                              activeDayIndex === d.day 
                                ? 'bg-saffron text-white shadow-sm' 
                                : 'bg-white border border-sand text-taupe hover:bg-ivory'
                            }`}
                          >
                            Day {d.day}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-cabinet font-extrabold text-[14px] text-charcoal">
                            Day {activeDayIndex} Stops Checklist
                          </h4>
                          <button 
                            onClick={() => {
                              setAddDayTarget(activeDayIndex);
                              setAddModalOpen(true);
                            }}
                            className="text-saffron font-cabinet font-bold text-[11px] hover:underline flex items-center gap-1"
                          >
                            <Plus size={12} /> Add Stop
                          </button>
                        </div>

                        <div className="space-y-3">
                          {activeTrip.dailyItinerary?.find(d => d.day === activeDayIndex)?.activities?.length === 0 ? (
                            <div className="text-center py-10 bg-white border border-sand rounded-2xl p-6">
                              <HelpCircle size={28} className="text-sand mx-auto mb-2 animate-bounce" />
                              <p className="font-cabinet text-[12px] text-taupe italic">No stops planned for Day {activeDayIndex}. Click "Add Stop" to schedule one!</p>
                            </div>
                          ) : (
                            activeTrip.dailyItinerary?.find(d => d.day === activeDayIndex)?.activities?.map((act, idx) => {
                              const dayEvent = currentViewEvents.find(e => e.activityIndex === idx && e.day === activeDayIndex);
                              const TypeIcon = EVENT_TYPES[dayEvent?.type]?.icon || Star;

                              return (
                                <div 
                                  key={idx}
                                  draggable
                                  onDragStart={() => handleDragStart(idx)}
                                  onDragOver={(e) => handleDragOver(e, idx)}
                                  onDrop={() => handleDrop(idx)}
                                  className="bg-white border border-sand rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4 cursor-grab active:cursor-grabbing hover:border-saffron hover:shadow-md transition-all group"
                                >
                                  <div className="flex items-center gap-3 truncate">
                                    <div className="text-taupe/40 group-hover:text-taupe shrink-0">
                                      <Clock size={14} />
                                    </div>

                                    <div className="truncate">
                                      <div className="flex items-center gap-1.5">
                                        <TypeIcon size={12} className="text-saffron shrink-0" />
                                        <span className="font-mono-dm text-[10px] text-taupe/65">{act.time || "Flexible"}</span>
                                      </div>
                                      <h5 className="font-cabinet font-extrabold text-[13.5px] text-charcoal mt-1 truncate">{act.activity}</h5>
                                      {act.location && (
                                        <span className="font-mono-dm text-[9.5px] text-taupe/60 block mt-0.5 truncate">📍 {act.location}</span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3 shrink-0">
                                    {act.cost > 0 && (
                                      <span className="font-mono-dm text-[11px] text-[#1B4332] font-extrabold bg-[#1B4332]/5 px-2.5 py-0.5 rounded-lg border border-sand">
                                        ₹{(parseInt(act.cost) || 0).toLocaleString()}
                                      </span>
                                    )}
                                    
                                    <div className="flex gap-1">
                                      <button 
                                        onClick={(e) => openEditor(dayEvent, e)}
                                        className="p-1 hover:bg-[#FFF8F0] hover:text-saffron rounded"
                                        title="Edit Event"
                                      >
                                        <Edit3 size={12} />
                                      </button>
                                      <button 
                                        onClick={() => deleteActivityEvent(dayEvent)}
                                        className="p-1 hover:bg-[#C0392B]/5 hover:text-[#C0392B] rounded"
                                        title="Delete Event"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Day summary sidebar details */}
                    <div className="w-full md:w-[280px] space-y-4">
                      
                      {/* Safety Score card */}
                      <div className="bg-[#1B4332]/5 border border-[#1B4332]/20 rounded-3xl p-5 shadow-xs">
                        <span className="font-mono-dm text-[9px] text-[#1B4332] uppercase tracking-widest font-extrabold">Safety Checklist advisory</span>
                        <h4 className="font-cabinet font-extrabold text-[14px] text-charcoal mt-1">91/100 Safe Spot</h4>
                        <p className="font-jakarta text-[11.5px] text-taupe mt-1.5 leading-relaxed">
                          {activeTrip.dailyItinerary?.find(d => d.day === activeDayIndex)?.safetyNotes || "No specific travel restrictions reported for this region. Local guidance active."}
                        </p>
                      </div>

                      {/* Daily Budget summary card */}
                      <div className="bg-white border border-sand rounded-3xl p-5 shadow-sm">
                        <span className="font-mono-dm text-[9px] text-taupe/70 uppercase tracking-widest font-bold">Estimated Cost</span>
                        
                        <div className="mt-4 flex justify-between items-baseline">
                          <span className="font-display font-extrabold text-[24px] text-[#1B4332]">₹{todayBudgetTotal.toLocaleString()}</span>
                          <span className="font-mono-dm text-[10.5px] text-taupe/50">Day Total</span>
                        </div>

                        <div className="w-full h-[1px] bg-sand/40 my-3" />

                        {/* Food suggestions */}
                        <div>
                          <span className="font-mono-dm text-[9.5px] text-[#E8640C] uppercase font-bold">Local Food Suggestions</span>
                          <div className="mt-2 space-y-1.5">
                            {activeTrip.dailyItinerary?.find(d => d.day === activeDayIndex)?.foodSuggestions?.map(f => (
                              <div key={f} className="flex items-center gap-1.5 text-[11.5px] text-taupe">
                                <span className="text-saffron">•</span>
                                <span className="truncate font-cabinet font-semibold">{f}</span>
                              </div>
                            )) || <span className="font-jakarta text-[11px] text-taupe/50 italic">No food suggestions listed</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      {/* ---- EVENT QUICK EDITOR MODAL ---- */}
      {editorModalOpen && editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-sand rounded-3xl p-6 w-full max-w-[460px] shadow-2xl relative">
            <button onClick={() => setEditorModalOpen(false)} className="absolute top-4 right-4 p-1 hover:bg-sand/35 rounded-full">
              <X size={18} />
            </button>
            <h3 className="font-display font-extrabold text-[18px] text-charcoal">Quick Event Editor</h3>
            <p className="font-jakarta text-[12.5px] text-taupe mt-1">Directly update the activity details on the itinerary ticket.</p>

            <div className="space-y-4 mt-5">
              <div>
                <label className="font-mono-dm text-[9.5px] text-taupe/65 uppercase block mb-1">Activity Title *</label>
                <input 
                  type="text" 
                  value={editingEvent.title}
                  onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full h-[40px] border border-sand rounded-xl px-3 font-cabinet text-[13px] outline-none focus:border-saffron"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono-dm text-[9.5px] text-taupe/65 uppercase block mb-1">Start Time</label>
                  <input 
                    type="text" 
                    value={editingEvent.time}
                    onChange={e => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    placeholder="e.g. 10:00 AM"
                    className="w-full h-[40px] border border-sand rounded-xl px-3 font-cabinet text-[13px] outline-none focus:border-saffron"
                  />
                </div>
                <div>
                  <label className="font-mono-dm text-[9.5px] text-taupe/65 uppercase block mb-1">Cost (₹)</label>
                  <input 
                    type="number" 
                    value={editingEvent.cost}
                    onChange={e => setEditingEvent({ ...editingEvent, cost: e.target.value })}
                    placeholder="e.g. 1500"
                    className="w-full h-[40px] border border-sand rounded-xl px-3 font-cabinet text-[13px] outline-none focus:border-saffron"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono-dm text-[9.5px] text-taupe/65 uppercase block mb-1">Location</label>
                <input 
                  type="text" 
                  value={editingEvent.location}
                  onChange={e => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  placeholder="e.g. Jaisalmer Fort"
                  className="w-full h-[40px] border border-sand rounded-xl px-3 font-cabinet text-[13px] outline-none focus:border-saffron"
                />
              </div>

              <div>
                <label className="font-mono-dm text-[9.5px] text-taupe/65 uppercase block mb-1">Description</label>
                <textarea 
                  value={editingEvent.description}
                  onChange={e => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  placeholder="Details or local guidelines..."
                  className="w-full h-[80px] border border-sand rounded-xl p-3 font-cabinet text-[13px] outline-none focus:border-saffron resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setEditorModalOpen(false)}
                className="flex-1 h-[42px] rounded-xl border border-sand text-taupe font-cabinet font-bold text-[12px]"
              >
                Cancel
              </button>
              <button 
                onClick={saveEventEdits}
                className="flex-1 h-[42px] rounded-xl bg-saffron text-white font-cabinet font-bold text-[12px]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- ADD ACTIVITY MODAL ---- */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-sand rounded-3xl p-6 w-full max-w-[460px] shadow-2xl relative">
            <button onClick={() => setAddModalOpen(false)} className="absolute top-4 right-4 p-1 hover:bg-sand/35 rounded-full">
              <X size={18} />
            </button>
            <h3 className="font-display font-extrabold text-[18px] text-charcoal">Add Stop Event</h3>
            <p className="font-jakarta text-[12.5px] text-taupe mt-1">Schedule a stop, transport pass, or meal directly in the timeline.</p>

            <div className="space-y-4 mt-5">
              <div>
                <label className="font-mono-dm text-[9.5px] text-taupe/65 uppercase block mb-1">Target Day</label>
                <select 
                  value={addDayTarget}
                  onChange={e => setAddDayTarget(parseInt(e.target.value))}
                  className="w-full h-[40px] px-3 border border-sand rounded-xl bg-white text-charcoal font-cabinet text-[13px] outline-none focus:border-saffron"
                >
                  {(activeTrip || trips[0])?.dailyItinerary?.map(d => (
                    <option key={d.day} value={d.day}>Day {d.day} — {d.theme}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-mono-dm text-[9.5px] text-taupe/65 uppercase block mb-1">Activity/Stop Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Amber Palace visit"
                  value={eventForm.activity}
                  onChange={e => setEventForm({ ...eventForm, activity: e.target.value })}
                  className="w-full h-[40px] border border-sand rounded-xl px-3 font-cabinet text-[13px] outline-none focus:border-saffron"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono-dm text-[9.5px] text-taupe/65 uppercase block mb-1">Time</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 10:00 AM"
                    value={eventForm.time}
                    onChange={e => setEventForm({ ...eventForm, time: e.target.value })}
                    className="w-full h-[40px] border border-sand rounded-xl px-3 font-cabinet text-[13px] outline-none focus:border-saffron"
                  />
                </div>
                <div>
                  <label className="font-mono-dm text-[9.5px] text-taupe/65 uppercase block mb-1">Est Cost (₹)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 500"
                    value={eventForm.cost}
                    onChange={e => setEventForm({ ...eventForm, cost: e.target.value })}
                    className="w-full h-[40px] border border-sand rounded-xl px-3 font-cabinet text-[13px] outline-none focus:border-saffron"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono-dm text-[9.5px] text-taupe/65 uppercase block mb-1">Location</label>
                <input 
                  type="text" 
                  placeholder="e.g. Jaipur"
                  value={eventForm.location}
                  onChange={e => setEventForm({ ...eventForm, location: e.target.value })}
                  className="w-full h-[40px] border border-sand rounded-xl px-3 font-cabinet text-[13px] outline-none focus:border-saffron"
                />
              </div>

              <div>
                <label className="font-mono-dm text-[9.5px] text-taupe/65 uppercase block mb-1">Description</label>
                <textarea 
                  placeholder="Stops instructions, packing needs, or notes..."
                  value={eventForm.description}
                  onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full h-[80px] border border-sand rounded-xl p-3 font-cabinet text-[13px] outline-none focus:border-saffron resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setAddModalOpen(false)}
                className="flex-1 h-[42px] rounded-xl border border-sand text-taupe font-cabinet font-bold text-[12px]"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddEvent}
                className="flex-1 h-[42px] rounded-xl bg-saffron text-white font-cabinet font-bold text-[12px]"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
