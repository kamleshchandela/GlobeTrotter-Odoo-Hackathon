import { useState, useRef } from "react";
import { X, ThumbsUp, Bookmark, MapPin, ChevronDown, Upload, Camera, Info, Loader2, Trash2 } from "lucide-react";
import TopAppBar from "../../components/shared/TopAppBar";
import toast, { Toaster } from "react-hot-toast";

/* ================================================================
   PAGE 5 — Community Spots + Submit a Hidden Gem (Split-Panel)
   Desktop 1440px · #FFF8F0 · 1200px content
   ================================================================ */

const PHOTOS = {
  dholavira: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
  lepakshi: "https://images.unsplash.com/photo-1600100397608-40ce1040f8e5?auto=format&fit=crop&w=600&q=80",
  chopta: "https://images.unsplash.com/photo-1626621331169-5f34be280ed9?auto=format&fit=crop&w=600&q=80",
  ranikiVav: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80",
  auroville: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
  nubra: "https://images.unsplash.com/photo-1506038634487-60a69ae4b7b1?auto=format&fit=crop&w=600&q=80",
};

const LARGE_SPOTS = [
  { name:"Dholavira", loc:"Gujarat", tags:["Ancient","UNESCO"], by:"Vikram T.", votes:1240, photo:PHOTOS.dholavira },
];
const SMALL_SPOTS = [
  { name:"Lepakshi Temple", loc:"Andhra Pradesh", tags:["Heritage","Mysterious"], by:"Priya M.", votes:890, photo:PHOTOS.lepakshi },
  { name:"Chopta Meadows", loc:"Uttarakhand", tags:["Mountains","Remote"], by:"Rohan K.", votes:720, photo:PHOTOS.chopta },
];
const REG_SPOTS = [
  { name:"Rani ki Vav", loc:"Patan, Gujarat", desc:"An 11th-century stepwell with over 500 sculpted figures across seven levels.", tags:["Heritage","Art"], by:"Aisha R.", votes:1050, photo:PHOTOS.ranikiVav },
  { name:"Auroville", loc:"Pondicherry", desc:"An experimental township of 50,000 people from around the world living together.", tags:["Community","Unique"], by:"Karan D.", votes:960, photo:PHOTOS.auroville },
  { name:"Nubra Valley", loc:"Ladakh", desc:"A high-altitude cold desert with Bactrian double-humped camels — unlike anywhere else in India.", tags:["Desert","Remote"], by:"Meera S.", votes:1130, photo:PHOTOS.nubra },
];

