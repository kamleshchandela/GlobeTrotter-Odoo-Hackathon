import React, { useState } from "react";
import { X, Camera } from "lucide-react";

const ModalOverlay = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-[#1E1410] bg-opacity-50 z-50 flex items-center justify-center p-[24px]">
    <div className="absolute inset-0" onClick={onClose} />
    {children}
  </div>
);

export function PhotoChangeModal({ onClose, onSave }) {
  const [uploaded, setUploaded] = useState(false);
  const [preview, setPreview] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        setUploaded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="relative w-[520px] bg-white rounded-[16px] p-[28px] shadow-[0_16px_48px_rgba(30,20,16,0.20)] z-10">
        <div className="flex items-center justify-between mb-[16px]">
          <h3 className="font-mono-dm text-[11px] text-[#B09880] uppercase tracking-[1px]">Change Profile Photo</h3>
          <button onClick={onClose} className="p-[4px] hover:bg-[#F5EDE0] rounded-full transition-colors">
            <X size={18} className="text-[#B09880]" />
          </button>
        </div>

        {!uploaded ? (
          <label className="block bg-[#FAFAF8] border-[2px] border-dashed border-[#E8D5B7] rounded-[12px] p-[32px] text-center cursor-pointer hover:bg-[#FEF3E2] transition-colors">
            <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleFileChange} />
            <Camera size={40} className="text-[#E8D5B7] mx-auto mb-[10px]" />
            <p className="font-cabinet font-medium text-[15px] text-[#6B4F3A]">Drop your photo here or click to upload</p>
            <p className="font-jakarta text-[12px] text-[#B09880] mt-[6px]">JPG or PNG · Maximum 5MB · Square photos look best</p>
          </label>
        ) : (
          <div>
            <div className="relative w-full h-[280px] bg-[#1E1410] rounded-[10px] overflow-hidden flex items-center justify-center">
              <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-60" />
              <div className="absolute w-[200px] h-[200px] rounded-full border-[2px] border-white shadow-[0_0_0_9999px_rgba(30,20,16,0.55)]">
                {/* Crop overlay hole */}
              </div>
            </div>
            <p className="font-jakarta text-[12px] text-[#B09880] text-center mt-[8px]">Drag to reposition · Scroll to zoom</p>
            
            <div className="flex items-center justify-end mt-[20px] gap-[12px]">
              <button onClick={() => setUploaded(false)} className="font-cabinet font-medium text-[14px] text-[#B09880] hover:text-[#6B4F3A]">Cancel</button>
              <button onClick={() => { onSave(preview); onClose(); }} className="flex-1 h-[44px] rounded-[12px] bg-[#E8640C] text-white font-cabinet font-semibold text-[14px]">Save Photo</button>
            </div>
          </div>
        )}
      </div>
    </ModalOverlay>
  );
}

export function DeactivateModal({ onClose, onConfirm }) {
  return (
    <ModalOverlay onClose={onClose}>
      <div className="relative w-[480px] bg-white rounded-[16px] p-[28px] shadow-[0_16px_48px_rgba(30,20,16,0.20)] z-10">
        <h3 className="font-cabinet font-bold text-[20px] text-[#1E1410] mb-[12px]">Deactivate your account?</h3>
        <p className="font-jakarta text-[14px] text-[#6B4F3A] leading-[1.6]">
          Your account will be hidden and your safety data will be paused. You can reactivate at any time by logging back in.
        </p>
        <div className="mt-[24px] flex flex-col gap-[8px]">
          <button onClick={onConfirm} className="w-full h-[48px] rounded-[10px] bg-[#C0392B] text-white font-cabinet font-semibold text-[14px]">Deactivate</button>
          <button onClick={onClose} className="w-full h-[48px] rounded-[10px] bg-white border border-[#E8D5B7] text-[#1E1410] font-cabinet font-semibold text-[14px] hover:bg-[#FAFAF8]">Cancel</button>
        </div>
      </div>
    </ModalOverlay>
  );
}

export function DeleteModal({ onClose, onConfirm }) {
  const [confirmText, setConfirmText] = useState("");
  const canDelete = confirmText === "DELETE";

  return (
    <ModalOverlay onClose={onClose}>
      <div className="relative w-[480px] bg-white rounded-[16px] p-[28px] shadow-[0_16px_48px_rgba(30,20,16,0.20)] z-10">
        <h3 className="font-cabinet font-bold text-[20px] text-[#C0392B] mb-[12px]">This cannot be undone.</h3>
        <p className="font-jakarta text-[14px] text-[#6B4F3A] leading-[1.6] mb-[20px]">
          Deleting your account permanently removes your profile, trips, safety data, guardian history, saved places, and all reviews. This action is irreversible and cannot be undone.
        </p>
        
        <label className="block font-mono-dm text-[11px] uppercase text-[#B09880] mb-[6px]">TYPE DELETE TO CONFIRM</label>
        <input
          type="text"
          placeholder="Type DELETE here"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="w-full h-[48px] bg-white border-[1.5px] border-[#E8D5B7] rounded-[10px] px-[14px] font-jakarta text-[15px] text-[#1E1410] outline-none transition-shadow focus:border-[#C0392B] focus:shadow-[0_0_0_4px_rgba(192,57,43,0.12)] mb-[24px]"
        />

        <div className="flex flex-col gap-[8px]">
          <button
            onClick={onConfirm}
            disabled={!canDelete}
            className={`w-full h-[48px] rounded-[10px] font-cabinet font-semibold text-[14px] transition-colors ${canDelete ? 'bg-[#C0392B] text-white' : 'bg-[#FAFAF8] text-[#B09880] cursor-not-allowed'}`}
          >
            Permanently Delete
          </button>
          <button onClick={onClose} className="w-full h-[48px] rounded-[10px] bg-white border border-[#E8D5B7] text-[#1E1410] font-cabinet font-semibold text-[14px] hover:bg-[#FAFAF8]">Cancel</button>
        </div>
      </div>
    </ModalOverlay>
  );
}
