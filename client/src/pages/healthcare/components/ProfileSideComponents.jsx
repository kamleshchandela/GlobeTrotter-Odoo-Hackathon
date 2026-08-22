import { useState } from "react";
import { MapPin, ArrowRight, FileText, Download, Trash2, Printer, Link as LinkIcon, Lock, Stethoscope, Pill, AlertTriangle } from "lucide-react";

export function ConsultationRow({ consult }) {
  return (
    <div className="bg-white border border-[#E8D5B7] rounded-[12px] p-[16px_18px] flex items-center justify-between shadow-[0_2px_8px_rgba(30,20,16,0.06)]">
      <div className="flex items-center gap-[12px]">
        <img src={consult.avatar} alt={consult.doctor} className="w-[40px] h-[40px] rounded-full object-cover shrink-0" />
        <div>
          <h4 className="font-cabinet font-semibold text-[14px] text-[#1E1410]">{consult.doctor}</h4>
          <p className="font-jakarta text-[12px] text-[#6B4F3A]">{consult.specialty}</p>
        </div>
      </div>
      <div className="flex-1 px-[24px]">
        <p className="font-mono-dm text-[11px] text-[#B09880]">{consult.date}</p>
        <div className="flex items-center gap-[4px] mt-[2px]">
          <MapPin size={12} className="text-[#E8640C]" />
          <span className="font-jakarta text-[13px] text-[#6B4F3A]">{consult.location}</span>
        </div>
        <p className="mt-[4px] font-jakarta text-[13px] italic text-[#B09880] truncate max-w-[200px]">{consult.notes}</p>
      </div>
      <div className="flex flex-col items-end gap-[6px]">
        <span className="font-mono-dm text-[11px] text-[#1E1410] font-bold">{consult.ref}</span>
        <button className="font-cabinet font-medium text-[12px] text-[#E8640C] flex items-center gap-[4px]">
          View Summary <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}

export function DocumentCard({ doc }) {
  return (
    <div className="bg-white border border-[#E8D5B7] rounded-[12px] p-[14px_16px] flex items-center justify-between shadow-[0_2px_8px_rgba(30,20,16,0.06)] group">
      <div className="flex items-center gap-[12px]">
        <div className="w-[40px] h-[40px] rounded-full bg-[#FEF3E2] flex items-center justify-center shrink-0 text-[#E8640C]">
          <FileText size={20} />
        </div>
        <div>
          <h4 className="font-cabinet font-semibold text-[14px] text-[#1E1410]">{doc.name}</h4>
          <div className="flex items-center gap-[8px] mt-[3px]">
            <p className="font-mono-dm text-[10px] text-[#B09880]">Uploaded {doc.date}</p>
            <span className="px-[6px] py-[1px] bg-[#F5EDE0] rounded-[4px] font-mono-dm text-[9px] text-[#6B4F3A] uppercase">{doc.type}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-[12px]">
        <button className="text-[#B09880] hover:text-[#E8640C] transition-colors"><Download size={16} /></button>
        <button className="text-[#B09880] hover:text-[#C0392B] transition-colors"><Trash2 size={16} /></button>
      </div>
    </div>
  );
}

export function HealthSnapshot({ user, onPrint }) {
  const stats = [
    { label: "BLOOD GROUP", value: user.bloodGroup, isBlood: true },
    { label: "AGE", value: user.age },
    { label: "CONDITIONS", value: `${user.conditions.length} Recorded` },
    { label: "ALLERGIES", value: `${user.allergies.length} Known` },
  ];

  return (
    <div className="bg-white border border-[#E8D5B7] rounded-[14px] p-[16px] shadow-[0_2px_8px_rgba(30,20,16,0.07)]">
      <p className="font-mono-dm text-[10px] text-[#B09880] uppercase tracking-wider">Health Snapshot</p>
      <div className="mt-[10px] space-y-[0px]">
        {stats.map((s, i) => (
          <div key={i} className={`h-[40px] flex items-center justify-between ${i < stats.length - 1 ? "border-b border-[#F5EDE0]" : ""}`}>
            <span className="font-mono-dm text-[10px] text-[#6B4F3A]">{s.label}</span>
            <span className={`font-cabinet ${s.isBlood ? "font-bold text-[16px] text-[#C0392B]" : "font-semibold text-[14px] text-[#1E1410]"}`}>{s.value}</span>
          </div>
        ))}
      </div>
      <button onClick={onPrint} className="mt-[12px] w-full flex items-center justify-center gap-[6px] font-cabinet font-medium text-[13px] text-[#E8640C] hover:underline">
        <Printer size={14} /> Print Health Card
      </button>
    </div>
  );
}

export function ShareDoctorBlock() {
  const [copied, setCopied] = useState(false);
  const [linkGenerated, setLinkGenerated] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#FEF3E2] border border-[#E8D5B7] rounded-[14px] p-[16px]">
      <p className="font-mono-dm text-[10px] text-[#B09880] uppercase tracking-wider">Share with Doctor</p>
      <p className="mt-[8px] font-jakarta text-[13px] text-[#6B4F3A] leading-[1.5]">
        Share a read-only summary of your health profile with a doctor before your consultation.
      </p>
      {!linkGenerated ? (
        <button onClick={() => setLinkGenerated(true)} className="mt-[12px] w-full h-[40px] bg-[#E8640C] rounded-[8px] text-white font-cabinet font-semibold text-[13px] flex items-center justify-center gap-[8px] shadow-sm hover:opacity-90 transition-opacity">
          <LinkIcon size={14} /> Generate Share Link
        </button>
      ) : (
        <div className="mt-[12px]">
          <div className="bg-white border border-[#2D6A4F] rounded-[8px] p-[10px_14px] flex items-center justify-between cursor-pointer" onClick={handleCopy}>
            <span className="font-mono-dm text-[11px] text-[#2D6A4F] truncate">myitn.ry/h/p-menon-514</span>
            <span className="text-[#2D6A4F] font-cabinet font-bold text-[11px]">{copied ? "COPIED!" : "COPY"}</span>
          </div>
          <p className="mt-[4px] font-mono-dm text-[10px] text-[#B09880]">Expires in 24 hours</p>
        </div>
      )}
      <p className="mt-[8px] font-jakarta text-[11px] text-[#B09880] text-center">Expires after 24 hours. No account needed.</p>
    </div>
  );
}

