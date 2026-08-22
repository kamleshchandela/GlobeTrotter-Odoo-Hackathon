import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { 
  X, ThumbsUp, Bookmark, MapPin, ChevronDown, Upload, Camera, 
  Info, Loader2, Trash2, Search, MessageSquare, Share2, 
  Sparkles, Star, Plus, Calendar, Clock, DollarSign, ArrowRight,
  Filter, Check, SlidersHorizontal, RefreshCw, Send, Paperclip, Smile,
  Hash, Users, HelpCircle, Heart, Flame, ShieldAlert, Award, Compass, MessageCircle, AlertCircle,
  Briefcase, Landmark, BookOpen, SendHorizontal, Image, FileText, CheckCircle2,
  PlusCircle, ShieldCheck
} from "lucide-react";
import TopAppBar from "../../components/shared/TopAppBar";
import toast, { Toaster } from "react-hot-toast";
import { communityService } from "../../services/communityService";
import { fetchTrips, saveTrip } from "../../store/tripSlice";

const TRAVEL_STYLES = ["Adventure", "Luxury", "Budget", "Family", "Solo", "Couple", "Backpacking", "Food", "Culture", "Nature"];

const BUDGET_OPTIONS = [
  { label: "All Budgets", value: "" },
  { label: "Under ₹10,000", value: "under_10k" },
  { label: "₹10,000–₹25,000", value: "10k_25k" },
  { label: "₹25,000–₹50,000", value: "25k_50k" },
  { label: "₹50,000–₹1,00,000", value: "50k_100k" },
  { label: "₹1,00,000+", value: "over_100k" }
];

const DURATION_OPTIONS = [
  { label: "Any Duration", value: "" },
  { label: "1–3 days", value: "1_3_days" },
  { label: "4–7 days", value: "4_7_days" },
  { label: "8–14 days", value: "8_14_days" },
  { label: "15+ days", value: "15_plus_days" }
];

