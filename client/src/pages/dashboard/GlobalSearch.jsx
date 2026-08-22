import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Search as SearchIcon, X, Clock, TrendingUp, MapPin, Shield, Cross, Compass, Map, Star, ChevronRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

// Custom Question Mark inside Search Icon for State C
const NoResultIcon = () => (
  <div className="relative w-[56px] h-[56px] flex items-center justify-center mx-auto">
    <SearchIcon className="w-[28px] h-[28px] text-[#B09880] stroke-[1.5px]" />
    <div className="absolute inset-0 flex items-center justify-center font-display font-black text-[14px] text-[#B09880] pt-1">
      ?
    </div>
  </div>
);

// Skeleton Row Component
const SkeletonRow = ({ height = 64 }) => (
  <div className="bg-[#FFFFFF] border border-[#E8D5B7] rounded-[14px] px-3.5 flex items-center animate-pulse mb-2" style={{ height: `${height}px` }}>
    <div className="w-[44px] h-[44px] rounded-[10px] bg-[#E8D5B7]/40 shrink-0" />
    <div className="ml-3 flex-1 flex flex-col gap-2">
      <div className="w-[120px] h-2 bg-[#E8D5B7]/40 rounded-full" />
      <div className="w-[80px] h-2 bg-[#E8D5B7]/40 rounded-full" />
    </div>
  </div>
);

