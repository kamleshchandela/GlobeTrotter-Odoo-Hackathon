import { AuthLayout } from "../../components/layout/AuthLayout";
import { Link } from "react-router-dom";
import { ChevronLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <AuthLayout
      photoUrl="https://images.unsplash.com/photo-1557591954-20a89d71c569?q=80&w=2000"
      quote={`Your data is for your safety,\nnot for our profit.`}
      badges={["End-to-End Encryption", "Transparent Collection", "User-Controlled"]}
    >
      <Link to={-1} className="flex items-center gap-2 text-taupe hover:text-saffron transition-colors mb-6 group">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-jakarta text-sm font-medium">Back</span>
      </Link>

      <div className="flex items-center gap-3 mb-4">
        <ShieldCheck className="w-8 h-8 text-banyan" />
        <h1 className="font-display font-bold text-3xl text-charcoal">Privacy Policy</h1>
      </div>

      <div className="font-jakarta text-taupe text-[15px] space-y-4 leading-relaxed overflow-y-auto max-h-[60vh] pr-4 custom-scrollbar">
        <p>Last updated: May 2026</p>
        <p>At My Itinerary, we prioritize your privacy as much as your safety. This policy outlines how we handle your personal information.</p>
        
        <h2 className="text-charcoal font-bold mt-6">1. Data Collection</h2>
        <p>We collect basic profile information (Name, Phone, Email) during signup. Real-time location data is ONLY collected when you are actively using trip navigation or when the SOS system is triggered.</p>
        
        <h2 className="text-charcoal font-bold mt-6">2. Emergency Media</h2>
        <p>During an SOS event, our system captures photos and audio to provide evidence to your emergency contacts. This data is stored securely and is only accessible by you and the recipients of your alert.</p>
        
        <h2 className="text-charcoal font-bold mt-6">3. Third-Party Services</h2>
        <p>We use Google Maps APIs for location services and Gemini AI for itinerary generation. Your preferences are shared with these services only as needed to provide the requested functionality.</p>
        
        <h2 className="text-charcoal font-bold mt-6">4. No Data Selling</h2>
        <p>We NEVER sell your personal data, travel history, or safety logs to advertisers or third parties. Our mission is safety, not tracking.</p>
      </div>
    </AuthLayout>
  );
}
