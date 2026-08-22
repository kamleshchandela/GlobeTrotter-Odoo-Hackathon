import { Shield } from "lucide-react";

export function AuthLayout({
  photoUrl,
  topLabel,
  quote,
  badges = [],
  stepIndicator,
  topRightContent,
  children,
}) {
  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-cream overflow-hidden">
      {/* Mobile Header Banner */}
      <div className="md:hidden w-full h-[200px] shrink-0 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${photoUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/60" />
        </div>
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-white" />
          <span className="font-display font-bold text-white text-lg">My Itinerary</span>
        </div>
        {topLabel && (
          <div className="absolute top-6 right-6">
            <span className="font-mono-dm text-[11px] text-white/80 uppercase tracking-widest">{topLabel}</span>
          </div>
        )}
      </div>

      {/* Desktop Left Photo Panel */}
      <div className="hidden md:flex w-[45%] h-screen relative flex-col justify-between overflow-hidden shrink-0">
        {/* Real Indian Travel Photograph */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out hover:scale-105"
          style={{ backgroundImage: `url(${photoUrl})` }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E1410]/0 to-[#1E1410]/80" />
        {/* Paper Grain Texture */}
        <div className="absolute inset-0 paper-grain opacity-5" />

        {/* Top Area */}
        <div className="relative z-10 pt-8 px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-white" />
            <span className="font-display font-bold text-white text-xl">My Itinerary</span>
          </div>
          {topLabel && (
            <span className="font-mono-dm text-[11px] text-white/80 uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
              {topLabel}
            </span>
          )}
        </div>

        {/* Centered Step Indicator (Right Side of photo) */}
        {stepIndicator && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
            {stepIndicator}
          </div>
        )}

        {/* Bottom Content Area */}
        <div className="relative z-10 pb-10 pl-10 pr-6 flex justify-between items-end">
          <div className="max-w-[440px]">
            <h2 className="font-serif-display italic text-3xl md:text-[32px] leading-snug text-white mb-6">
              {typeof quote === 'string' ? `"${quote}"` : quote}
            </h2>
            
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {badges.map((badge, idx) => (
                   <span key={idx} className="bg-white/15 backdrop-blur-sm text-white font-mono-dm text-xs px-3 py-1.5 rounded-full border border-white/10">
                    {badge}
                   </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Form Panel (Scrollable) */}
      <div className="w-full h-full md:w-[55%] flex flex-col relative bg-cream overflow-y-auto">
        <div className="absolute inset-0 paper-grain opacity-[0.04] pointer-events-none" />
        
        {/* Top Right Desktop Link pinned to corner */}
        {topRightContent && (
          <div className="absolute top-8 right-8 z-20 hidden md:block">
            {topRightContent}
          </div>
        )}
        
        <div className="w-full max-w-[420px] mx-auto px-6 py-12 md:py-20 relative z-10 flex-col flex select-text">
          {/* Mobile Top Right Content */}
          {topRightContent && (
            <div className="mb-8 md:hidden text-right">
              {topRightContent}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
