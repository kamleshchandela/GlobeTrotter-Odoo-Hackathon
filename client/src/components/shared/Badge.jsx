/**
 * Badge — Pill tag component with 5 color variants.
 * @param {"safety"|"alert"|"neutral"|"active"|"gold"} variant
 * @param {string} children — Badge text
 * @param {string} className — Additional classes
 */
export default function Badge({ variant = "neutral", children, className = "" }) {
  const styles = {
    safety: "bg-[#2D6A4F1F] text-[#2D6A4F] border border-[#2D6A4F4D]",
    alert: "bg-[#C0392B1A] text-[#C0392B] border border-[#C0392B4D]",
    neutral: "bg-[#E8D5B7] text-[#6B4F3A]",
    active: "bg-[#E8640C1F] text-[#E8640C] border border-[#E8640C4D]",
    gold: "bg-[#F0A5001F] text-[#F0A500] border border-[#F0A5004D]",
  };

  return (
    <span
      className={`inline-flex items-center h-6 px-2.5 rounded-full font-mono-dm text-[10px] uppercase tracking-[1px] whitespace-nowrap ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
