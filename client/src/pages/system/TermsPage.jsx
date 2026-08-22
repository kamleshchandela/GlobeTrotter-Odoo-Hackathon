import { AuthLayout } from "../../components/layout/AuthLayout";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <AuthLayout
      photoUrl="https://images.unsplash.com/photo-1450149632596-3ef25a620117?q=80&w=2000"
      quote={`Integrity and safety\nare the foundations of travel.`}
      badges={["Community Trust", "Guardian Policy", "Fair Usage"]}
    >
      <Link to={-1} className="flex items-center gap-2 text-taupe hover:text-saffron transition-colors mb-6 group">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-jakarta text-sm font-medium">Back</span>
      </Link>

      <h1 className="font-display font-bold text-3xl text-charcoal mb-4">Terms of Service</h1>
      <div className="font-jakarta text-taupe text-[15px] space-y-4 leading-relaxed overflow-y-auto max-h-[60vh] pr-4 custom-scrollbar">
        <p>Last updated: May 2026</p>
        <h2 className="text-charcoal font-bold mt-6">1. Acceptance of Terms</h2>
        <p>By accessing and using the My Itinerary platform, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
        
        <h2 className="text-charcoal font-bold mt-6">2. Safety and Guardian Network</h2>
        <p>My Itinerary acts as a facilitator connecting travelers with background-verified local guardians. While we perform rigorous checks, we do not guarantee absolute safety and encourage users to exercise personal judgment.</p>
        
        <h2 className="text-charcoal font-bold mt-6">3. SOS System Usage</h2>
        <p>The SOS emergency system is intended for genuine emergencies only. Misuse of the SOS feature may lead to account suspension and, in extreme cases, notification to local law enforcement.</p>
        
        <h2 className="text-charcoal font-bold mt-6">4. Privacy and Data</h2>
        <p>We collect location data and media (photos/audio) during SOS events to assist your emergency contacts. This data is handled according to our Privacy Policy.</p>
        
        <h2 className="text-charcoal font-bold mt-6">5. Community Guidelines</h2>
        <p>Respectful behavior is mandatory. Harassment of guardians, travelers, or healthcare providers will result in permanent removal from Bharat's first safety network.</p>
      </div>
    </AuthLayout>
  );
}
