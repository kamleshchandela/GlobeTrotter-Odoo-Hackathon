import { useState, useRef, useEffect } from "react";
import CountryList from "country-list-with-dial-code-and-flag";

export function CountryCodeSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  const countries = CountryList.getAll().map(c => c.data || c);
  const selectedConfig = countries.find(c => c.dial_code === value) || countries.find(c => c.code === "IN");
  
  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.dial_code.includes(search) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative border-r-[1.5px] border-sand bg-white text-charcoal h-full flex items-center w-[110px] shrink-0 font-jakarta font-medium select-none z-20" ref={wrapperRef}>
      <div 
        className="flex items-center justify-between w-full px-3 cursor-pointer h-full hover:bg-cream/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="text-[14px]" style={{ fontFamily: '"Twemoji Mozilla", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", sans-serif' }}>{selectedConfig?.flag}</span>
          <span className="text-[14px] truncate">{selectedConfig?.dial_code}</span>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-[260px] max-h-[300px] bg-white border-[1.5px] border-sand rounded-[10px] shadow-lg flex flex-col overflow-hidden animate-fade-in origin-top-left">
          <div className="p-2 border-b border-sand bg-cream">
            <input 
              type="text" 
              className="w-full h-[36px] px-3 bg-white border border-sand rounded-[6px] outline-none text-[13px] font-jakarta focus:border-saffron focus:shadow-sm transition-all"
              placeholder="Search country or +code"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
            {filteredCountries.length === 0 ? (
              <div className="p-4 text-center text-[13px] text-taupe font-jakarta">No results found.</div>
            ) : (
              filteredCountries.map((c, i) => (
                <div 
                  key={`${c.code}-${i}`}
                  className={`flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-cream transition-colors ${selectedConfig?.dial_code === c.dial_code ? "bg-[#FEF3E2]" : ""}`}
                  onClick={() => {
                    onChange(c.dial_code);
                    setIsOpen(false);
                    setSearch("");
                  }}
                >
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                    <span className="text-[16px] shrink-0 text-center w-[24px]" style={{ fontFamily: '"Twemoji Mozilla", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", sans-serif' }}>{c.flag}</span>
                    <span className="text-[14px] font-jakarta truncate text-charcoal" title={c.name}>{c.name}</span>
                  </div>
                  <span className="text-[13px] font-mono-dm text-taupe shrink-0">{c.dial_code}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
