import React from 'react';
import TopAppBar from '../../components/shared/TopAppBar';
import { Users, Shield, MapPin, CheckCircle2 } from 'lucide-react';

export default function GuardianNetwork() {
  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <TopAppBar variant="back" title="Guardian Network" />
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <h1 className="font-display font-bold text-4xl text-[#1E1410]">Local Guardians</h1>
        <p className="font-jakarta text-lg text-[#6B4F3A] mt-2">Verified residents in your current area ready to assist.</p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Anjali Gupta", role: "Verified Resident", dist: "0.4 km", rating: 4.9 },
            { name: "Suresh Meena", role: "Local Guide", dist: "1.2 km", rating: 4.8 },
            { name: "Priya V.", role: "Verified Student", dist: "1.5 km", rating: 5.0 }
          ].map((g, i) => (
            <div key={i} className="bg-white border border-[#E8D5B7] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-[#FEF3E2] rounded-full flex items-center justify-center font-bold text-[#E8640C]">{g.name[0]}</div>
                <div className="flex items-center gap-1 text-[#2D6A4F] text-xs font-bold bg-[#2D6A4F]/10 px-2 py-1 rounded"><CheckCircle2 size={12} /> VERIFIED</div>
              </div>
              <h3 className="mt-4 font-cabinet font-bold text-lg">{g.name}</h3>
              <p className="text-sm text-[#B09880]">{g.role}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm font-mono-dm text-[#6B4F3A]"><MapPin size={14} /> {g.dist}</span>
                <button className="px-4 py-2 bg-[#E8640C] text-white rounded-lg font-cabinet font-bold text-sm">Request Help</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