export default function GlobalSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Simulate networking delay
  useEffect(() => {
    if (query) {
      setIsSearching(true);
      const timer = setTimeout(() => setIsSearching(false), 300);
      return () => clearTimeout(timer);
    }
  }, [query]);

  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const handleChipClick = (text) => {
    setQuery(text);
  };

  // Determine State
  const currentState = query === "" ? "A" : (query.toLowerCase() === "zxcvb" ? "C" : "B");

  return (
    <DashboardLayout hideActiveTab={true}>
      
      {/* 56px Top App Bar Search Variant */}
      <div className="h-[56px] bg-[#FFFFFF] border-b border-[#E8D5B7] px-4 flex items-center justify-between sticky top-0 z-50">
        <button 
          className="w-[44px] h-[44px] flex items-center justify-center -ml-2 shrink-0" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-[22px] h-[22px] text-[#1E1410]" />
        </button>
        
        <div className="flex-1 relative mx-[14px]">
          <SearchIcon className="absolute left-[12px] top-1/2 -translate-y-1/2 w-4 h-4 text-[#B09880]" />
          <input 
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destinations, doctors, guardians..."
            className="w-full h-[36px] bg-[#FEF3E2] border border-[#E8D5B7] rounded-full pl-[36px] pr-9 font-jakarta text-[15px] text-[#1E1410] placeholder:text-[#B09880] focus:outline-none focus:border-[1.5px] focus:border-[#E8640C] focus:shadow-[0_0_0_3px_rgba(232,100,12,0.12)] transition-shadow"
          />
          {query && (
            <button 
              onClick={clearSearch} 
              className="absolute right-[10px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full flex items-center justify-center border border-[#B09880] bg-white hover:bg-[#FEF3E2]"
            >
               <X className="w-2.5 h-2.5 text-[#B09880] stroke-[3px]" />
            </button>
          )}
        </div>

        <div className="w-[32px] h-[32px] rounded-full border-[1.5px] border-[#E8D5B7] overflow-hidden shrink-0">
          <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200" alt="User" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-md mx-auto w-full pb-[24px]">
        
        {/* STATE A — EMPTY SEARCH */}
        {currentState === "A" && (
          <div className="animate-fade-in px-[20px] pt-[16px]">
            
            {/* A1 — RECENT SEARCHES */}
            <div className="mb-[20px]">
              <div className="flex justify-between items-center mb-[10px]">
                <span className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px]">Recent Searches</span>
                <button className="font-jakarta text-[12px] text-[#C0392B]">Clear all</button>
              </div>
              <div className="flex flex-col gap-[8px]">
                {[
                  'Udaipur hospitals',
                  'Guardians in Jaipur',
                  'Spiti Valley hidden gems',
                  'Dr. Kavita Sharma',
                  'Varanasi itinerary 3 days'
                ].map((item, i) => (
                  <div key={i} className="bg-[#FFFFFF] border border-[#E8D5B7] rounded-[12px] h-[48px] px-[14px] flex items-center justify-between shadow-sm cursor-pointer hover:border-[#E8640C]/30 transition-colors">
                    <div className="flex items-center">
                      <Clock className="w-[16px] h-[16px] text-[#B09880]" />
                      <span className="ml-[10px] font-jakarta text-[14px] text-[#1E1410]">{item}</span>
                    </div>
                    <button className="w-[32px] h-[32px] flex items-center justify-end -mr-1">
                      <X className="w-[14px] h-[14px] text-[#B09880]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* A2 — TRENDING SEARCHES */}
            <div className="mb-[20px]">
              <span className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px] block mb-[10px]">Trending in India</span>
              <div className="flex flex-wrap gap-[8px]">
                {[
                  'Meghalaya', 'Coorg Monsoon', 'Spiti Valley', 'Goa offseason',
                  'Varanasi solo trip', 'Rajasthan budget travel', 'Northeast India', 'Andaman Islands'
                ].map((chip, i) => (
                  <button 
                    key={i}
                    onClick={() => handleChipClick(chip)}
                    className="h-[36px] px-[14px] bg-[#FFFFFF] border border-[#E8D5B7] rounded-full shadow-sm flex items-center hover:border-[#E8640C] hover:bg-saffron/5 group transition-colors"
                  >
                    <TrendingUp className="w-[13px] h-[13px] text-[#F0A500]" strokeWidth={2.5} />
                    <span className="ml-[6px] font-cabinet font-medium text-[13px] text-[#1E1410] group-hover:text-[#E8640C]">{chip}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* A3 — BROWSE BY CATEGORY */}
            <div>
              <span className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px] block mb-[12px]">Browse by Category</span>
              <div className="grid grid-cols-2 gap-[12px]">
                {[
                  { icon: MapPin, label: 'Destinations', sub: 'Cities, regions, landmarks', color: '#E8640C', bg: 'rgba(232,100,12,0.10)' },
                  { icon: Shield, label: 'Guardians', sub: 'Verified local helpers', color: '#2D6A4F', bg: 'rgba(45,106,79,0.10)' },
                  { icon: Cross, label: 'Doctors', sub: 'Clinics and hospitals', color: '#C0392B', bg: 'rgba(192,57,43,0.10)' },
                  { icon: Compass, label: 'Hidden Gems', sub: 'Beyond the guidebook', color: '#F0A500', bg: 'rgba(240,165,0,0.10)' },
                  { icon: Map, label: 'Itineraries', sub: 'Day-by-day trip plans', color: '#E8640C', bg: 'rgba(232,100,12,0.10)' },
                  { icon: Star, label: 'Experiences', sub: 'Local activities and culture', color: '#F0A500', bg: 'rgba(240,165,0,0.10)' },
                ].map((cat, i) => (
                  <div key={i} className="bg-[#FFFFFF] border border-[#E8D5B7] rounded-[14px] h-[64px] px-[16px] py-[14px] shadow-sm flex items-center cursor-pointer hover:border-current transition-colors" style={{ color: cat.color }}>
                    <div className="w-[36px] h-[36px] rounded-[9px] flex items-center justify-center shrink-0" style={{ backgroundColor: cat.bg }}>
                      <cat.icon className="w-[20px] h-[20px]" style={{ color: cat.color }} />
                    </div>
                    <div className="ml-[14px] flex flex-col justify-center overflow-hidden">
                      <span className="font-cabinet font-semibold text-[14px] text-[#1E1410] truncate">{cat.label}</span>
                      <span className="font-jakarta text-[11px] text-[#6B4F3A] truncate mt-[2px] leading-tight">{cat.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* STATE B — ACTIVE SEARCH */}
        {currentState === "B" && (
          <div className="animate-fade-in px-[20px] pt-[12px]">
            
            {/* B0 — RESULTS HEADER ROW */}
            <div className="flex justify-between items-center h-[32px] mb-[12px]">
              <span className="font-jakarta text-[13px] text-[#6B4F3A]">
                Results for <span className="font-cabinet font-semibold text-[#1E1410]">"{query}"</span>
              </span>
              <div className="flex items-center gap-1 cursor-pointer">
                <span className="font-mono-dm text-[11px] text-[#6B4F3A]">Sort: Relevance</span>
                <ChevronDown className="w-3 h-3 text-[#6B4F3A]" />
              </div>
            </div>

            {/* Loading Skeletons */}
            {isSearching ? (
              <div className="animate-fade-in space-y-[16px]">
                <div>
                  <div className="flex justify-between items-center mb-[10px]">
                    <span className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px]">Destinations</span>
                    <span className="font-cabinet font-medium text-[11px] text-[#E8640C]">See all 4</span>
                  </div>
                  <SkeletonRow />
                  <SkeletonRow />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-[10px]">
                    <span className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px]">Guardians</span>
                    <span className="font-cabinet font-medium text-[11px] text-[#E8640C]">See all 8</span>
                  </div>
                  <SkeletonRow />
                  <SkeletonRow />
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                
                {/* B1 — DESTINATIONS */}
                <div className="mb-[16px]">
                  <div className="flex justify-between items-center mb-[10px]">
                    <span className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px]">Destinations</span>
                    <span className="font-cabinet font-medium text-[11px] text-[#E8640C] cursor-pointer hover:underline">See all 4</span>
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    {[
                      { title: 'Udaipur', sub: 'Rajasthan · Lakes & Heritage', tags: ['Heritage', 'Romantic'], thumb: 'https://images.unsplash.com/photo-1615836245337-f5899b82cb3a?q=80&w=200' },
                      { title: 'Lake Pichola', sub: 'Udaipur, Rajasthan', tags: ['Scenic', 'Boating'], thumb: 'https://images.unsplash.com/photo-1596425143093-aeec6dce5e0f?q=80&w=200' }
                    ].map((res, i) => (
                      <div key={i} className="bg-[#FFFFFF] border border-[#E8D5B7] rounded-[14px] h-[64px] px-[14px] flex items-center shadow-sm cursor-pointer hover:border-[#E8D5B7] hover:shadow-md transition-all">
                        <div className="w-[44px] h-[44px] rounded-[10px] overflow-hidden shrink-0">
                          <img src={res.thumb} alt={res.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-[12px] flex-1 flex flex-col justify-center overflow-hidden">
                          <h5 className="font-cabinet font-semibold text-[14px] text-[#1E1410] truncate mt-1">{res.title}</h5>
                          <span className="font-mono-dm text-[11px] text-[#6B4F3A] tracking-[0.5px] truncate mt-[3px] leading-none">{res.sub}</span>
                          <div className="flex items-center gap-[6px] mt-[5px]">
                            {res.tags.map(tag => (
                              <div key={tag} className="h-[20px] bg-sand/30 px-2 rounded flex items-center font-mono-dm text-[10px] text-[#1E1410] whitespace-nowrap">{tag}</div>
                            ))}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#B09880] shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* B2 — GUARDIANS */}
                <div className="mb-[16px]">
                  <div className="flex justify-between items-center mb-[10px]">
                    <span className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px]">Guardians</span>
                    <span className="font-cabinet font-medium text-[11px] text-[#E8640C] cursor-pointer hover:underline">See all 8</span>
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    {[
                      { name: 'Anjali Gupta', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
                      { name: 'Fatima Shaikh', img: 'https://randomuser.me/api/portraits/women/12.jpg' }
                    ].map((res, i) => (
                      <div key={i} className="bg-[#FFFFFF] border border-[#E8D5B7] rounded-[14px] h-[64px] px-[14px] flex items-center shadow-sm hover:shadow-md transition-shadow">
                        <img src={res.img} alt={res.name} className="w-[44px] h-[44px] rounded-full object-cover border-[1.5px] border-[#E8D5B7] shrink-0" />
                        <div className="ml-[12px] flex-1 flex flex-col justify-center overflow-hidden">
                          <h5 className="font-cabinet font-semibold text-[14px] text-[#1E1410] truncate mb-[3px] leading-none">{res.name}</h5>
                          <span className="font-mono-dm text-[11px] text-[#6B4F3A] truncate leading-none">Udaipur · <span className="text-[#2D6A4F]">Available Now</span></span>
                        </div>
                        <div className="h-[22px] bg-[#2D6A4F]/10 text-[#2D6A4F] px-2 rounded flex items-center justify-center font-mono-dm text-[10px] uppercase font-bold tracking-wider mx-3 shrink-0">Verified</div>
                        <button className="w-[68px] h-[30px] rounded-[8px] bg-[#2D6A4F] text-[#FFFFFF] font-cabinet font-semibold text-[11px] shadow-[0_2px_8px_rgba(45,106,79,0.30)] hover:brightness-110 shrink-0">
                          Request
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* B3 — DOCTORS */}
                <div className="mb-[16px]">
                  <div className="flex justify-between items-center mb-[10px]">
                    <span className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px]">Doctors</span>
                    <span className="font-cabinet font-medium text-[11px] text-[#E8640C] cursor-pointer hover:underline">See all 18</span>
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    {[
                      { name: 'Dr. Kavita Sharma', spec: 'General Physician', dist: '0.8 km away', img: 'https://randomuser.me/api/portraits/women/65.jpg' },
                      { name: 'Dr. Arjun Reddy', spec: 'Emergency Medicine', dist: '1.4 km away', img: 'https://randomuser.me/api/portraits/men/44.jpg' }
                    ].map((res, i) => (
                      <div key={i} className="bg-[#FFFFFF] border border-[#E8D5B7] rounded-[14px] h-[64px] px-[14px] flex items-center shadow-sm hover:shadow-md transition-shadow">
                        <img src={res.img} alt={res.name} className="w-[44px] h-[44px] rounded-full object-cover border-[1.5px] border-[#E8D5B7] shrink-0" />
                        <div className="ml-[12px] flex-1 flex flex-col justify-center overflow-hidden">
                          <h5 className="font-cabinet font-semibold text-[14px] text-[#1E1410] truncate mt-[3px] leading-none mb-1">{res.name}</h5>
                          <span className="font-jakarta text-[12px] text-[#6B4F3A] truncate leading-none mb-1.5">{res.spec}</span>
                          <span className="font-mono-dm text-[11px] text-[#E8640C] truncate leading-none">{res.dist}</span>
                        </div>
                        <div className="h-[22px] bg-[#2D6A4F]/10 text-[#2D6A4F] px-2 rounded flex items-center justify-center font-mono-dm text-[10px] uppercase font-bold tracking-wider mx-2 shrink-0">Verified</div>
                        <button className="w-[52px] h-[30px] rounded-[8px] bg-[#E8640C] text-[#FFFFFF] font-cabinet font-semibold text-[12px] shadow-[0_2px_8px_rgba(232,100,12,0.30)] hover:brightness-110 shrink-0">
                          Book
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* B4 — HIDDEN GEMS */}
                <div className="mb-[16px]">
                  <div className="flex justify-between items-center mb-[10px]">
                    <span className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px]">Hidden Gems</span>
                    <span className="font-cabinet font-medium text-[11px] text-[#E8640C] cursor-pointer hover:underline">See all 6</span>
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    {[
                      { title: 'Ranakpur Temple', loc: 'Sadri, Rajasthan', tags: ['Heritage', 'Spiritual'], thumb: 'https://images.unsplash.com/photo-1599661559905-2b4f62fdfeac?q=80&w=200' },
                      { title: 'Kumbhalgarh Fort', loc: 'Rajsamand, Rajasthan', tags: ['Heritage', 'Trekking'], thumb: 'https://images.unsplash.com/photo-1629813958569-8bc3c38db55b?q=80&w=200' }
                    ].map((res, i) => (
                      <div key={i} className="bg-[#FFFFFF] border border-[#E8D5B7] rounded-[14px] h-[72px] px-[14px] flex items-center shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                        <div className="w-[48px] h-[48px] rounded-[10px] overflow-hidden shrink-0">
                          <img src={res.thumb} alt={res.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-[12px] flex-1 flex flex-col justify-center overflow-hidden">
                          <h5 className="font-cabinet font-semibold text-[14px] text-[#1E1410] truncate mt-1">{res.title}</h5>
                          <span className="font-mono-dm text-[11px] text-[#6B4F3A] tracking-[0.5px] truncate mt-[3px] leading-none">{res.loc}</span>
                          <div className="flex items-center gap-[6px] mt-[5px]">
                            {res.tags.map(tag => (
                              <div key={tag} className="h-[20px] bg-sand/30 px-2 rounded flex items-center font-mono-dm text-[10px] text-[#1E1410] whitespace-nowrap">{tag}</div>
                            ))}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#B09880] shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* B5 — VIEW ALL RESULTS LINK */}
                <div className="bg-[#FEF3E2] border border-[#E8D5B7] rounded-[12px] h-[48px] px-[16px] flex items-center justify-between shadow-sm cursor-pointer hover:brightness-95 transition-colors">
                  <span className="font-jakarta text-[14px] text-[#6B4F3A]">
                    See all results for <span className="font-cabinet font-semibold text-[#1E1410]">"{query}"</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#E8640C]" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* STATE C — NO RESULTS */}
        {currentState === "C" && (
          <div className="animate-fade-in">
            
            {/* C1 — NO RESULTS HERO BLOCK */}
            <div className="pt-[48px] px-[40px] flex flex-col items-center text-center">
              <NoResultIcon />
              <h3 className="mt-[16px] font-display font-bold text-[22px] text-[#1E1410] leading-[1.1]">No results found</h3>
              <p className="mt-[6px] font-jakarta text-[14px] text-[#6B4F3A]">We couldn't find anything matching</p>
              <p className="font-cabinet font-semibold text-[14px] text-[#1E1410]">"zxcvb"</p>
              <p className="mt-[10px] font-jakarta text-[13px] text-[#B09880] max-w-[280px] leading-[1.5]">
                Try searching for a city, doctor name, guardian city, or type of experience.
              </p>
            </div>

            {/* C2 — SUGGESTIONS */}
            <div className="mt-[32px] px-[20px]">
              <span className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px] block text-center mb-[12px]">Try Searching For</span>
              <div className="flex flex-wrap justify-center gap-[8px]">
                {[
                  'Jaipur', 'Udaipur', 'Varanasi', 'Doctors near me', 'Hidden gems',
                  'Guardian in Mumbai', 'Spiti Valley', 'Women guardian'
                ].map((chip, i) => (
                  <button 
                    key={i}
                    onClick={() => handleChipClick(chip)}
                    className="h-[36px] px-[16px] bg-[#FFFFFF] border border-[#E8D5B7] rounded-full shadow-sm flex items-center font-cabinet font-medium text-[13px] text-[#1E1410] hover:border-[#E8640C] hover:text-[#E8640C] transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* C3 — QUICK LINKS */}
            <div className="mt-[24px] px-[20px]">
              <span className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px] block mb-[12px]">Or Browse Directly</span>
              <div className="flex flex-col gap-[8px]">
                {[
                  { icon: Shield, name: 'Find a Guardian', sub: 'Browse all verified guardians near you', color: '#2D6A4F', bg: 'rgba(45,106,79,0.10)' },
                  { icon: Cross, name: 'Find a Doctor', sub: 'Verified doctors and clinics across India', color: '#E8640C', bg: 'rgba(232,100,12,0.10)' },
                  { icon: Compass, name: 'Explore Hidden Gems', sub: 'Discover places beyond the tourist trail', color: '#F0A500', bg: 'rgba(240,165,0,0.10)' },
                ].map((link, i) => (
                  <div key={i} className="bg-[#FFFFFF] border border-[#E8D5B7] rounded-[12px] h-[52px] px-[14px] flex items-center justify-between shadow-sm cursor-pointer hover:border-[#E8D5B7] hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center shrink-0" style={{ backgroundColor: link.bg }}>
                        <link.icon className="w-[18px] h-[18px]" style={{ color: link.color }} />
                      </div>
                      <div className="ml-[12px] flex flex-col justify-center">
                        <span className="font-cabinet font-semibold text-[14px] text-[#1E1410] leading-tight">{link.name}</span>
                        <span className="font-jakarta text-[12px] text-[#6B4F3A] leading-tight mt-[2px]">{link.sub}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#B09880]" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
