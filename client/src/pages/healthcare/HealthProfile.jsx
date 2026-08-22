import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Pencil, Share2, Check, X, Plus, Upload, Heart, Stethoscope, ChevronRight, ArrowRight, Pill, AlertTriangle, FileText, Search } from "lucide-react";
import TopAppBar from "../../components/shared/TopAppBar";
import { ProfileSummaryCard, ConditionCard, MedicationRow, AllergyTag } from "./components/ProfileDetailComponents";
import { ConsultationRow, DocumentCard, HealthSnapshot, ShareDoctorBlock, PrivacyNotice, QuickActions } from "./components/ProfileSideComponents";

export default function HealthProfile() {
  const { user: authUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  
  // Initialize state from localStorage or empty
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(`health_data_${authUser?.fullName || authUser?.name || 'guest'}`);
    if (saved) return JSON.parse(saved);
    
    return {
      name: authUser?.fullName || authUser?.name || "Guest",
      age: "--",
      gender: "Not specified",
      bloodGroup: "--",
      dob: "--",
      languages: [],
      emergencyContacts: [],
      conditions: [],
      medications: [],
      allergies: [],
      consultations: [], // Keep this empty or pull from a real booking history later
      documents: []
    };
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Inline Add Form states
  const [showAddCondition, setShowAddCondition] = useState(false);
  const [newCondition, setNewCondition] = useState({ name: "", year: "", severity: "Managed" });
  
  const [showAddMed, setShowAddMed] = useState(false);
  const [newMed, setNewMed] = useState({ name: "", dosage: "", frequency: "", status: "Ongoing" });
  
  const [showAddAllergy, setShowAddAllergy] = useState(false);
  const [newAllergy, setNewAllergy] = useState({ name: "", severity: "Moderate" });

  const [showEditEmergency, setShowEditEmergency] = useState(null); // id of contact being edited

  useEffect(() => {
    if ((authUser?.fullName || authUser?.name) && user.name === "Guest") {
      setUser(prev => ({ ...prev, name: authUser.fullName || authUser.name }));
    }
  }, [authUser]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      // Save to localStorage
      localStorage.setItem(`health_data_${authUser?.fullName || authUser?.name || 'guest'}`, JSON.stringify(user));
      
      setSaving(false);
      setIsEdit(false);
      setUnsavedChanges(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  const addCondition = () => {
    if (!newCondition.name) return;
    const item = { ...newCondition, id: Date.now(), icon: 'heart', color: '#C0392B' };
    setUser({ ...user, conditions: [...user.conditions, item] });
    setNewCondition({ name: "", year: "", severity: "Managed" });
    setShowAddCondition(false);
    setUnsavedChanges(true);
  };

  const removeCondition = (id) => {
    setUser({ ...user, conditions: user.conditions.filter(c => c.id !== id) });
    setUnsavedChanges(true);
  };

  const addMed = () => {
    if (!newMed.name) return;
    const item = { ...newMed, id: Date.now() };
    setUser({ ...user, medications: [...user.medications, item] });
    setNewMed({ name: "", dosage: "", frequency: "", status: "Ongoing" });
    setShowAddMed(false);
    setUnsavedChanges(true);
  };

  const removeMed = (id) => {
    setUser({ ...user, medications: user.medications.filter(m => m.id !== id) });
    setUnsavedChanges(true);
  };

  const addAllergy = () => {
    if (!newAllergy.name) return;
    const item = { ...newAllergy, id: Date.now() };
    setUser({ ...user, allergies: [...user.allergies, item] });
    setNewAllergy({ name: "", severity: "Moderate" });
    setShowAddAllergy(false);
    setUnsavedChanges(true);
  };

  const removeAllergy = (id) => {
    setUser({ ...user, allergies: user.allergies.filter(a => a.id !== id) });
    setUnsavedChanges(true);
  };

  const addEmergency = () => {
    const newContact = { id: Date.now(), name: "New Contact", relation: "Relation", phone: "+91 00000 00000", city: "City" };
    const contacts = Array.isArray(user.emergencyContacts) ? user.emergencyContacts : [user.emergencyContact];
    setUser({ ...user, emergencyContacts: [...contacts, newContact] });
    setShowEditEmergency(newContact.id);
    setUnsavedChanges(true);
  };

  const removeEmergency = (id) => {
    const contacts = Array.isArray(user.emergencyContacts) ? user.emergencyContacts : [user.emergencyContact];
    setUser({ ...user, emergencyContacts: contacts.filter(c => c.id !== id) });
    setUnsavedChanges(true);
  };

  const handleDeleteAll = () => {
    if (window.confirm("Are you sure you want to delete all your health data? This cannot be undone.")) {
      setUser({
        name: authUser?.fullName || authUser?.name || "Guest",
        age: "--",
        gender: "Not specified",
        bloodGroup: "--",
        dob: "--",
        languages: [],
        conditions: [],
        medications: [],
        allergies: [],
        consultations: [],
        documents: [],
        emergencyContacts: []
      });
      setUnsavedChanges(true);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newDoc = {
        id: Date.now(),
        name: file.name,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        type: file.name.split('.').pop().toUpperCase()
      };
      setUser({ ...user, documents: [newDoc, ...user.documents] });
      setUnsavedChanges(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-[64px] print:bg-white print:pb-0">
      <TopAppBar className="print:hidden" />

      {/* UNSAVED INDICATOR */}
      {unsavedChanges && (
        <div className="fixed top-[72px] left-0 right-0 z-[40] print:hidden">
          <div className="h-[3px] bg-[#E8640C] animate-pulse" />
          <div className="max-w-[1100px] mx-auto relative">
             <div className="absolute right-[24px] top-[12px] bg-[#E8640C] text-white font-mono-dm text-[10px] px-[12px] py-[4px] rounded-full shadow-lg animate-bounce">
               Unsaved changes
             </div>
          </div>
        </div>
      )}

      <div className="max-w-[1100px] mx-auto px-[24px]">
        {/* TOP IDENTITY ROW */}
        <div className="pt-[40px] flex flex-col md:flex-row justify-between items-start md:items-center gap-[16px] md:gap-0 print:hidden">
          <div>
            <p className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[3px]">My Health Profile</p>
            <h1 className="mt-[6px] font-display font-bold text-[32px] text-[#1E1410]">{user.name}</h1>
            <p className="mt-[4px] font-jakarta text-[13px] text-[#B09880]">Last updated {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <div className="flex gap-[10px]">
            {!isEdit ? (
              <>
                <button onClick={() => setIsEdit(true)} className="h-[40px] px-[20px] bg-white border-[1.5px] border-[#E8D5B7] rounded-[10px] font-cabinet font-semibold text-[13px] text-[#6B4F3A] flex items-center gap-[8px]">
                  <Pencil size={14} /> Edit Profile
                </button>
                <button className="h-[40px] px-[20px] bg-[#E8640C] rounded-[10px] font-cabinet font-semibold text-[13px] text-white flex items-center gap-[8px] shadow-[0_4px_12px_rgba(232,100,12,0.25)]">
                  <Share2 size={14} /> Share with Doctor
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { setIsEdit(false); setUnsavedChanges(false); }} className="h-[40px] px-[20px] bg-white border border-[#E8D5B7] rounded-[10px] font-cabinet font-semibold text-[13px] text-[#6B4F3A]">
                  Cancel
                </button>
                <button onClick={handleSave} className="h-[40px] px-[20px] bg-[#2D6A4F] rounded-[10px] font-cabinet font-semibold text-[13px] text-white flex items-center gap-[8px]">
                  {saving ? <div className="w-[14px] h-[14px] border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={14} />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-[32px] flex flex-col lg:flex-row gap-[40px]">
          {/* LEFT COLUMN */}
          <div className="flex-1 space-y-[28px]">
            
            {/* Section 1 — Profile Card */}
            <ProfileSummaryCard 
              user={user} 
              setUser={setUser} 
              isEdit={isEdit} 
              editingEmergencyId={showEditEmergency} 
              setEditingEmergencyId={setShowEditEmergency}
              onAddEmergency={addEmergency}
              onRemoveEmergency={removeEmergency}
            />

            {/* Section 2 — Conditions */}
            <div>
              <div className="flex justify-between items-center">
                <p className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[2px]">Medical Conditions</p>
                <button onClick={() => setShowAddCondition(true)} className="flex items-center gap-[6px] font-cabinet font-medium text-[13px] text-[#E8640C]">
                  <Plus size={14} /> Add Condition
                </button>
              </div>
              <div className="mt-[12px] space-y-[12px]">
                {user.conditions.length > 0 ? (
                  user.conditions.map(c => <ConditionCard key={c.id} condition={c} isEdit={isEdit} onRemove={() => removeCondition(c.id)} />)
                ) : (
                  <div className="py-[32px] flex flex-col items-center bg-white border border-[#E8D5B7] border-dashed rounded-[12px]">
                    <Stethoscope size={36} className="text-[#E8D5B7]" />
                    <p className="mt-[10px] font-cabinet font-semibold text-[15px] text-[#6B4F3A]">No conditions added.</p>
                    <p className="mt-[6px] font-jakarta text-[13px] text-[#B09880] text-center max-w-[300px]">Add any chronic conditions, past diagnoses, or ongoing health issues.</p>
                  </div>
                )}
                {showAddCondition && (
                  <div className="bg-[#FEF3E2] border-[1.5px] border-dashed border-[#E8D5B7] rounded-[12px] p-[16px_18px] flex gap-[12px] items-end">
                    <div className="flex-1 space-y-[4px]">
                      <label className="font-mono-dm text-[10px] text-[#B09880] uppercase ml-[4px]">Condition Name</label>
                      <input 
                        type="text" 
                        value={newCondition.name}
                        onChange={(e) => setNewCondition({...newCondition, name: e.target.value})}
                        placeholder="e.g. Hypertension" 
                        className="w-full h-[44px] bg-white border border-[#E8D5B7] rounded-[8px] px-[12px] font-jakarta text-[14px] focus:border-[#E8640C] outline-none" 
                      />
                    </div>
                    <div className="w-[100px] space-y-[4px]">
                      <label className="font-mono-dm text-[10px] text-[#B09880] uppercase ml-[4px]">Year</label>
                      <input 
                        type="text" 
                        value={newCondition.year}
                        onChange={(e) => setNewCondition({...newCondition, year: e.target.value})}
                        placeholder="2024" 
                        className="w-full h-[44px] bg-white border border-[#E8D5B7] rounded-[8px] px-[12px] font-jakarta text-[14px] focus:border-[#E8640C] outline-none" 
                      />
                    </div>
                    <div className="w-[140px] space-y-[4px]">
                      <label className="font-mono-dm text-[10px] text-[#B09880] uppercase ml-[4px]">Severity</label>
                      <select 
                        value={newCondition.severity}
                        onChange={(e) => setNewCondition({...newCondition, severity: e.target.value})}
                        className="w-full h-[44px] bg-white border border-[#E8D5B7] rounded-[8px] px-[12px] font-jakarta text-[14px] focus:border-[#E8640C] outline-none appearance-none"
                      >
                        <option>Managed</option>
                        <option>Ongoing</option>
                        <option>Chronic</option>
                      </select>
                    </div>
                    <button onClick={addCondition} className="h-[44px] w-[60px] bg-[#E8640C] text-white rounded-[8px] font-cabinet font-bold text-[13px]">Add</button>
                    <button onClick={() => setShowAddCondition(false)} className="h-[44px] px-[12px] text-[#B09880] font-cabinet font-medium text-[13px]">Cancel</button>
                  </div>
                )}
              </div>
            </div>

            {/* Section 3 — Medications */}
            <div>
              <div className="flex justify-between items-center">
                <p className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[1px]">Current Medications</p>
                <button onClick={() => setShowAddMed(true)} className="flex items-center gap-[6px] font-cabinet font-medium text-[13px] text-[#E8640C]">
                  <Plus size={14} /> Add Medication
                </button>
              </div>
              <div className="mt-[10px] space-y-[10px]">
                {user.medications.length > 0 ? (
                  user.medications.map(m => <MedicationRow key={m.id} med={m} isEdit={isEdit} onRemove={() => removeMed(m.id)} />)
                ) : (
                  <div className="py-[24px] flex flex-col items-center bg-white border border-[#E8D5B7] border-dashed rounded-[12px]">
                    <Pill size={28} className="text-[#E8D5B7]" />
                    <p className="mt-[8px] font-cabinet font-semibold text-[14px] text-[#6B4F3A]">No medications listed.</p>
                  </div>
                )}
                {showAddMed && (
                  <div className="bg-[#FEF3E2] border-[1.5px] border-dashed border-[#E8D5B7] rounded-[12px] p-[16px_18px] grid grid-cols-2 gap-[12px]">
                    <div className="space-y-[4px]">
                      <label className="font-mono-dm text-[10px] text-[#B09880] uppercase ml-[4px]">Medication Name</label>
                      <input 
                        type="text" 
                        value={newMed.name}
                        onChange={(e) => setNewMed({...newMed, name: e.target.value})}
                        className="w-full h-[44px] bg-white border border-[#E8D5B7] rounded-[8px] px-[12px] font-jakarta text-[14px]" 
                      />
                    </div>
                    <div className="space-y-[4px]">
                      <label className="font-mono-dm text-[10px] text-[#B09880] uppercase ml-[4px]">Dosage</label>
                      <input 
                        type="text" 
                        value={newMed.dosage}
                        onChange={(e) => setNewMed({...newMed, dosage: e.target.value})}
                        placeholder="e.g. 10mg"
                        className="w-full h-[44px] bg-white border border-[#E8D5B7] rounded-[8px] px-[12px] font-jakarta text-[14px]" 
                      />
                    </div>
                    <div className="space-y-[4px]">
                      <label className="font-mono-dm text-[10px] text-[#B09880] uppercase ml-[4px]">Frequency</label>
                      <input 
                        type="text" 
                        value={newMed.frequency}
                        onChange={(e) => setNewMed({...newMed, frequency: e.target.value})}
                        placeholder="e.g. Twice daily"
                        className="w-full h-[44px] bg-white border border-[#E8D5B7] rounded-[8px] px-[12px] font-jakarta text-[14px]" 
                      />
                    </div>
                    <div className="flex items-end gap-[12px]">
                      <button onClick={addMed} className="flex-1 h-[44px] bg-[#E8640C] text-white rounded-[8px] font-cabinet font-bold text-[13px]">Add</button>
                      <button onClick={() => setShowAddMed(false)} className="h-[44px] px-[12px] text-[#B09880] font-cabinet font-medium text-[13px]">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 4 — Allergies */}
            <div>
              <div className="flex justify-between items-center">
                <p className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[1px]">Allergies</p>
                <button onClick={() => setShowAddAllergy(true)} className="flex items-center gap-[6px] font-cabinet font-medium text-[13px] text-[#E8640C]">
                  <Plus size={14} /> Add Allergy
                </button>
              </div>
              <div className="mt-[10px] flex flex-wrap gap-[8px]">
                {user.allergies.length > 0 ? (
                  user.allergies.map(a => <AllergyTag key={a.id} allergy={a} isEdit={isEdit} onRemove={() => removeAllergy(a.id)} />)
                ) : (
                  <div className="w-full py-[24px] flex flex-col items-center bg-white border border-[#E8D5B7] border-dashed rounded-[12px]">
                    <AlertTriangle size={28} className="text-[#E8D5B7]" />
                    <p className="mt-[8px] font-cabinet font-semibold text-[14px] text-[#6B4F3A]">No known allergies.</p>
                  </div>
                )}
                {showAddAllergy && (
                  <div className="w-full mt-[8px] bg-[#FEF3E2] border-[1.5px] border-dashed border-[#E8D5B7] rounded-[12px] p-[16px_18px] flex gap-[12px] items-end">
                    <div className="flex-1 space-y-[4px]">
                      <label className="font-mono-dm text-[10px] text-[#B09880] uppercase ml-[4px]">Allergen</label>
                      <input 
                        type="text" 
                        value={newAllergy.name}
                        onChange={(e) => setNewAllergy({...newAllergy, name: e.target.value})}
                        className="w-full h-[44px] bg-white border border-[#E8D5B7] rounded-[8px] px-[12px]" 
                      />
                    </div>
                    <div className="w-[140px] space-y-[4px]">
                      <label className="font-mono-dm text-[10px] text-[#B09880] uppercase ml-[4px]">Severity</label>
                      <select 
                        value={newAllergy.severity}
                        onChange={(e) => setNewAllergy({...newAllergy, severity: e.target.value})}
                        className="w-full h-[44px] bg-white border border-[#E8D5B7] rounded-[8px] px-[12px] font-jakarta text-[14px]"
                      >
                        <option>Mild</option>
                        <option>Moderate</option>
                        <option>Severe</option>
                      </select>
                    </div>
                    <button onClick={addAllergy} className="h-[44px] w-[60px] bg-[#E8640C] text-white rounded-[8px] font-cabinet font-bold text-[13px]">Add</button>
                    <button onClick={() => setShowAddAllergy(false)} className="h-[44px] px-[12px] text-[#B09880] font-cabinet font-medium text-[13px]">Cancel</button>
                  </div>
                )}
              </div>
            </div>

            {/* Section 5 — Consultations */}
            <div>
              <p className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[1px]">Past Consultations</p>
              <p className="mt-[4px] font-jakarta text-[13px] text-[#B09880]">Consultations booked through My Itinerary are saved automatically.</p>
              <div className="mt-[12px] space-y-[10px]">
                {user.consultations.length > 0 ? (
                  user.consultations.map(c => <ConsultationRow key={c.id} consult={c} />)
                ) : (
                  <div className="py-[32px] flex flex-col items-center bg-white border border-[#E8D5B7] border-dashed rounded-[12px]">
                    <Search size={32} className="text-[#E8D5B7]" />
                    <p className="mt-[8px] font-cabinet font-semibold text-[14px] text-[#6B4F3A]">No consultation history.</p>
                  </div>
                )}
              </div>
              {user.consultations.length > 0 && (
                <button className="mt-[12px] flex items-center gap-[6px] text-[#E8640C] font-cabinet font-medium text-[13px] hover:underline transition-all">
                  View all {user.consultations.length + 3} consultations <ArrowRight size={14} />
                </button>
              )}
            </div>

            {/* Section 6 — Documents */}
            <div>
              <div className="flex justify-between items-center">
                <p className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[1px]">Documents and Reports</p>
                <div className="relative">
                  <input type="file" id="doc-upload" className="hidden" onChange={handleFileUpload} />
                  <label htmlFor="doc-upload" className="flex items-center gap-[6px] font-cabinet font-medium text-[13px] text-[#E8640C] cursor-pointer hover:underline">
                    <Upload size={14} /> Upload Document
                  </label>
                </div>
              </div>
              <div className="mt-[10px] grid grid-cols-2 gap-[12px]">
                {user.documents.length > 0 ? (
                  user.documents.map(d => <DocumentCard key={d.id} doc={d} />)
                ) : (
                  <div className="col-span-2 py-[32px] flex flex-col items-center bg-white border border-[#E8D5B7] border-dashed rounded-[12px]">
                    <FileText size={32} className="text-[#E8D5B7]" />
                    <p className="mt-[8px] font-cabinet font-semibold text-[14px] text-[#6B4F3A]">No documents uploaded.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full lg:w-[300px] shrink-0 space-y-[16px] lg:sticky top-[96px] h-fit print:hidden">
            <HealthSnapshot user={user} onPrint={handlePrint} />
            <ShareDoctorBlock />
            <PrivacyNotice />
            <QuickActions onAction={(id) => {
              if (id === 'doctor') navigate('/healthcare');
              if (id === 'pharmacy') navigate('/healthcare?tab=Pharmacies');
              if (id === 'report') handlePrint();
              if (id === 'delete') handleDeleteAll();
            }} />
          </div>
        </div>
      </div>

      {/* SAVED TOAST */}
      {showToast && (
        <div className="fixed bottom-[32px] left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-[#2D6A4F] text-white px-[20px] py-[12px] rounded-[10px] shadow-lg flex items-center gap-[10px]">
            <Check size={14} />
            <span className="font-cabinet font-semibold text-[14px]">Health profile updated.</span>
          </div>
        </div>
      )}
    </div>
  );
}