export default function CommunitySpots() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Auth & User States
  const { isAuthenticated, user: authUser } = useSelector((state) => state.auth);
  const { trips } = useSelector((state) => state.trip);

  // Filter States
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // Active Filter Controls
  const [selectedType, setSelectedType] = useState("All"); // All, Trips, Experiences, Activities, Destinations
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [groupBy, setGroupBy] = useState("none");

  // Interaction Dialog States
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [detailModalPost, setDetailModalPost] = useState(null);
  const [addToTripModalActivity, setAddToTripModalActivity] = useState(null);
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Embedded AI Assistant Chat Panel States
  const [aiInput, setAiInput] = useState("");
  const [aiLog, setAiLog] = useState([
    { sender: "ai", text: "Hello! I am your Gemini AI Travel Assistant. Ask me to recommend itineraries, estimate budgets, or review safety scores!" }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Search Debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch Trips for "Add to Trip" workflow
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchTrips());
    }
  }, [isAuthenticated, dispatch]);

  // Main API call
  const fetchPostsData = async () => {
    setLoading(true);
    setError(false);
    try {
      const params = {
        search: debouncedSearch,
        category: selectedType,
        travelStyle: selectedStyle,
        budget: selectedBudget,
        duration: selectedDuration,
        rating: selectedRating,
        sort: sortBy
      };
      const data = await communityService.getPosts(params);
      setPosts(data);
    } catch (err) {
      console.error("Failed to load community posts", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsData();
  }, [debouncedSearch, selectedType, selectedStyle, selectedBudget, selectedDuration, selectedRating, sortBy]);

  // Likes & Saves
  const handleLike = async (postId, e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login to react to posts.");
      navigate("/auth/login");
      return;
    }
    try {
      const response = await communityService.likePost(postId);
      setPosts(prev => prev.map(post => 
        post._id === postId || post.id === postId 
          ? { ...post, likes: response.likes } 
          : post
      ));
      toast.success("Reacted to post!");
    } catch (err) {
      toast.error("Failed to update like");
    }
  };

  const handleSave = async (postId, e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login to save this post.");
      navigate("/auth/login");
      return;
    }
    try {
      const response = await communityService.savePost(postId);
      setPosts(prev => prev.map(post => 
        post._id === postId || post.id === postId 
          ? { ...post, saves: response.saves } 
          : post
      ));
      toast.success("Post saved to collection!");
    } catch (err) {
      toast.error("Failed to save post");
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentInput.trim()) return;
    setIsSubmittingComment(true);
    try {
      const updatedComments = await communityService.commentPost(postId, commentInput);
      setPosts(prev => prev.map(post => 
        post._id === postId || post.id === postId 
          ? { ...post, comments: updatedComments } 
          : post
      ));
      setCommentInput("");
      toast.success("Comment sent!");
    } catch (err) {
      toast.error("Failed to send comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = (post, e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/community?search=${encodeURIComponent(post.title)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard!");
    } else {
      toast.success("Link copied!");
    }
  };

  // Copy Trip
  const handleCopyTrip = async (post, e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login to copy itineraries.");
      navigate("/auth/login");
      return;
    }

    const tripToCopy = post.tripData;
    if (!tripToCopy) {
      toast.error("No trip data found on this post.");
      return;
    }

    const duplicatedTrip = {
      location: tripToCopy.location,
      tripTitle: `${tripToCopy.tripTitle || 'Copied Trip'} (Copy)`,
      overview: tripToCopy.overview,
      duration: tripToCopy.duration,
      budget: tripToCopy.budget,
      transport: tripToCopy.transport,
      dietary: tripToCopy.dietary,
      interests: tripToCopy.interests,
      vibe: tripToCopy.vibe,
      dailyItinerary: tripToCopy.dailyItinerary.map(day => ({
        day: day.day,
        theme: day.theme,
        activities: day.activities.map(act => ({
          time: act.time,
          activity: act.activity,
          description: act.description,
          location: act.location,
          placeId: act.placeId,
          lat: act.lat,
          lng: act.lng,
          photoUrl: act.photoUrl
        })),
        foodSuggestions: day.foodSuggestions,
        safetyNotes: day.safetyNotes
      })),
      estimatedCosts: tripToCopy.estimatedCosts,
      essentialPacking: tripToCopy.essentialPacking
    };

    toast.promise(
      dispatch(saveTrip(duplicatedTrip)).unwrap(),
      {
        loading: 'Importing itinerary...',
        success: () => {
          navigate(`/explore`);
          return 'Itinerary imported into your plan builder!';
        },
        error: 'Failed to import itinerary.'
      }
    );
  };

  // Add Activity to Trip
  const handleAddActivityToTrip = async (selectedTripId) => {
    const activity = addToTripModalActivity;
    if (!activity) return;

    try {
      const selectedTrip = trips.find(t => t._id === selectedTripId);
      if (!selectedTrip) return;

      const updatedTrip = JSON.parse(JSON.stringify(selectedTrip));
      if (!updatedTrip.dailyItinerary || updatedTrip.dailyItinerary.length === 0) {
        updatedTrip.dailyItinerary = [{ day: 1, theme: "Explore", activities: [] }];
      }

      updatedTrip.dailyItinerary[0].activities.push({
        time: activity.activityDetails?.duration || "Flexible",
        activity: activity.title,
        description: activity.description,
        location: activity.destinationName,
        photoUrl: activity.coverImage
      });

      await communityService.updateTrip(selectedTripId, updatedTrip);
      setAddToTripModalActivity(null);
      toast.success("Activity added to your itinerary!");
      dispatch(fetchTrips());
    } catch (err) {
      toast.error("Failed to append activity to trip");
    }
  };

  // AI chat widget send
  const handleSendAiPrompt = async () => {
    if (!aiInput.trim()) return;
    const prompt = aiInput;
    setAiInput("");
    setAiLog(prev => [...prev, { sender: "user", text: prompt }]);
    setIsAiTyping(true);

    try {
      setTimeout(() => {
        setIsAiTyping(false);
        let response = "I couldn't process that query. Ask me about Jaipur, Tokyo, Goa, or Manali travel tips!";
        const query = prompt.toLowerCase();
        
        if (query.includes("jaipur")) {
          response = "Jaipur (Pink City) is highly safe (91/100). Tips:\n- Visit Amber Fort early at 8 AM.\n- Shop block-print textiles at Johri Bazar.\n- Dine at Chokhi Dhani for authentic Rajasthani food.";
        } else if (query.includes("tokyo") || query.includes("japan")) {
          response = "Tokyo offers incredible urban transit. Tips:\n- Use Suica/Pasmo card on the Metro.\n- Try Tsukiji outer market for fresh sushi.\n- Plan a day-trip to Mt. Fuji (Kawaguchiko).";
        } else if (query.includes("goa")) {
          response = "Goa recommendations:\n- Spend a quiet sunset at Patnem Beach.\n- Explore Latin Quarters in Fontainhas, Panaji.\n- Try local Pork Vindaloo at beach shacks.";
        } else if (query.includes("budget")) {
          response = "For budget travel in India, consider Himachal Pradesh or Rajasthan. Average hostelling is ₹500/night, and local transport/food will run under ₹1,500/day.";
        }

        setAiLog(prev => [...prev, { sender: "ai", text: response }]);
      }, 1000);
    } catch (err) {
      setIsAiTyping(false);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedStyle("");
    setSelectedBudget("");
    setSelectedDuration("");
    setSelectedRating("");
    setSortBy("recommended");
    setGroupBy("none");
    setSelectedType("All");
  };

  const hasActiveFilters = useMemo(() => {
    return search || selectedStyle || selectedBudget || selectedDuration || selectedRating || sortBy !== "recommended" || groupBy !== "none" || selectedType !== "All";
  }, [search, selectedStyle, selectedBudget, selectedDuration, selectedRating, sortBy, groupBy, selectedType]);

  // Grouping/Sorting Logic
  const processedPosts = useMemo(() => {
    let list = [...posts];

    if (groupBy === "none") {
      return [{ key: "Featured", list }];
    }

    const groups = {};
    list.forEach(post => {
      let key = "Other";
      if (groupBy === "destination") key = post.destinationName || "General";
      else if (groupBy === "travelStyle") key = post.travelStyle?.[0] || "General";
      else if (groupBy === "budget") {
        const val = post.budget || 0;
        if (val < 10000) key = "Budget: Under ₹10,000";
        else if (val <= 50000) key = "Budget: ₹10,000–₹50,000";
        else key = "Budget: Premium (₹50,000+)";
      } else if (groupBy === "duration") {
        const val = post.duration || 0;
        if (val <= 3) key = "Duration: Short (1-3 Days)";
        else if (val <= 7) key = "Duration: Medium (4-7 Days)";
        else key = "Duration: Long (8+ Days)";
      }

      if (!groups[key]) groups[key] = [];
      groups[key].push(post);
    });

    return Object.entries(groups).map(([key, subList]) => ({ key, list: subList }));
  }, [posts, groupBy]);

  return (
    <div className="h-screen flex flex-col bg-[#FAF5EE] font-jakarta overflow-hidden">
      <TopAppBar variant="logo" />
      <Toaster position="top-right" />

      {/* ---- HEADER STICKY CONTROLS BAR ---- */}
      <div className="bg-white/90 backdrop-blur-lg border-b border-sand/60 shrink-0 shadow-[0_1px_8px_rgba(0,0,0,0.06)] relative z-20">
        <div className="max-w-[1280px] mx-auto px-6 py-3 flex flex-col md:flex-row gap-3 items-center justify-between">
          
          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-saffron to-amber-500 flex items-center justify-center shadow-sm">
              <Compass className="text-white" size={16} />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-[18px] text-charcoal tracking-tight leading-none">Traveler Community</h1>
              <p className="font-mono-dm text-[9px] text-taupe/50 font-bold uppercase tracking-widest mt-0.5">Discover · Share · Connect</p>
            </div>
          </div>

          {/* Search bar input */}
          <div className="w-full md:flex-1 max-w-[460px] h-[38px] bg-[#FAF5EE] border border-sand/70 rounded-xl flex items-center px-3.5 gap-2.5 focus-within:border-saffron focus-within:bg-white focus-within:ring-1 focus-within:ring-saffron/30 transition-all">
            <Search size={14} className="text-taupe/60 shrink-0" />
            <input 
              type="text" 
              placeholder="Search destinations, trips, stories..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent outline-none w-full font-cabinet text-[12px] text-charcoal placeholder:text-taupe/35"
            />
            {search && <X size={13} className="text-taupe/60 cursor-pointer hover:text-charcoal transition-colors shrink-0" onClick={() => setSearch("")} />}
          </div>

          {/* Sort/Filter Controls */}
          <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end">
            <select 
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="h-[36px] px-3 rounded-xl border border-sand/70 bg-white text-taupe font-cabinet font-bold text-[11px] focus:border-saffron outline-none cursor-pointer hover:border-sand transition-all"
            >
              <option value="recommended">Recommended</option>
              <option value="recent">Most Recent</option>
              <option value="popular">Trending</option>
              <option value="rating">Top Rated</option>
              <option value="budget_low">Budget: Low → High</option>
              <option value="budget_high">Budget: High → Low</option>
            </select>

            <button 
              onClick={() => setMobileFilterOpen(true)}
              className="h-[36px] px-3.5 rounded-xl border border-sand/70 bg-white hover:bg-[#FAF5EE] text-taupe font-cabinet font-bold text-[11px] flex items-center gap-1.5 hover:border-sand transition-all"
            >
              <SlidersHorizontal size={13} /> Filters
            </button>
          </div>
        </div>
      </div>

      {/* ---- THREE-COLUMN RESPONSIVE LAYOUT (LinkedIn Style) ---- */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDEBAR: PROFILE & STATS */}
          <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-0">
            <div className="bg-white border border-sand/60 rounded-3xl overflow-hidden shadow-sm">
              {/* Banner — rich saffron gradient with subtle texture */}
              <div className="h-[72px] bg-gradient-to-br from-[#F59E0B] via-saffron to-[#D97706] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.08]" style={{backgroundImage: 'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)', backgroundSize: '12px 12px'}} />
              </div>
              
              {/* Profile info block */}
              <div className="px-5 pb-4 text-center -mt-9 border-b border-sand/50">
                <div className="w-[62px] h-[62px] rounded-full bg-white border-[2.5px] border-white shadow-lg mx-auto flex items-center justify-center font-cabinet font-extrabold text-[20px] text-charcoal">
                  {isAuthenticated ? (authUser?.name?.[0]?.toUpperCase() || "U") : "G"}
                </div>
                <h3 className="font-display font-extrabold text-[15px] text-charcoal mt-2.5 leading-tight">
                  {isAuthenticated ? authUser?.name : "Guest Traveler"}
                </h3>
                <span className="font-mono-dm text-[8.5px] text-saffron bg-[#FEF3E2] border border-amber-100 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest mt-1.5 inline-block">
                  Level 3 Contributor
                </span>
              </div>

              {/* Stats */}
              <div className="p-4 space-y-0">
                {[
                  { label: 'Itineraries Shared', value: '12', color: 'text-saffron' },
                  { label: 'Total Views', value: '1.4k', color: 'text-charcoal' },
                  { label: 'Safety Contributions', value: '98% Verified', color: 'text-[#2D6A4F]' },
                ].map(({ label, value, color }, i, arr) => (
                  <div key={label} className={`flex justify-between items-center py-3 font-cabinet text-[12px] ${i < arr.length - 1 ? 'border-b border-sand/40' : ''}`}>
                    <span className="text-taupe/75 font-semibold">{label}</span>
                    <span className={`${color} font-extrabold`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-white border border-sand rounded-3xl p-5 space-y-3.5 shadow-sm">
              <h4 className="font-cabinet font-extrabold text-[12.5px] text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen size={14} className="text-saffron" /> Quick Access
              </h4>
              <div className="space-y-2.5 text-[12.5px] font-cabinet font-bold text-taupe">
                <Link to="/explore" className="flex items-center gap-2 hover:text-saffron transition-colors">
                  <Compass size={13} className="shrink-0" /> Discover Dashboard
                </Link>
                <Link to="/history" className="flex items-center gap-2 hover:text-saffron transition-colors">
                  <Bookmark size={13} className="shrink-0" /> Your Saved Collection
                </Link>
                <button 
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.error("Please login to share an experience.");
                      navigate("/auth/login");
                    } else {
                      setShareModalOpen(true);
                    }
                  }}
                  className="flex items-center gap-2 hover:text-saffron transition-colors w-full text-left"
                >
                  <PlusCircle size={13} className="shrink-0" /> Publish New Travel Card
                </button>
              </div>
            </div>
          </aside>

          {/* CENTER PANEL: FEED STREAM */}
          <main className="lg:col-span-6 space-y-6">
            
            {/* Start a Post — Premium composer card */}
            <div className="bg-white border border-sand/70 rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
              {/* Input row */}
              <div className="flex gap-3 items-center p-4">
                <div className="w-9 h-9 rounded-full bg-[#FEF3E2] border border-sand/60 flex items-center justify-center font-cabinet font-extrabold text-[13px] text-charcoal shrink-0">
                  {isAuthenticated ? (authUser?.name?.[0]?.toUpperCase() || "U") : "G"}
                </div>
                <button 
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.error("Please login to share a story.");
                      navigate("/auth/login");
                    } else {
                      setShareModalOpen(true);
                    }
                  }}
                  className="flex-1 h-[38px] bg-[#FAF5EE] border border-sand/60 rounded-full text-left px-4 font-cabinet text-[12px] text-taupe/45 hover:bg-[#F5EDE0] hover:border-sand transition-all cursor-pointer"
                >
                  Share a travel log, activity pass, or itinerary...
                </button>
              </div>

              {/* Action row */}
              <div className="flex border-t border-sand/40">
                <button 
                  onClick={() => {
                    if (!isAuthenticated) { toast.error("Please login."); navigate("/auth/login"); }
                    else { setPostType("experience"); setShareModalOpen(true); }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-taupe/70 hover:text-[#3A86C8] hover:bg-[#EFF6FF]/60 font-cabinet font-bold text-[11px] transition-all border-r border-sand/40"
                >
                  <Image size={13} />
                  <span>Photo &amp; Log</span>
                </button>
                <button 
                  onClick={() => {
                    if (!isAuthenticated) { toast.error("Please login."); navigate("/auth/login"); }
                    else { setPostType("trip"); setShareModalOpen(true); }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-taupe/70 hover:text-[#10B981] hover:bg-[#ECFDF5]/60 font-cabinet font-bold text-[11px] transition-all border-r border-sand/40"
                >
                  <FileText size={13} />
                  <span>Itinerary</span>
                </button>
                <button 
                  onClick={() => {
                    if (!isAuthenticated) { toast.error("Please login."); navigate("/auth/login"); }
                    else { setPostType("activity"); setShareModalOpen(true); }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-taupe/70 hover:text-amber-600 hover:bg-amber-50/60 font-cabinet font-bold text-[11px] transition-all"
                >
                  <Landmark size={13} />
                  <span>Activity Pass</span>
                </button>
              </div>
            </div>

            {/* Content filter category navigation pills */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
              {[
                { key: 'All', label: 'All Feeds', icon: null },
                { key: 'trip', label: 'Itineraries', icon: FileText },
                { key: 'experience', label: 'Stories', icon: Image },
                { key: 'activity', label: 'Activities', icon: Landmark },
                { key: 'destination', label: 'Destinations', icon: MapPin },
              ].map(({ key, label, icon: Icon }) => (
                <button 
                  key={key}
                  onClick={() => setSelectedType(key)}
                  className={`h-[30px] px-3.5 rounded-full font-cabinet font-bold text-[11px] tracking-wide transition-all shrink-0 flex items-center gap-1.5 ${
                    selectedType === key
                      ? 'bg-charcoal text-white shadow-sm'
                      : 'bg-white border border-sand/70 text-taupe/70 hover:border-charcoal/30 hover:text-charcoal'
                  }`}
                >
                  {Icon && <Icon size={10} />}
                  {label}
                </button>
              ))}
            </div>

            {/* FEED LOADING / EMPTY / LIST */}
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white border border-sand rounded-3xl p-5 space-y-4 animate-pulse">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-sand/30 shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3.5 bg-sand/30 rounded w-1/4" />
                        <div className="h-2.5 bg-sand/20 rounded w-1/6" />
                      </div>
                    </div>
                    <div className="h-44 bg-sand/20 rounded-2xl" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-white border border-sand rounded-3xl p-8">
                <AlertCircle className="text-red-500 mx-auto mb-3" size={36} />
                <p className="font-cabinet text-[13.5px] text-taupe font-semibold">Could not fetch logs. Please try again.</p>
                <button onClick={fetchPostsData} className="mt-4 px-5 py-2 rounded-xl bg-saffron text-white font-cabinet font-semibold text-[12px]">
                  Retry connection
                </button>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 bg-white border border-sand rounded-3xl p-8 shadow-sm">
                <HelpCircle size={44} className="text-saffron/40 mx-auto mb-3 animate-bounce" />
                <h3 className="font-display font-extrabold text-[16px] text-charcoal">No travel cards found</h3>
                <p className="font-jakarta text-[12px] text-taupe mt-1">Try adjusting your filters or keyword query.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {processedPosts.map(group => {
                  if (group.list.length === 0) return null;
                  return (
                    <div key={group.key} className="space-y-6">
                      {groupBy !== "none" && (
                        <div className="flex items-center gap-3">
                          <span className="font-cabinet font-bold text-[10px] text-saffron uppercase tracking-widest bg-[#FEF3E2] px-3 py-0.5 rounded border border-sand shadow-sm">
                            {group.key}
                          </span>
                          <div className="h-[1px] bg-sand flex-1" />
                          <span className="font-mono-dm text-[9.5px] text-taupe/65">{group.list.length} items</span>
                        </div>
                      )}

                      <div className="space-y-5">
                        {group.list.map(post => {
                          const isLiked = post.likes?.includes(authUser?._id || "current-user");
                          const isSaved = post.saves?.includes(authUser?._id || "current-user");
                          const isCommentsExpanded = expandedCommentsPostId === (post._id || post.id);

                          return (
                            <article 
                              key={post._id || post.id} 
                              className="bg-white border border-sand/70 rounded-3xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.015)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.035)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col md:flex-row md:min-h-[260px]"
                            >
                              {/* Left Side: Photo */}
                              {post.coverImage && (
                                <div className="w-full md:w-[260px] min-h-[180px] md:min-h-full relative overflow-hidden bg-sand/20 shrink-0 border-r border-sand/30">
                                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                                  
                                  <div className="absolute bottom-3 left-3 h-[20px] px-2 rounded-full bg-charcoal/70 backdrop-blur border border-white/15 flex items-center">
                                    <span className="font-mono-dm text-[8.5px] text-white uppercase tracking-wider font-extrabold">
                                      {post.type}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Right Side: Text & Actions */}
                              <div className="p-5 flex-1 flex flex-col justify-between min-w-0">
                                <div>
                                  {/* Author / Header */}
                                  <div className="flex justify-between items-start gap-2 mb-2.5">
                                    <div className="flex gap-2.5 items-center">
                                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-cabinet font-extrabold text-[10px] border border-sand bg-[#FEF3E2] text-charcoal shrink-0">
                                        {post.authorName === 'Gemini-AI-Guide' ? 'AI' : post.authorName[0]}
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-1.5">
                                          <h4 className="font-cabinet font-extrabold text-[12.5px] text-charcoal leading-none">
                                            {post.authorName}
                                          </h4>
                                          {post.authorName === 'Gemini-AI-Guide' && (
                                            <span className="bg-violet-100 text-violet-700 text-[8px] font-mono-dm uppercase font-extrabold px-1.5 py-0.5 rounded border border-violet-200">AI</span>
                                          )}
                                        </div>
                                        <span className="font-mono-dm text-[8.5px] text-taupe/50 mt-0.5 block">
                                          {new Date(post.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                      </div>
                                    </div>

                                    <Bookmark 
                                      size={15} 
                                      className={`${isSaved ? 'text-saffron fill-saffron' : 'text-taupe/40'} hover:text-saffron transition-all shrink-0 cursor-pointer`}
                                      onClick={(e) => handleSave(post._id || post.id, e)}
                                    />
                                  </div>

                                  <div className="flex items-baseline justify-between gap-3">
                                    <h3 className="font-display font-extrabold text-[16.5px] text-charcoal leading-tight truncate">
                                      {post.title}
                                    </h3>
                                    {post.rating && (
                                      <div className="flex items-center gap-0.5 shrink-0 text-accent font-cabinet font-bold text-[11px] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                        <Star size={10.5} className="fill-accent" />
                                        <span>{post.rating}</span>
                                      </div>
                                    )}
                                  </div>

                                  {post.destinationName && (
                                    <div className="flex items-center gap-1 mt-0.5 text-taupe/65">
                                      <MapPin size={10.5} className="text-saffron" />
                                      <span className="font-cabinet font-semibold text-[11px]">{post.destinationName}</span>
                                    </div>
                                  )}

                                  <p className="font-jakarta text-[12.5px] text-taupe mt-2.5 leading-relaxed line-clamp-3">
                                    {post.description}
                                  </p>

                                  {/* Dynamic visual attachments for Travel Posts */}
                                  {post.type === 'trip' && (
                                    <div className="mt-3 bg-[#FAF5EE] border border-sand/65 rounded-xl p-3 flex justify-between items-center gap-3">
                                      <div className="min-w-0">
                                        <h5 className="font-cabinet font-extrabold text-[12.5px] text-charcoal truncate">
                                          {post.duration} Days Plan · Est: ₹{(post.budget || 0).toLocaleString()}
                                        </h5>
                                        <span className="font-mono-dm text-[9px] text-[#2D6A4F] font-bold flex items-center gap-1"><ShieldCheck size={9} /> 91/100 Safe Spot</span>
                                      </div>
                                      <div className="flex gap-1.5 shrink-0 z-10">
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setDetailModalPost(post);
                                          }}
                                          className="h-[28px] px-2.5 rounded-lg border border-sand bg-white text-taupe font-cabinet font-extrabold text-[10px] hover:bg-ivory shadow-xs"
                                        >
                                          Stops
                                        </button>
                                        <button 
                                          onClick={(e) => handleCopyTrip(post, e)}
                                          className="h-[28px] px-3.5 rounded-lg bg-saffron text-white font-cabinet font-extrabold text-[10px] hover:scale-[1.02] shadow-xs"
                                        >
                                          Import
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  {post.type === 'activity' && post.activityDetails && (
                                    <div className="mt-3 bg-[#FAF5EE] border border-sand/65 rounded-xl p-3 flex justify-between items-center gap-3">
                                      <div className="min-w-0">
                                        <h5 className="font-cabinet font-extrabold text-[12.5px] text-charcoal truncate">{post.activityDetails.name}</h5>
                                        <div className="flex gap-2 mt-0.5">
                                          <span className="font-mono-dm text-[9px] text-charcoal font-bold">Cost: ₹{(post.activityDetails.cost || 0).toLocaleString()}</span>
                                          <span className="font-mono-dm text-[9px] text-taupe">· {post.activityDetails.duration}</span>
                                        </div>
                                      </div>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (!isAuthenticated) {
                                            toast.error("Please login to save this activity.");
                                            navigate("/auth/login");
                                          } else {
                                            setAddToTripModalActivity(post);
                                          }
                                        }}
                                        className="h-[28px] px-3.5 rounded-lg bg-[#2D6A4F] text-white font-cabinet font-extrabold text-[10px] hover:scale-[1.02] shadow-xs shrink-0"
                                      >
                                        Add to Trip
                                      </button>
                                    </div>
                                  )}

                                  {/* Tags */}
                                  {post.tags && post.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                      {post.tags.slice(0, 3).map(t => (
                                        <span key={t} className="font-mono-dm text-[9px] text-[#1B4332] bg-[#1B4332]/5 px-2 py-0.5 rounded border border-[#1B4332]/10 font-bold">
                                          #{t}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Reactions Bar */}
                                <div className="mt-4 pt-3 border-t border-sand/40 flex items-center justify-between text-taupe/70">
                                  <div className="flex items-center gap-3.5">
                                    <button 
                                      onClick={(e) => handleLike(post._id || post.id, e)}
                                      className={`flex items-center gap-1 hover:text-saffron transition-all font-cabinet font-extrabold text-[11px] ${isLiked ? 'text-saffron' : ''}`}
                                    >
                                      <ThumbsUp size={13} className={isLiked ? 'fill-saffron text-saffron' : ''} />
                                      {post.likes?.length || 0}
                                    </button>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedCommentsPostId(isCommentsExpanded ? null : (post._id || post.id));
                                      }}
                                      className={`flex items-center gap-1 hover:text-saffron transition-all font-cabinet font-extrabold text-[11px] ${isCommentsExpanded ? 'text-saffron' : ''}`}
                                    >
                                      <MessageSquare size={13} />
                                      {post.comments?.length || 0}
                                    </button>
                                    <button 
                                      onClick={(e) => handleShare(post, e)}
                                      className="p-1 hover:bg-sand rounded-full transition-all"
                                    >
                                      <Share2 size={13} />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Embedded comment thread inside card */}
                              {isCommentsExpanded && (
                                <div className="bg-[#FAF5EE]/60 border-t border-sand/40 p-5 space-y-4" onClick={e => e.stopPropagation()}>
                                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                                    {post.comments?.length === 0 ? (
                                      <p className="font-cabinet text-[11px] text-taupe/65 italic">No comments yet. Send a comment to reply!</p>
                                    ) : (
                                      post.comments.map(c => (
                                        <div key={c._id || c.id} className="flex gap-2.5 items-start text-[12px]">
                                          <div className="w-8 h-8 rounded-full bg-[#FEF3E2] border border-sand flex items-center justify-center font-cabinet font-bold text-taupe text-[11px] shrink-0">
                                            {c.userName[0]}
                                          </div>
                                          <div className="bg-white border border-sand/40 p-3 rounded-2xl flex-1 shadow-sm">
                                            <div className="flex items-center justify-between">
                                              <span className="font-cabinet font-extrabold text-[11.5px] text-charcoal">{c.userName}</span>
                                              <span className="font-mono-dm text-[8.5px] text-taupe/40">{new Date(c.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="font-jakarta text-[12.5px] text-taupe mt-1">{c.comment}</p>
                                          </div>
                                        </div>
                                      ))
                                    )}
                                  </div>

                                  <div className="flex gap-2 pt-3.5 border-t border-sand/40">
                                    <input 
                                      type="text" 
                                      placeholder="Write a comment..." 
                                      value={commentInput}
                                      onChange={e => setCommentInput(e.target.value)}
                                      onKeyDown={e => {
                                        if (e.key === 'Enter') handleAddComment(post._id || post.id);
                                      }}
                                      className="flex-1 h-[36px] border border-sand rounded-xl px-4 font-cabinet text-[12.5px] bg-white outline-none focus:border-saffron focus:ring-1 focus:ring-saffron"
                                    />
                                    <button 
                                      onClick={() => handleAddComment(post._id || post.id)}
                                      disabled={isSubmittingComment || !commentInput.trim()}
                                      className="h-[36px] px-4 rounded-xl bg-saffron text-white font-cabinet font-bold text-[12px] shadow-sm disabled:opacity-50"
                                    >
                                      Send
                                    </button>
                                  </div>
                                </div>
                              )}
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>

          {/* RIGHT SIDEBAR: TRENDING LIST & STICKY GEMINI ASSISTANT PANEL */}
          <aside className="lg:col-span-3 space-y-5 lg:sticky lg:top-0">
            
            {/* Embedded Gemini Chat Panel */}
            <div className="bg-white border border-sand/60 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[380px] transition-shadow duration-300 hover:shadow-md">
              {/* Header */}
              <div className="p-3.5 border-b border-sand/40 bg-gradient-to-r from-[#1B1B2F] to-[#2D2A5E] text-white flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                  <Sparkles size={13} className="text-amber-300" />
                </div>
                <div>
                  <h4 className="font-cabinet font-extrabold text-[12.5px] leading-none">AI Travel Assistant</h4>
                  <span className="font-mono-dm text-[8px] text-white/50 font-bold uppercase tracking-widest block mt-0.5">Powered by Gemini</span>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono-dm text-[8px] text-white/50 font-bold">Online</span>
                </div>
              </div>

              {/* Chat body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF5EE]/30">
                {aiLog.map((log, idx) => (
                  <div key={idx} className={`flex ${log.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-2xl max-w-[85%] text-[11.5px] leading-relaxed shadow-sm ${
                      log.sender === 'user'
                        ? 'bg-saffron text-white rounded-tr-none'
                        : 'bg-white border border-sand text-taupe rounded-tl-none'
                    }`}>
                      {log.text.split("\n").map((line, i) => <p key={i} className="mt-0.5">{line}</p>)}
                    </div>
                  </div>
                ))}
                {isAiTyping && (
                  <div className="flex justify-start">
                    <div className="p-2.5 bg-white border border-sand rounded-2xl rounded-tl-none flex gap-1 items-center shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Suggestions chips */}
              <div className="px-3 py-1.5 bg-[#FAF5EE] border-t border-sand/40 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                {[
                  { label: "Jaipur Tips", prompt: "Recommend tips and safety in Jaipur" },
                  { label: "Goa Sunset", prompt: "Patnem Beach and shacks in Goa" },
                  { label: "Leh Slush", prompt: "Safety checklist for Leh-Manali slush" }
                ].map(chip => (
                  <button
                    key={chip.label}
                    onClick={() => {
                      setAiInput(chip.prompt);
                      setTimeout(() => {
                        setAiLog(prev => [...prev, { sender: "user", text: chip.prompt }]);
                        setIsAiTyping(true);
                        setTimeout(() => {
                          setIsAiTyping(false);
                          let response = "Here is what I analyzed: Jaipur (Pink City) is highly safe (91/100). Visit Amber Fort early at 8 AM and skip monument lines by booking online!";
                          if (chip.prompt.includes("Goa")) {
                            response = "Goa Recommendations:\n-Patnem Beach for a quiet sunset.\n-Fontainhas Latin Quarters walk.\n-Safety: 94/100.";
                          } else if (chip.prompt.includes("Leh")) {
                            response = "Leh Safety Slush Check:\n-Leh-Manali highway open only for 4x4 vehicles.\n-Safety Check: Solang Valley paragliding is closed for 24h due to heavy monsoon rain.";
                          }
                          setAiLog(prev => [...prev, { sender: "ai", text: response }]);
                        }, 800);
                      }, 100);
                    }}
                    className="px-2.5 py-1 bg-white border border-sand rounded-full text-[9px] text-taupe font-cabinet font-extrabold hover:border-saffron hover:text-saffron transition-all whitespace-nowrap"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-sand bg-white flex gap-2 shrink-0">
                <input 
                  type="text" 
                  placeholder="Ask AI Travel advisor..." 
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSendAiPrompt();
                  }}
                  className="flex-1 h-[34px] border border-sand rounded-xl px-3 font-cabinet text-[11.5px] outline-none focus:border-saffron"
                />
                <button 
                  onClick={handleSendAiPrompt}
                  disabled={!aiInput.trim()}
                  className="h-[34px] px-3.5 rounded-xl bg-saffron text-white font-cabinet font-bold text-[11px] disabled:opacity-50"
                >
                  Ask
                </button>
              </div>
            </div>

            {/* Trending Tags list (LinkedIn Style) */}
            <div className="bg-white border border-sand rounded-3xl p-5 space-y-4 shadow-sm">
              <h4 className="font-cabinet font-extrabold text-[12.5px] text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                <Flame size={14} className="text-saffron fill-saffron" /> Trending Topics
              </h4>
              <div className="space-y-3 text-[12.5px] font-cabinet font-bold text-taupe">
                <div className="flex justify-between items-center cursor-pointer hover:text-saffron transition-colors" onClick={() => setSearch("Manali")}>
                  <span>#ManaliAdventure</span>
                  <span className="font-mono-dm text-[10px] text-taupe/40">340 travelers</span>
                </div>
                <div className="flex justify-between items-center cursor-pointer hover:text-saffron transition-colors" onClick={() => setSearch("Japan")}>
                  <span>#JapanCherryBlossom</span>
                  <span className="font-mono-dm text-[10px] text-taupe/40">289 travelers</span>
                </div>
                <div className="flex justify-between items-center cursor-pointer hover:text-saffron transition-colors" onClick={() => setSearch("Goa")}>
                  <span>#OffbeatGoa</span>
                  <span className="font-mono-dm text-[10px] text-taupe/40">156 travelers</span>
                </div>
                <div className="flex justify-between items-center cursor-pointer hover:text-saffron transition-colors" onClick={() => setSearch("Budget")}>
                  <span>#SoloUnder20k</span>
                  <span className="font-mono-dm text-[10px] text-taupe/40">98 travelers</span>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>

      {/* ---- MOBILE FILTER DRAWER ---- */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-[300px] h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-sand">
                <h3 className="font-cabinet font-extrabold text-[15px] text-charcoal">Filter Feeds</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1 hover:bg-sand rounded-full">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-6 mt-6">
                <div>
                  <label className="font-mono-dm text-[10px] text-taupe/65 block mb-2 font-bold uppercase">Travel Style</label>
                  <select 
                    value={selectedStyle} 
                    onChange={e => setSelectedStyle(e.target.value)}
                    className="w-full h-[40px] px-3 border border-sand rounded-xl bg-white text-charcoal font-cabinet text-[13px] outline-none"
                  >
                    <option value="">All Styles</option>
                    {TRAVEL_STYLES.map(style => <option key={style} value={style}>{style}</option>)}
                  </select>
                </div>

                <div>
                  <label className="font-mono-dm text-[10px] text-taupe/65 block mb-2 font-bold uppercase">Budget Limit</label>
                  <select 
                    value={selectedBudget} 
                    onChange={e => setSelectedBudget(e.target.value)}
                    className="w-full h-[40px] px-3 border border-sand rounded-xl bg-white text-charcoal font-cabinet text-[13px] outline-none"
                  >
                    {BUDGET_OPTIONS.map(opt => <option key={opt.label} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="font-mono-dm text-[10px] text-taupe/65 block mb-2 font-bold uppercase">Duration</label>
                  <select 
                    value={selectedDuration} 
                    onChange={e => setSelectedDuration(e.target.value)}
                    className="w-full h-[40px] px-3 border border-sand rounded-xl bg-white text-charcoal font-cabinet text-[13px] outline-none"
                  >
                    {DURATION_OPTIONS.map(opt => <option key={opt.label} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-sand space-y-3">
              <button 
                onClick={handleClearFilters}
                className="w-full h-[42px] rounded-xl border border-sand text-taupe font-cabinet font-semibold text-[13px]"
              >
                Clear All
              </button>
              <button 
                onClick={() => setMobileFilterOpen(false)}
                className="w-full h-[42px] rounded-xl bg-saffron text-white font-cabinet font-bold text-[13px]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- ADD TO TRIP MODAL ---- */}
      {addToTripModalActivity && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-sand rounded-3xl p-6 w-full max-w-[400px] shadow-2xl relative">
            <button 
              onClick={() => setAddToTripModalActivity(null)} 
              className="absolute top-4 right-4 text-taupe hover:text-charcoal"
            >
              <X size={18} />
            </button>
            <h3 className="font-display font-extrabold text-lg text-charcoal">Add Activity to Trip</h3>
            <p className="font-jakarta text-[13px] text-taupe mt-1.5">Choose one of your existing trips to append this activity to:</p>
            
            <div className="space-y-3 mt-5 max-h-[220px] overflow-y-auto pr-1">
              {trips.length === 0 ? (
                <div className="text-center py-6">
                  <p className="font-cabinet text-[13px] text-taupe">No trips found. Create one first!</p>
                  <Link 
                    to="/trips/new"
                    className="mt-3 inline-flex h-9 px-4 items-center bg-saffron text-white rounded-lg font-cabinet font-bold text-[11px]"
                  >
                    Plan a Trip
                  </Link>
                </div>
              ) : (
                trips.map(trip => (
                  <button 
                    key={trip._id} 
                    onClick={() => handleAddActivityToTrip(trip._id)}
                    className="w-full p-3 border border-sand rounded-xl hover:border-saffron text-left font-cabinet font-semibold text-[13px] text-charcoal hover:bg-[#FAF5EE] transition-all flex items-center justify-between"
                  >
                    <span>{trip.tripTitle || trip.location}</span>
                    <span className="font-mono-dm text-[10px] text-taupe bg-ivory px-2 py-0.5 rounded border border-sand">
                      {trip.duration} days
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---- TRIP DETAIL TIMELINE MODAL ---- */}
      {detailModalPost && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-sand rounded-3xl w-full max-w-[800px] shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-5 border-b border-sand flex items-center justify-between shrink-0 bg-white">
              <div>
                <span className="font-mono-dm text-[10px] text-saffron uppercase tracking-widest font-extrabold">Community Trip Itinerary</span>
                <h2 className="font-display font-extrabold text-[24px] text-charcoal mt-1">{detailModalPost.title}</h2>
              </div>
              <button onClick={() => setDetailModalPost(null)} className="p-1 hover:bg-sand rounded-full">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAF5EE]">
              <div className="bg-white border border-sand rounded-2xl p-5 shadow-sm">
                <h3 className="font-cabinet font-extrabold text-[15px] text-charcoal">Itinerary Overview</h3>
                <p className="font-jakarta text-[13px] text-taupe mt-2 leading-relaxed">{detailModalPost.description}</p>
                
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-[#FAF5EE] rounded-xl text-center border border-sand/30">
                    <span className="font-display font-extrabold text-[14px] text-charcoal">{detailModalPost.duration} days</span>
                    <span className="font-mono-dm text-[9px] text-taupe/60 uppercase block mt-1">Duration</span>
                  </div>
                  <div className="p-3 bg-[#FAF5EE] rounded-xl text-center border border-sand/30">
                    <span className="font-display font-extrabold text-[14px] text-[#2D6A4F]">₹{(detailModalPost.budget || 0).toLocaleString()}</span>
                    <span className="font-mono-dm text-[9px] text-taupe/60 uppercase block mt-1">Est. Budget</span>
                  </div>
                  <div className="p-3 bg-[#FAF5EE] rounded-xl text-center border border-sand/30">
                    <span className="font-display font-extrabold text-[14px] text-charcoal">{detailModalPost.destinationName}</span>
                    <span className="font-mono-dm text-[9px] text-taupe/60 uppercase block mt-1">Region</span>
                  </div>
                  <div className="p-3 bg-[#FAF5EE] rounded-xl text-center border border-sand/30">
                    <span className="font-display font-extrabold text-[14px] text-charcoal">{detailModalPost.rating || 'N/A'}</span>
                    <span className="font-mono-dm text-[9px] text-taupe/60 uppercase block mt-1">Rating</span>
                  </div>
                </div>
              </div>

              {/* Day Timeline Rendering */}
              {detailModalPost.tripData?.dailyItinerary && (
                <div className="space-y-6">
                  <h3 className="font-display font-extrabold text-[16px] text-charcoal">Day-by-Day Stops</h3>
                  {detailModalPost.tripData.dailyItinerary.map(day => (
                    <div key={day.day} className="bg-white border border-sand rounded-2xl p-5 shadow-sm space-y-4">
                      <div className="pb-3 border-b border-sand flex items-center justify-between">
                        <h4 className="font-cabinet font-extrabold text-[14.5px] text-charcoal">Day {day.day} — {day.theme}</h4>
                      </div>
                      
                      <div className="space-y-3">
                        {day.activities?.map((a, i) => (
                          <div key={i} className="flex gap-3 items-start border-l-2 border-saffron/30 pl-4 py-1">
                            <Clock size={12} className="text-saffron mt-1 shrink-0" />
                            <div>
                              <h5 className="font-cabinet font-bold text-[13px] text-charcoal flex items-center gap-2">
                                {a.time} - {a.activity}
                                {a.location && <span className="font-mono-dm text-[9px] text-taupe/65 flex items-center gap-0.5"><MapPin size={8} className="inline" /> {a.location}</span>}
                              </h5>
                              <p className="font-jakarta text-[12px] text-taupe mt-1">{a.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {day.safetyNotes && (
                        <div className="p-3 bg-[#C0392B]/5 border border-[#C0392B]/20 rounded-xl flex items-start gap-2">
                          <span className="font-mono-dm text-[9.5px] text-[#C0392B] font-bold uppercase shrink-0 mt-0.5">Safety Check:</span>
                          <p className="font-jakarta text-[11.5px] text-[#C0392B]">{day.safetyNotes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-5 border-t border-sand shrink-0 bg-white flex justify-between items-center">
              <button 
                onClick={() => setDetailModalPost(null)}
                className="h-[40px] px-6 rounded-full border border-sand text-taupe font-cabinet font-extrabold text-[13px]"
              >
                Close View
              </button>
              <button 
                onClick={(e) => {
                  handleCopyTrip(detailModalPost, e);
                  setDetailModalPost(null);
                }}
                className="h-[40px] px-6 rounded-full bg-saffron text-white font-cabinet font-bold text-[13px] hover:shadow-saffron hover:scale-[1.02] transition-all"
              >
                Import/Copy Itinerary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- SHARE EXPERIENCE MODAL ---- */}
      {shareModalOpen && (
        <ShareExperienceModal 
          onClose={() => setShareModalOpen(false)} 
          trips={trips}
          onSuccess={() => {
            setShareModalOpen(false);
            fetchPostsData();
          }}
        />
      )}
    </div>
  );
}

/* ================================================================
   SHARE EXPERIENCE MODAL COMPONENT
   ================================================================ */
function ShareExperienceModal({ onClose, trips, onSuccess }) {
  const [postType, setPostType] = useState("experience");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [rating, setRating] = useState(5);
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const [selectedTripId, setSelectedTripId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitPost = async () => {
    if (!title || !description || !destinationName) {
      toast.error("Please fill in the required fields (Title, Description, Destination Name).");
      return;
    }

    setIsSubmitting(true);
    try {
      const tags = tagsInput.split(",").map(t => t.trim().replace("#", "")).filter(t => t);
      
      const postData = {
        type: postType,
        title,
        description,
        destinationName,
        tags,
        rating: parseFloat(rating),
        budget: parseInt(budget) || 0,
        duration: parseInt(duration) || 1,
        travelStyle: tags.filter(t => TRAVEL_STYLES.map(s => s.toLowerCase()).includes(t.toLowerCase())),
        tripId: postType === 'trip' ? selectedTripId : null
      };

      if (postType === 'trip' && selectedTripId) {
        const trip = trips.find(t => t._id === selectedTripId);
        if (trip) {
          postData.coverImage = trip.dailyItinerary?.[0]?.activities?.[0]?.photoUrl || "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80";
          postData.duration = trip.duration;
          postData.budget = parseInt(trip.estimatedCosts?.total.replace(/[^0-9]/g, "")) || 0;
        }
      } else {
        postData.coverImage = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80";
      }

      await communityService.createPost(postData);
      toast.success("Experience shared to community feed!");
      onSuccess();
    } catch (err) {
      toast.error("Failed to post experience");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 font-jakarta">
      <div className="bg-white border border-sand rounded-3xl w-full max-w-[500px] shadow-2xl relative flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-sand flex items-center justify-between shrink-0">
          <h3 className="font-display font-extrabold text-[20px] text-charcoal">Share Travel Card</h3>
          <button onClick={onClose} className="p-1 hover:bg-sand rounded-full">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Post Type Selector */}
          <div>
            <label className="font-mono-dm text-[10px] text-taupe/65 uppercase tracking-wider block mb-2 font-bold">Card Type</label>
            <div className="flex gap-2 p-1 bg-[#FAF5EE] rounded-xl border border-sand">
              {["experience", "trip", "activity"].map(type => (
                <button 
                  key={type}
                  type="button"
                  onClick={() => setPostType(type)}
                  className={`flex-1 h-[32px] rounded-lg font-cabinet font-semibold text-[12px] capitalize transition-all ${
                    postType === type 
                      ? "bg-saffron text-white shadow-sm" 
                      : "text-taupe hover:text-charcoal"
                  }`}
                >
                  {type === 'experience' ? 'Story Card' : type === 'trip' ? 'Itinerary File' : 'Activity Card'}
                </button>
              ))}
            </div>
          </div>

          {/* Select Trip if postType is Trip */}
          {postType === "trip" && (
            <div>
              <label className="font-mono-dm text-[10px] text-taupe/65 uppercase tracking-wider block mb-2 font-bold">Select Itinerary</label>
              <select 
                value={selectedTripId}
                onChange={e => {
                  setSelectedTripId(e.target.value);
                  const trip = trips.find(t => t._id === e.target.value);
                  if (trip) {
                    setTitle(`My ${trip.tripTitle || trip.location} Itinerary`);
                    setDestinationName(trip.location);
                  }
                }}
                className="w-full h-[44px] px-3 border border-sand rounded-xl bg-white text-charcoal font-cabinet text-[13px] outline-none focus:border-saffron"
              >
                <option value="">-- Choose one of your trips --</option>
                {trips.map(trip => (
                  <option key={trip._id} value={trip._id}>{trip.tripTitle || trip.location}</option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="font-mono-dm text-[10px] text-taupe/65 uppercase tracking-wider block mb-2 font-bold font-bold">Card Title *</label>
            <input 
              type="text" 
              placeholder="e.g., Hidden sunset spot or 4 Days in Kyoto" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full h-[44px] border border-sand rounded-xl px-4 font-cabinet text-[13px] outline-none focus:border-saffron"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="font-mono-dm text-[10px] text-taupe/65 uppercase tracking-wider block mb-2 font-bold">Destination Location *</label>
            <input 
              type="text" 
              placeholder="e.g. Kyoto, Japan or Goa, India" 
              value={destinationName}
              onChange={e => setDestinationName(e.target.value)}
              className="w-full h-[44px] border border-sand rounded-xl px-4 font-cabinet text-[13px] outline-none focus:border-saffron"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-mono-dm text-[10px] text-taupe/65 uppercase tracking-wider block mb-2 font-bold">Description & Tips *</label>
            <textarea 
              placeholder="Write travel instructions, packing tips, or local advice..." 
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full h-[120px] border border-sand rounded-xl p-4 font-cabinet text-[13px] outline-none focus:border-saffron resize-none"
            />
          </div>

          {/* Budget, Duration, Rating Grid */}
          {postType !== "trip" && (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-mono-dm text-[9.5px] text-taupe/65 uppercase block mb-1.5 font-bold">Cost (₹)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 2500" 
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  className="w-full h-[40px] border border-sand rounded-xl px-3 font-cabinet text-[13px] outline-none focus:border-saffron"
                />
              </div>
              <div>
                <label className="font-mono-dm text-[9.5px] text-taupe/65 uppercase block mb-1.5 font-bold">Duration (Days)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 1" 
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  className="w-full h-[40px] border border-sand rounded-xl px-3 font-cabinet text-[13px] outline-none focus:border-saffron"
                />
              </div>
              <div>
                <label className="font-mono-dm text-[9.5px] text-taupe/65 uppercase block mb-1.5 font-bold">Rating (1-5)</label>
                <select 
                  value={rating}
                  onChange={e => setRating(e.target.value)}
                  className="w-full h-[40px] border border-sand rounded-xl px-3 bg-white text-charcoal font-cabinet text-[13px] outline-none"
                >
                  {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="font-mono-dm text-[10px] text-taupe/65 uppercase tracking-wider block mb-2 font-bold">Tags (comma-separated)</label>
            <input 
              type="text" 
              placeholder="e.g. Japan, Adventure, Budget, StreetFood" 
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              className="w-full h-[44px] border border-sand rounded-xl px-4 font-cabinet text-[13px] outline-none focus:border-saffron"
            />
          </div>
        </div>

        <div className="p-5 border-t border-sand shrink-0 bg-white rounded-b-2xl flex justify-between gap-4">
          <button 
            onClick={onClose}
            className="flex-1 h-[44px] rounded-xl border border-sand text-taupe font-cabinet font-semibold text-[13px]"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmitPost}
            disabled={isSubmitting}
            className="flex-1 h-[44px] rounded-xl bg-saffron text-white font-cabinet font-bold text-[13px] flex items-center justify-center gap-2 shadow-sm"
          >
            {isSubmitting ? (
              <><Loader2 size={16} className="animate-spin" /> Publishing...</>
            ) : (
              "Publish Post"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