export function PrivacyNotice() {
  const points = [
    "Your health data is stored only on this device. It is not uploaded to any server unless you choose to share it.",
    "Shared links expire automatically. No one can access your profile without your permission.",
    "You can delete all health data at any time from Settings."
  ];
  return (
    <div className="bg-white border border-[#E8D5B7] rounded-[14px] p-[16px] shadow-[0_2px_8px_rgba(30,20,16,0.07)]">
      <p className="font-mono-dm text-[10px] text-[#B09880] uppercase tracking-wider">Data and Privacy</p>
      <div className="mt-[10px] space-y-[8px]">
        {points.map((p, i) => (
          <div key={i} className="flex gap-[8px]">
            <Lock size={13} className="text-[#2D6A4F] shrink-0 mt-[2px]" />
            <p className="font-jakarta text-[13px] text-[#6B4F3A] leading-[1.4]">{p}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function QuickActions({ onAction }) {
  const actions = [
    { id: 'doctor', icon: <Stethoscope size={14} />, label: "Find a Doctor" },
    { id: 'pharmacy', icon: <Pill size={14} />, label: "Find a Pharmacy" },
    { id: 'report', icon: <Download size={14} />, label: "Download Full Health Report" },
    { id: 'delete', icon: <Trash2 size={14} />, label: "Delete All Health Data", isDestructive: true },
  ];
  return (
    <div className="bg-white border border-[#E8D5B7] rounded-[14px] p-[16px] shadow-[0_2px_8px_rgba(30,20,16,0.07)]">
      <p className="font-mono-dm text-[10px] text-[#B09880] uppercase tracking-wider">Quick Actions</p>
      <div className="mt-[12px] space-y-[8px]">
        {actions.map((a, i) => (
          <button key={i} onClick={() => onAction(a.id)} className="w-full h-[40px] px-[14px] bg-[#FEF3E2] rounded-[8px] flex items-center justify-between group hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-[10px]">
              <span className={a.isDestructive ? "text-[#C0392B]" : "text-[#E8640C]"}>{a.icon}</span>
              <span className={`font-cabinet font-medium text-[13px] ${a.isDestructive ? "text-[#C0392B]" : "text-[#1E1410]"}`}>{a.label}</span>
            </div>
            <ArrowRight size={12} className="text-[#B09880] group-hover:text-[#E8640C] transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
