import { Pencil, Share2, Phone, MapPin, Heart, Droplets, Brain, Pill, AlertTriangle, FileText, Download, Trash2, Link as LinkIcon, Lock, Printer, Search, Stethoscope, Home, ChevronRight, X, Plus } from "lucide-react";

export function ProfileSummaryCard({ user, setUser, isEdit, editingEmergencyId, setEditingEmergencyId, onAddEmergency, onRemoveEmergency }) {
  const handleChange = (field, value) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };

  const handleEmergencyChange = (id, field, value) => {
    const contacts = Array.isArray(user.emergencyContacts) ? user.emergencyContacts : [user.emergencyContact];
    const newContacts = contacts.map(c => c.id === id || (!c.id && id === 'default') ? { ...c, [field]: value } : c);
    setUser(prev => ({ ...prev, emergencyContacts: newContacts }));
  };

  const contacts = Array.isArray(user.emergencyContacts) ? user.emergencyContacts : [user.emergencyContact];

  return (
    <div className="bg-white border border-[#E8D5B7] rounded-[16px] p-[24px] shadow-[0_4px_16px_rgba(30,20,16,0.10)] flex items-center gap-[24px]">
      <div className="relative group shrink-0">
        <img src={user.avatar} alt={user.name} className="w-[72px] h-[72px] rounded-full object-cover border-2 border-[#E8D5B7]" />
        {isEdit && (
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Plus size={20} className="text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        {isEdit ? (
          <input 
            type="text" 
            value={user.name} 
            onChange={(e) => handleChange('name', e.target.value)}
            className="font-cabinet font-bold text-[20px] text-[#1E1410] bg-[#FEF3E2] border border-[#E8D5B7] rounded-[6px] px-[8px] py-[2px] w-full outline-none focus:border-[#E8640C]"
          />
        ) : (
          <h3 className="font-cabinet font-bold text-[20px] text-[#1E1410]">{user.name}</h3>
        )}
        <div className="mt-[4px] flex items-center gap-[6px] flex-wrap">
          {isEdit ? (
            <>
              <input type="text" value={user.age} onChange={(e) => handleChange('age', e.target.value)} className="w-[40px] bg-[#FEF3E2] border border-[#E8D5B7] rounded-[4px] px-[4px] py-[1px] font-jakarta text-[14px]" />
              <span className="text-[#6B4F3A]">years ·</span>
              <select value={user.gender} onChange={(e) => handleChange('gender', e.target.value)} className="bg-[#FEF3E2] border border-[#E8D5B7] rounded-[4px] px-[4px] py-[1px] font-jakarta text-[14px]">
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
              <span className="text-[#6B4F3A]">· Blood Group:</span>
              <input type="text" value={user.bloodGroup} onChange={(e) => handleChange('bloodGroup', e.target.value)} className="w-[40px] bg-[#FEF3E2] border border-[#E8D5B7] rounded-[4px] px-[4px] py-[1px] font-jakarta text-[14px] text-[#C0392B] font-bold" />
            </>
          ) : (
            <p className="font-jakarta text-[14px] text-[#6B4F3A]">
              {user.age} years · {user.gender} · Blood Group: <span className="text-[#C0392B] font-bold">{user.bloodGroup}</span>
            </p>
          )}
        </div>
        {isEdit ? (
          <input type="text" value={user.dob} onChange={(e) => handleChange('dob', e.target.value)} className="mt-[4px] w-full bg-[#FEF3E2] border border-[#E8D5B7] rounded-[4px] px-[8px] py-[1px] font-mono-dm text-[11px]" />
        ) : (
          <p className="mt-[4px] font-mono-dm text-[11px] text-[#B09880]">Date of Birth: {user.dob}</p>
        )}
        <div className="mt-[6px] flex gap-[6px]">
          {user.languages.map(l => (
            <span key={l} className="px-[8px] py-[2px] rounded-[6px] bg-[#FEF3E2] border border-[#E8D5B7] font-mono-dm text-[10px] text-[#6B4F3A]">{l}</span>
          ))}
          {isEdit && <button className="w-[20px] h-[20px] rounded-full border border-[#E8D5B7] flex items-center justify-center text-[#B09880]"><Plus size={10} /></button>}
        </div>
      </div>
      <div className="w-[320px] space-y-[12px]">
        <div className="flex justify-between items-center px-[4px]">
          <p className="font-mono-dm text-[10px] text-[#B09880] uppercase tracking-wider">Emergency Contacts</p>
          {isEdit && (
            <button onClick={onAddEmergency} className="font-cabinet font-bold text-[10px] text-[#E8640C] flex items-center gap-[4px] hover:underline uppercase">
              <Plus size={10} /> Add Contact
            </button>
          )}
        </div>
        <div className="space-y-[8px] max-h-[160px] overflow-y-auto pr-[4px] scrollbar-thin scrollbar-thumb-[#E8D5B7]">
          {contacts.map((contact, idx) => {
            const id = contact.id || 'default';
            const isEditing = editingEmergencyId === id;

            return (
              <div key={id} className="bg-[#FEF3E2] border border-[#E8D5B7] rounded-[12px] p-[10px_14px] relative group">
                {isEditing ? (
                  <div className="space-y-[6px]">
                    <input type="text" value={contact.name} onChange={(e) => handleEmergencyChange(id, 'name', e.target.value)} placeholder="Name" className="w-full h-[24px] px-[6px] bg-white border border-[#E8D5B7] rounded-[4px] font-cabinet text-[12px] outline-none" />
                    <div className="flex gap-[6px]">
                      <input type="text" value={contact.relation} onChange={(e) => handleEmergencyChange(id, 'relation', e.target.value)} placeholder="Relation" className="flex-1 h-[24px] px-[6px] bg-white border border-[#E8D5B7] rounded-[4px] font-cabinet text-[12px] outline-none" />
                      <input type="text" value={contact.phone} onChange={(e) => handleEmergencyChange(id, 'phone', e.target.value)} placeholder="Phone" className="flex-1 h-[24px] px-[6px] bg-white border border-[#E8D5B7] rounded-[4px] font-mono-dm text-[11px] outline-none" />
                    </div>
                    <button onClick={() => setEditingEmergencyId(null)} className="w-full h-[24px] bg-[#2D6A4F] text-white rounded-[4px] font-cabinet font-bold text-[11px] uppercase">Save Contact</button>
                  </div>
                ) : (
                  <>
                    <h4 className="font-cabinet font-semibold text-[13px] text-[#1E1410] truncate pr-[30px]">{contact.name} ({contact.relation})</h4>
                    <a href={`tel:${contact.phone}`} className="mt-[2px] block font-mono-dm text-[12px] text-[#E8640C] font-bold underline">{contact.phone}</a>
                    <p className="mt-[2px] font-jakarta text-[11px] text-[#6B4F3A]">{contact.city}</p>
                    {isEdit && (
                      <div className="absolute top-[10px] right-[10px] flex gap-[8px] opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingEmergencyId(id)} className="text-[#B09880] hover:text-[#E8640C]"><Pencil size={12} /></button>
                        <button onClick={() => onRemoveEmergency(id)} className="text-[#C0392B] hover:text-[#C0392B]/80"><Trash2 size={12} /></button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ConditionCard({ condition, isEdit, onRemove }) {
  const getIcon = () => {
    switch (condition.icon) {
      case 'heart': return <Heart size={20} />;
      case 'droplet': return <Droplets size={20} />;
      case 'brain': return <Brain size={20} />;
      default: return <Stethoscope size={20} />;
    }
  };

  return (
    <div className="bg-white border border-[#E8D5B7] rounded-[12px] p-[16px_18px] flex items-center justify-between shadow-[0_2px_8px_rgba(30,20,16,0.06)] group">
      <div className="flex items-center gap-[12px]">
        <div className="w-[40px] h-[40px] rounded-[8px] flex items-center justify-center shrink-0" style={{ backgroundColor: `${condition.color}14`, color: condition.color }}>
          {getIcon()}
        </div>
        <div>
          <h4 className="font-cabinet font-semibold text-[15px] text-[#1E1410]">{condition.name}</h4>
          <p className="mt-[3px] font-mono-dm text-[10px] text-[#B09880]">Diagnosed: {condition.year}</p>
          <span className={`inline-block mt-[4px] px-[8px] py-[1px] rounded-full font-mono-dm text-[9px] uppercase tracking-wider ${condition.severity === 'Managed' ? 'bg-[rgba(45,106,79,0.10)] text-[#2D6A4F]' : condition.severity === 'Ongoing' ? 'bg-[#FEF3E2] text-[#E8640C]' : 'bg-[#F5EDE0] text-[#6B4F3A]'}`}>
            {condition.severity}
          </span>
        </div>
      </div>
      {isEdit ? (
        <div className="flex items-center gap-[8px]">
          <button className="text-[#B09880] hover:text-[#E8640C]"><Pencil size={12} /></button>
          <button onClick={onRemove} className="text-[#C0392B] hover:text-[#C0392B]/80"><Trash2 size={12} /></button>
        </div>
      ) : (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-end gap-[4px]">
           <button className="flex items-center gap-[4px] font-cabinet font-medium text-[12px] text-[#B09880] hover:text-[#E8640C]"><Pencil size={12} /> Edit</button>
           <button onClick={onRemove} className="flex items-center gap-[4px] font-mono-dm text-[10px] text-[#C0392B] hover:text-[#C0392B]/80"><Trash2 size={12} /> Remove</button>
        </div>
      )}
    </div>
  );
}

export function MedicationRow({ med, isEdit, onRemove }) {
  return (
    <div className="bg-white border border-[#E8D5B7] rounded-[12px] p-[14px_18px] flex items-center shadow-[0_2px_8px_rgba(30,20,16,0.06)] group">
      <div className="w-[36px] h-[36px] rounded-full bg-[#FEF3E2] flex items-center justify-center shrink-0 text-[#E8640C]">
        <Pill size={18} />
      </div>
      <div className="ml-[12px] flex-1">
        <h4 className="font-cabinet font-semibold text-[14px] text-[#1E1410]">{med.name}</h4>
        <p className="font-mono-dm text-[11px] text-[#6B4F3A]">{med.dosage} · {med.frequency}</p>
      </div>
      <div className="flex items-center gap-[12px]">
        <span className="font-mono-dm text-[10px] text-[#2D6A4F] uppercase">{med.status}</span>
        {(isEdit || true) && (
          <div className={`${isEdit ? "flex" : "opacity-0 group-hover:opacity-100"} items-center gap-[8px] transition-opacity`}>
            <button className="text-[#B09880] hover:text-[#E8640C]"><Pencil size={12} /></button>
            <button onClick={onRemove} className="text-[#C0392B] hover:text-[#C0392B]/80"><Trash2 size={12} /></button>
          </div>
        )}
      </div>
    </div>
  );
}

export function AllergyTag({ allergy, isEdit, onRemove }) {
  return (
    <div className="h-[36px] px-[14px] bg-[rgba(192,57,43,0.07)] border border-[rgba(192,57,43,0.25)] rounded-full flex items-center gap-[6px]">
      <AlertTriangle size={12} className="text-[#C0392B]" />
      <span className="font-cabinet font-semibold text-[13px] text-[#C0392B]">
        {allergy.name} <span className="font-mono-dm text-[10px] text-[rgba(192,57,43,0.70)] ml-[4px]">· {allergy.severity}</span>
      </span>
      {isEdit && (
        <button onClick={onRemove} className="ml-[4px] text-[#C0392B] hover:text-[#C0392B]/80"><X size={12} /></button>
      )}
    </div>
  );
}
