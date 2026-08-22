import React from 'react';
import TopAppBar from '../../components/shared/TopAppBar';
import { Shield, MapPin, Users, Bell, ChevronRight, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SafetyHome() {
  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <TopAppBar variant="back" title="Safety Dashboard" />
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Status */}
          <div>
            <h1 className="font-display font-bold text-4xl text-[#1E1410]">Your Safety Network.</h1>
            <p className="font-jakarta text-lg text-[#6B4F3A] mt-4">Verified protection at every step of your journey across India.</p>
            
            <div className="mt-10 p-6 bg-white border border-[#E8D5B7] rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <Shield className="text-[#E8640C]" size={24} />
                <h3 className="font-cabinet font-bold text-xl">Current Status: Protected</h3>
              </div>
              <p className="mt-2 text-[#6B4F3A]">Emergency services and guardian matching active for your location.</p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="grid grid-cols-1 gap-4">
            <Link to="/safety/guardians" className="p-6 bg-white border border-[#E8D5B7] rounded-2xl hover:border-[#E8640C] transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#FEF3E2] rounded-xl text-[#E8640C]"><Users size={24} /></div>
                <div>
                  <h4 className="font-cabinet font-bold text-lg">Guardian Network</h4>
                  <p className="text-sm text-[#B09880]">Connect with verified local residents</p>
                </div>
              </div>
              <ChevronRight className="text-[#B09880] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link to="/safety/sos" className="p-6 bg-[#C0392B] text-white rounded-2xl flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl"><Phone size={24} /></div>
                <div>
                  <h4 className="font-cabinet font-bold text-lg">SOS Emergency</h4>
                  <p className="text-sm text-white/70">Instant alert to local authorities</p>
                </div>
              </div>
              <ChevronRight size={24} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