const CATEGORIES = ["All","Nature","Heritage","Food","Culture","Adventure","Spiritual"];
const TYPE_CHIPS = ["Nature","Heritage","Food","Culture","Adventure","Spiritual","Festival","Offbeat"];
const VIBE_CHIPS = ["Remote","Serene","Spiritual","Adventurous","Historical","Offbeat","Surreal","Mysterious","Scenic","Sacred","Vast","Quiet"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/* ---------- reusable inline card pieces ---------- */
const Tag = ({children}) => <span className="px-[8px] py-[3px] rounded-[6px] bg-[#FEF3E2] border border-[#E8D5B7] font-mono-dm text-[10px] text-[#6B4F3A]">{children}</span>;
const TagWhite = ({children}) => <span className="px-[8px] py-[3px] rounded-[6px] bg-white/20 border border-white/30 font-mono-dm text-[10px] text-white/90">{children}</span>;

/* ============ overlay card (large / small) ============ */
function OverlayCard({ spot, tall }) {
  return (
    <div className={`relative rounded-[16px] overflow-hidden shadow-[0_4px_16px_rgba(30,20,16,0.10)] group ${tall ? "h-[380px]" : "h-[380px]"}`}>
      <img src={spot.photo} alt={spot.name} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0" style={{background:"linear-gradient(180deg, transparent 50%, rgba(20,14,10,0.70) 100%)"}} />
      <div className="absolute bottom-0 left-0 right-0 p-[20px] flex flex-col gap-[6px]">
        <div className="flex gap-[6px]">{spot.tags.map(t => <TagWhite key={t}>{t}</TagWhite>)}</div>
        <p className="font-mono-dm text-[11px] text-white/65">{spot.loc}</p>
        <h3 className="font-display font-bold text-[22px] text-white leading-tight">{spot.name}</h3>
        <div className="flex items-center gap-[8px] mt-[4px]">
          <div className="w-[28px] h-[28px] rounded-full bg-white/20 flex items-center justify-center"><span className="font-cabinet font-bold text-[10px] text-white">{spot.by[0]}</span></div>
          <span className="font-mono-dm text-[10px] text-white/65">Submitted by {spot.by}</span>
        </div>
      </div>
      <div className="absolute bottom-[20px] right-[20px] flex items-center gap-[6px]">
        <ThumbsUp size={14} className="text-white/60" />
        <span className="font-mono-dm text-[10px] text-white/60">{spot.votes.toLocaleString()}</span>
      </div>
    </div>
  );
}

/* ============ regular white card ============ */
function RegCard({ spot }) {
  return (
    <div className="bg-white border border-[#E8D5B7] rounded-[14px] overflow-hidden shadow-[0_2px_8px_rgba(30,20,16,0.07)]">
      <img src={spot.photo} alt={spot.name} className="w-full h-[180px] object-cover" />
      <div className="p-[16px]">
        <h4 className="font-cabinet font-semibold text-[16px] text-[#1E1410]">{spot.name}</h4>
        <p className="font-mono-dm text-[10px] text-[#6B4F3A] mt-[2px]">{spot.loc}</p>
        <p className="font-jakarta text-[13px] text-[#6B4F3A] leading-[1.5] mt-[6px] line-clamp-3">{spot.desc}</p>
        <div className="mt-[8px] flex gap-[6px]">{spot.tags.map(t => <Tag key={t}>{t}</Tag>)}</div>
        <div className="mt-[10px] flex items-center justify-between">
          <div className="flex items-center gap-[6px]">
            <div className="w-[24px] h-[24px] rounded-full bg-[#FEF3E2] flex items-center justify-center"><span className="font-cabinet font-bold text-[9px] text-[#6B4F3A]">{spot.by[0]}</span></div>
            <span className="font-jakarta text-[12px] text-[#B09880]">{spot.by}</span>
            <span className="font-mono-dm text-[10px] text-[#B09880] ml-[8px]">{spot.votes.toLocaleString()} ↑</span>
          </div>
          <Bookmark size={16} className="text-[#E8640C] cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

/* ============================ MAIN ============================ */
export default function CommunitySpots() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeCat, setActiveCat] = useState("All");

  /* form state */
  const [placeName, setPlaceName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [selType, setSelType] = useState([]);
  const [desc, setDesc] = useState("");
  const [vibes, setVibes] = useState([]);
  const [fromMonth, setFromMonth] = useState("");
  const [toMonth, setToMonth] = useState("");
  const [tip, setTip] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 5) {
      toast.error("You can only upload up to 5 photos.");
      return;
    }

    const newPhotos = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));

    setPhotos(prev => [...prev, ...newPhotos]);
    toast.success(`${files.length} photo(s) added.`);
  };

  const removePhoto = (index) => {
    setPhotos(prev => {
      const newArr = [...prev];
      URL.revokeObjectURL(newArr[index].url);
      newArr.splice(index, 1);
      return newArr;
    });
  };

  const handleSubmit = async () => {
    if (!placeName || !city || !state || !desc || selType.length === 0) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Hidden gem submitted successfully! It will be reviewed soon.");
      setDrawerOpen(false);
      // Reset form
      setPlaceName(""); setCity(""); setState(""); setSelType([]); setDesc(""); setVibes([]); setFromMonth(""); setToMonth(""); setTip(""); setPhotos([]);
    } catch (err) {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleArr = (arr, set, val, max) => {
    if (arr.includes(val)) set(arr.filter(v => v !== val));
    else if (!max || arr.length < max) set([...arr, val]);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <TopAppBar variant="logo" />
      <Toaster position="top-right" />

      {/* ---- MAIN CONTENT ---- */}
      <div className="pt-[64px]" style={{marginRight: drawerOpen ? "512px" : "0", transition:"margin 0.3s ease"}}>
        <div className="max-w-[1200px] mx-auto px-[24px]">

          {/* ZONE 1 — Hero */}
          <div className="flex items-start justify-between gap-[48px]">
            <div className="max-w-[60%]">
              <p className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px]">Community Discovers</p>
              <h1 className="font-display font-bold text-[44px] text-[#1E1410] leading-[1.1] mt-[8px]">Spots found by real travelers.</h1>
              <p className="font-jakarta text-[16px] text-[#6B4F3A] leading-[1.6] mt-[12px] max-w-[480px]">Every place here was submitted by someone who actually visited it. Not a guidebook. Not a blog. Real people, real places.</p>
              <div className="mt-[24px] flex gap-[12px]">
                <button onClick={() => setDrawerOpen(true)} className="h-[48px] px-[28px] rounded-[12px] bg-[#E8640C] text-white font-cabinet font-semibold text-[14px]">Submit a Hidden Gem</button>
                <button onClick={() => setActiveCat("All")} className="h-[48px] px-[28px] rounded-[12px] border-[1.5px] border-[#E8640C] text-[#E8640C] font-cabinet font-semibold text-[14px]">View All Spots</button>
              </div>
            </div>
            <div className="flex flex-col items-end gap-[16px] pt-[12px]">
              {[{val:"2,400+",label:"Spots Submitted"},{val:"18 States",label:"Covered"},{val:"840+",label:"Verified by Community"}].map(s => (
                <div key={s.label} className="text-right">
                  <p className="font-display font-bold text-[36px] text-[#1E1410] leading-none">{s.val}</p>
                  <p className="font-mono-dm text-[11px] text-[#B09880] uppercase mt-[2px]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ZONE 2 — Filter Bar */}
          <div className="mt-[32px] bg-white border border-[#E8D5B7] rounded-[12px] px-[20px] py-[14px] flex items-center justify-between">
            <div className="flex gap-[6px]">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setActiveCat(c)} className={`h-[32px] px-[16px] rounded-[100px] font-cabinet font-medium text-[12px] transition-colors ${activeCat === c ? "bg-[#E8640C] text-white" : "bg-[#FEF3E2] text-[#6B4F3A] border border-[#E8D5B7]"}`}>{c}</button>
              ))}
            </div>
            <button className="flex items-center gap-[6px] font-mono-dm text-[11px] text-[#6B4F3A]">Sort: Most Recent <ChevronDown size={12} /></button>
          </div>

          {/* ZONE 3 — Grid */}
          <div className="mt-[24px] pb-[80px]">
            {/* Row 1: 1 large + 2 small */}
            <div className="grid grid-cols-[1fr_288px_288px] gap-[20px]">
              <OverlayCard spot={LARGE_SPOTS[0]} tall />
              {SMALL_SPOTS.map(s => <OverlayCard key={s.name} spot={s} />)}
            </div>
            {/* Row 2: 3 equal */}
            <div className="grid grid-cols-3 gap-[20px] mt-[20px]">
              {REG_SPOTS.map(s => <RegCard key={s.name} spot={s} />)}
            </div>
          </div>
        </div>
      </div>

      {/* ---- SUBMIT DRAWER ---- */}
      <div className={`fixed top-[64px] right-0 h-[calc(100vh-64px)] w-[480px] bg-white border-l border-[#E8D5B7] shadow-[-8px_0_32px_rgba(30,20,16,0.12)] z-50 overflow-y-auto transition-transform duration-300 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`} style={{padding:"32px"}}>
        <button onClick={() => setDrawerOpen(false)} className="absolute top-[24px] right-[24px] text-[#B09880] hover:text-[#1E1410]"><X size={18} /></button>

        <h2 className="font-display font-bold text-[28px] text-[#1E1410]">Share a hidden spot.</h2>
        <p className="font-jakarta text-[14px] text-[#6B4F3A] mt-[8px] max-w-[400px] leading-[1.6]">Found a place that deserves to be known? Add it here. It will be reviewed and listed for all travelers.</p>

        {/* A — Place Name */}
        <div className="mt-[28px]">
          <label className="font-mono-dm text-[10px] text-[#B09880] uppercase tracking-[2px]">Place Name</label>
          <input value={placeName} onChange={e => setPlaceName(e.target.value)} placeholder="What is this place called?" className="mt-[6px] w-full h-[48px] rounded-[10px] border-[1.5px] border-[#E8D5B7] px-[14px] font-jakarta text-[14px] text-[#1E1410] placeholder:text-[#B09880] focus:border-[#E8640C] focus:outline-none transition-colors" />
        </div>

        {/* B — Location */}
        <div className="mt-[20px]">
          <label className="font-mono-dm text-[10px] text-[#B09880] uppercase tracking-[2px]">Location</label>
          <div className="mt-[6px] flex gap-[12px]">
            <input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g., Chopta" className="flex-1 h-[48px] rounded-[10px] border-[1.5px] border-[#E8D5B7] px-[14px] font-jakarta text-[14px] text-[#1E1410] placeholder:text-[#B09880] focus:border-[#E8640C] focus:outline-none" />
            <input value={state} onChange={e => setState(e.target.value)} placeholder="e.g., Uttarakhand" className="flex-1 h-[48px] rounded-[10px] border-[1.5px] border-[#E8D5B7] px-[14px] font-jakarta text-[14px] text-[#1E1410] placeholder:text-[#B09880] focus:border-[#E8640C] focus:outline-none" />
          </div>
          <button 
            onClick={() => toast.success("Map picker coming soon! For now, please enter the city and state manually.")}
            className="mt-[8px] flex items-center gap-[6px] font-cabinet font-medium text-[13px] text-[#E8640C]"
          >
            <MapPin size={13} /> Or pick location on map
          </button>
        </div>

        {/* C — Category */}
        <div className="mt-[20px]">
          <label className="font-mono-dm text-[10px] text-[#B09880] uppercase tracking-[2px]">What type of place is this?</label>
          <div className="mt-[8px] flex flex-wrap gap-[6px]">
            {TYPE_CHIPS.map(c => (
              <button key={c} onClick={() => toggleArr(selType, setSelType, c)} className={`h-[32px] px-[14px] rounded-[100px] font-cabinet font-medium text-[12px] transition-colors ${selType.includes(c) ? "bg-[#E8640C] text-white" : "bg-[#FEF3E2] text-[#6B4F3A] border border-[#E8D5B7]"}`}>{c}</button>
            ))}
          </div>
        </div>

        {/* D — Description */}
        <div className="mt-[20px]">
          <label className="font-mono-dm text-[10px] text-[#B09880] uppercase tracking-[2px]">Describe this place</label>
          <div className="relative mt-[6px]">
            <textarea value={desc} onChange={e => e.target.value.length <= 400 && setDesc(e.target.value)} placeholder="What makes this place special? What should travelers know before visiting?" className="w-full h-[140px] rounded-[10px] border-[1.5px] border-[#E8D5B7] p-[14px] font-jakarta text-[14px] text-[#1E1410] placeholder:text-[#B09880] focus:border-[#E8640C] focus:outline-none resize-none leading-[1.5]" />
            <span className="absolute bottom-[10px] right-[14px] font-mono-dm text-[11px] text-[#B09880]">{desc.length} / 400</span>
          </div>
        </div>

        {/* E — Vibe Tags */}
        <div className="mt-[20px]">
          <label className="font-mono-dm text-[10px] text-[#B09880] uppercase tracking-[2px]">Vibe Tags</label>
          <p className="font-jakarta text-[12px] text-[#B09880] mt-[2px]">Pick 2–3 words that describe the feeling of this place.</p>
          <div className="mt-[8px] flex flex-wrap gap-[6px]">
            {VIBE_CHIPS.map(v => (
              <button key={v} onClick={() => toggleArr(vibes, setVibes, v, 3)} className={`h-[30px] px-[12px] rounded-[100px] font-cabinet font-medium text-[11px] transition-colors ${vibes.includes(v) ? "bg-[#E8640C] text-white" : "bg-[#FEF3E2] text-[#6B4F3A] border border-[#E8D5B7]"}`}>{v}</button>
            ))}
          </div>
        </div>

        {/* F — Best Time */}
        <div className="mt-[20px]">
          <label className="font-mono-dm text-[10px] text-[#B09880] uppercase tracking-[2px]">Best Time to Visit</label>
          <div className="mt-[6px] flex gap-[12px]">
            <select value={fromMonth} onChange={e => setFromMonth(e.target.value)} className="flex-1 h-[48px] rounded-[10px] border-[1.5px] border-[#E8D5B7] px-[14px] font-jakarta text-[14px] text-[#1E1410] focus:border-[#E8640C] focus:outline-none appearance-none bg-white">
              <option value="">From month</option>
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={toMonth} onChange={e => setToMonth(e.target.value)} className="flex-1 h-[48px] rounded-[10px] border-[1.5px] border-[#E8D5B7] px-[14px] font-jakarta text-[14px] text-[#1E1410] focus:border-[#E8640C] focus:outline-none appearance-none bg-white">
              <option value="">To month</option>
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        {/* G — Insider Tip */}
        <div className="mt-[20px]">
          <label className="font-mono-dm text-[10px] text-[#B09880] uppercase tracking-[2px]">Your Insider Tip</label>
          <p className="font-jakarta text-[12px] text-[#B09880] mt-[2px]">Optional but very helpful for travelers.</p>
          <textarea value={tip} onChange={e => setTip(e.target.value)} placeholder="e.g., Arrive before 8 AM — you will have the place to yourself." className="mt-[6px] w-full h-[80px] rounded-[10px] border-[1.5px] border-[#E8D5B7] p-[14px] font-jakarta text-[14px] text-[#1E1410] placeholder:text-[#B09880] focus:border-[#E8640C] focus:outline-none resize-none" />
        </div>

        {/* H — Upload Photos */}
        <div className="mt-[20px]">
          <label className="font-mono-dm text-[10px] text-[#B09880] uppercase tracking-[2px]">Upload Photos</label>
          <p className="font-jakarta text-[12px] text-[#B09880] mt-[2px]">Real photos only. No filters, no AI images. Max 5 photos, 5MB each.</p>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handlePhotoUpload} 
            multiple 
            accept="image/*" 
            className="hidden" 
          />

          <div 
            onClick={() => fileInputRef.current?.click()}
            className="mt-[8px] border-[2px] border-dashed border-[#E8D5B7] rounded-[12px] bg-[#FAFAF8] p-[28px] text-center cursor-pointer hover:border-[#E8640C] transition-colors"
          >
            <Upload size={32} className="text-[#B09880] mx-auto" />
            <p className="font-cabinet font-medium text-[14px] text-[#6B4F3A] mt-[8px]">Drop photos here or click to upload</p>
            <p className="font-jakarta text-[12px] text-[#B09880] mt-[4px]">JPG, PNG up to 5MB each</p>
          </div>

          {photos.length > 0 && (
            <div className="mt-[12px] flex gap-[8px] flex-wrap">
              {photos.map((p, i) => (
                <div key={i} className="relative w-[60px] h-[60px] rounded-[8px] overflow-hidden group">
                  <img src={p.url} className="w-full h-full object-cover" alt="Preview" />
                  <button 
                    onClick={() => removePhoto(i)}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Preview */}
        <div className="mt-[24px] bg-white border border-[#E8D5B7] rounded-[14px] overflow-hidden shadow-[0_4px_16px_rgba(30,20,16,0.08)]">
          <div className="h-[160px] bg-[#FEF3E2] flex items-center justify-center relative">
            {photos.length > 0 ? (
              <img src={photos[0].url} className="w-full h-full object-cover" alt="Preview Hero" />
            ) : (
              <Camera size={32} className="text-[#E8D5B7]" />
            )}
          </div>
          <div className="p-[14px]">
            <h4 className="font-cabinet font-bold text-[16px] text-[#1E1410]">{placeName || "Place name"}</h4>
            <p className="font-mono-dm text-[10px] text-[#6B4F3A]">{city || "City"}{state ? `, ${state}` : ""}</p>
            {vibes.length > 0 && <div className="mt-[6px] flex gap-[4px]">{vibes.map(v => <Tag key={v}>{v}</Tag>)}</div>}
            {desc && <p className="font-jakarta text-[12px] text-[#6B4F3A] mt-[6px] line-clamp-3">{desc.slice(0,120)}{desc.length > 120 ? "…" : ""}</p>}
            <div className="mt-[8px] flex items-center justify-between">
              <div className="flex items-center gap-[6px]"><Bookmark size={14} className="text-[#B09880]" /><span className="font-jakarta text-[12px] text-[#B09880]">Save to My Places</span></div>
              <span className="font-mono-dm text-[10px] text-[#B09880]">Submitted by You</span>
            </div>
          </div>
        </div>

        {/* Info note */}
        <div className="mt-[12px] bg-[#FEF3E2] border border-[#E8D5B7] rounded-[10px] p-[14px] flex items-start gap-[10px]">
          <Info size={14} className="text-[#F0A500] shrink-0 mt-[2px]" />
          <p className="font-jakarta text-[12px] text-[#6B4F3A] leading-[1.5]">We verify all submissions before publishing. AI-generated images or fake places will be rejected.</p>
        </div>

        {/* Submit */}
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="mt-[20px] w-full h-[52px] rounded-[12px] bg-[#E8640C] text-white font-cabinet font-semibold text-[15px] flex items-center justify-center gap-2 hover:brightness-105 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <><Loader2 size={20} className="animate-spin" /> Submitting...</>
          ) : (
            "Submit Hidden Gem"
          )}
        </button>
        <p className="font-jakarta text-[12px] text-[#B09880] text-center mt-[10px]">Your submission will be reviewed within 48 hours before it goes live.</p>
        <div className="h-[32px]" />
      </div>
    </div>
  );
}
