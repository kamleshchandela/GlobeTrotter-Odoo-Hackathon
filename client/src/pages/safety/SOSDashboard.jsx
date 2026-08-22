import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import TopAppBar from '../../components/shared/TopAppBar';
import { Phone, AlertTriangle, Shield, MapPin, Mic, Camera, Loader2, CheckCircle2, User, Mail, Edit3, MessageCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { API_BASE_URL } from '../../config/env';

export default function SOSDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [phase, setPhase] = useState('idle'); // idle | capturing | recording | sending | sent | error
  const [emergencyContact, setEmergencyContact] = useState({ name: '', phone: '', email: '' });
  const [editingContact, setEditingContact] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '' });
  const [captureStatus, setCaptureStatus] = useState({ location: false, audio: false, frontCam: false, backCam: false });
  const [recordingTimer, setRecordingTimer] = useState(15);
  const [sosLocation, setSosLocation] = useState(null); // store for WhatsApp link
  const audioChunks = useRef([]);
  const mediaRecorder = useRef(null);
  const timerInterval = useRef(null);

  useEffect(() => {
    fetchEmergencyContact();
    return () => { if (timerInterval.current) clearInterval(timerInterval.current); };
  }, []);

  const fetchEmergencyContact = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/sos/contact`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEmergencyContact(data);
        setContactForm(data);
      }
    } catch (err) {
      console.error('Failed to fetch emergency contact', err);
    }
  };

  const saveEmergencyContact = async () => {
    if (!contactForm.name || !contactForm.email) {
      toast.error("Name and email are required.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/sos/contact`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(contactForm)
      });
      if (res.ok) {
        const data = await res.json();
        setEmergencyContact(data.emergencyContact);
        setEditingContact(false);
        toast.success("Emergency contact saved!");
      }
    } catch (err) {
      toast.error("Failed to save contact.");
    }
  };

  // Wait for the camera to produce real frames (not black)
  const waitForValidFrame = (video) => {
    return new Promise((resolve) => {
      const checkCanvas = document.createElement('canvas');
      checkCanvas.width = 4;
      checkCanvas.height = 4;
      const ctx = checkCanvas.getContext('2d');
      let attempts = 0;
      const check = () => {
        attempts++;
        ctx.drawImage(video, 0, 0, 4, 4);
        const pixels = ctx.getImageData(0, 0, 4, 4).data;
        // Check if there's any non-black pixel
        let hasColor = false;
        for (let i = 0; i < pixels.length; i += 4) {
          if (pixels[i] > 10 || pixels[i + 1] > 10 || pixels[i + 2] > 10) {
            hasColor = true;
            break;
          }
        }
        if (hasColor || attempts > 30) {
          resolve();
        } else {
          setTimeout(check, 200);
        }
      };
      // Give the camera 1s initial warmup, then start checking
      setTimeout(check, 1000);
    });
  };

  // Get local built-in cameras, filtering out Phone Link / virtual cameras
  const getLocalCamera = async (preferBack = false) => {
    try {
      // Request camera briefly so device labels populate
      const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
      tempStream.getTracks().forEach(t => t.stop());

      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(d => d.kind === 'videoinput');

      // Filter out Phone Link / virtual cameras
      const virtualKeywords = ['phone', 'virtual', 'obs', 'snap', 'droidcam', 'iriun', 'epoccam', 'link to'];
      const local = cameras.filter(d => {
        const label = (d.label || '').toLowerCase();
        return !virtualKeywords.some(k => label.includes(k));
      });
      const pool = local.length > 0 ? local : cameras;
      if (pool.length === 0) return null;
      return preferBack && pool.length > 1 ? pool[pool.length - 1].deviceId : pool[0].deviceId;
    } catch (err) {
      console.error('Device enumeration failed:', err);
      return null;
    }
  };

  const capturePhoto = async (preferBack = false) => {
    try {
      const deviceId = await getLocalCamera(preferBack);
      if (!deviceId) return null;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.setAttribute('playsinline', 'true');
      video.muted = true;
      await video.play();

      // Wait until the camera actually produces a non-black frame
      await waitForValidFrame(video);

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      stream.getTracks().forEach(t => t.stop());
      return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
    } catch (err) {
      console.error('Camera capture failed:', err);
      return null;
    }
  };

  const recordAudio = () => {
    return new Promise(async (resolve) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        audioChunks.current = [];

        // Prefer audio-only mime types
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
            ? 'audio/ogg;codecs=opus'
            : 'audio/webm';

        mediaRecorder.current = new MediaRecorder(stream, { mimeType });
        mediaRecorder.current.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunks.current.push(e.data);
        };
        mediaRecorder.current.onstop = () => {
          stream.getTracks().forEach(t => t.stop());
          const blob = new Blob(audioChunks.current, { type: mimeType });
          resolve(blob);
        };

        // Start recording
        mediaRecorder.current.start(1000); // collect data every second
        setRecordingTimer(15);

        // Live countdown timer
        let remaining = 15;
        timerInterval.current = setInterval(() => {
          remaining--;
          setRecordingTimer(remaining);
          if (remaining <= 0) {
            clearInterval(timerInterval.current);
            timerInterval.current = null;
            if (mediaRecorder.current?.state === 'recording') {
              mediaRecorder.current.stop();
            }
          }
        }, 1000);
      } catch (err) {
        console.error("Mic not available:", err);
        resolve(null);
      }
    });
  };

  const buildWhatsAppLink = (latitude, longitude) => {
    const phone = emergencyContact.phone?.replace(/[^0-9]/g, '') || '';
    const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const msg = encodeURIComponent(
      `🚨 *SOS EMERGENCY ALERT*\n\n` +
      `${user?.fullName || 'A user'} has triggered an emergency SOS alert from the My Itinerary app.\n\n` +
      `📍 *Location:* ${mapsLink}\n` +
      `📞 *Phone:* ${user?.phone || 'N/A'}\n` +
      `🕐 *Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n\n` +
      `⚠️ Please contact them immediately or call local emergency services (112).`
    );
    return phone ? `https://wa.me/${phone}?text=${msg}` : `https://wa.me/?text=${msg}`;
  };

  const triggerSOS = async () => {
    if (!emergencyContact?.email) {
      toast.error("Please set your emergency contact email first!");
      setEditingContact(true);
      return;
    }

    setPhase('capturing');

    // 1. Get accurate GPS location using watchPosition
    let latitude = 0, longitude = 0;
    try {
      const pos = await new Promise((resolve) => {
        let bestPos = null;
        const wid = navigator.geolocation.watchPosition(
          (p) => {
            if (!bestPos || p.coords.accuracy < bestPos.coords.accuracy) bestPos = p;
            if (p.coords.accuracy < 50) { navigator.geolocation.clearWatch(wid); resolve(bestPos); }
          },
          () => { navigator.geolocation.clearWatch(wid); resolve(bestPos); },
          { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
        );
        setTimeout(() => { navigator.geolocation.clearWatch(wid); resolve(bestPos); }, 8000);
      });
      if (pos) {
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
        console.log(`[SOS] Location accuracy: ${pos.coords.accuracy.toFixed(1)}m`);
      }
      setSosLocation({ latitude, longitude });
      setCaptureStatus(p => ({ ...p, location: true }));
    } catch (err) {
      console.error("Location error:", err);
      setCaptureStatus(p => ({ ...p, location: true }));
    }

    // 2. Capture front camera (built-in laptop webcam)
    const frontBlob = await capturePhoto(false);
    setCaptureStatus(p => ({ ...p, frontCam: true }));

    // 3. Capture back camera (or same camera on laptops)
    const backBlob = await capturePhoto(true);
    setCaptureStatus(p => ({ ...p, backCam: true }));

    // 4. Record audio with live timer
    setPhase('recording');
    const audioBlob = await recordAudio();
    setCaptureStatus(p => ({ ...p, audio: true }));

    // 5. Send to backend (email)
    setPhase('sending');
    try {
      const formData = new FormData();
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      if (frontBlob) formData.append('frontPhoto', frontBlob, 'front.jpg');
      if (backBlob) formData.append('backPhoto', backBlob, 'back.jpg');
      if (audioBlob) formData.append('audioClip', audioBlob, 'recording.webm');

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/sos/trigger`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        setPhase('sent');
        toast.success("SOS alert sent to your emergency contact!");

        // Auto-open WhatsApp with emergency message
        const waLink = buildWhatsAppLink(latitude, longitude);
        window.open(waLink, '_blank');
      } else {
        const data = await res.json();
        throw new Error(data.message);
      }
    } catch (err) {
      setPhase('error');
      toast.error(err.message || "Failed to send SOS. Call 112 directly.");
    }
  };

  const resetSOS = () => {
    setPhase('idle');
    setCaptureStatus({ location: false, audio: false, frontCam: false, backCam: false });
    setRecordingTimer(15);
    setSosLocation(null);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <Toaster />
      <TopAppBar variant="back" title="SOS Emergency" />

      <div className="max-w-[800px] mx-auto px-6 py-8">

        {/* Emergency Contact Section */}
        <div className="bg-white border border-[#E8D5B7] rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-cabinet font-bold text-lg text-[#1E1410] flex items-center gap-2">
              <User size={18} className="text-[#E8640C]" /> Emergency Contact
            </h2>
            {!editingContact && (
              <button onClick={() => { setEditingContact(true); setContactForm(emergencyContact); }}
                className="text-[#E8640C] font-cabinet font-semibold text-sm flex items-center gap-1 hover:underline">
                <Edit3 size={14} /> Edit
              </button>
            )}
          </div>

          {editingContact ? (
            <div className="flex flex-col gap-3">
              <input value={contactForm.name || ''} onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Contact Name *" className="h-11 px-4 rounded-xl border border-[#E8D5B7] bg-[#FFF8F0] font-jakarta text-sm focus:outline-none focus:border-[#E8640C]" />
              <input value={contactForm.phone || ''} onChange={e => setContactForm(p => ({ ...p, phone: e.target.value }))}
                placeholder="Contact Phone (with country code, e.g. 919876543210)" className="h-11 px-4 rounded-xl border border-[#E8D5B7] bg-[#FFF8F0] font-jakarta text-sm focus:outline-none focus:border-[#E8640C]" />
              <input value={contactForm.email || ''} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))}
                placeholder="Contact Email * (SOS alerts go here)" type="email"
                className="h-11 px-4 rounded-xl border border-[#E8D5B7] bg-[#FFF8F0] font-jakarta text-sm focus:outline-none focus:border-[#E8640C]" />
              <div className="flex gap-3 mt-2">
                <button onClick={saveEmergencyContact}
                  className="flex-1 h-10 bg-[#E8640C] text-white rounded-xl font-cabinet font-semibold text-sm">Save Contact</button>
                <button onClick={() => setEditingContact(false)}
                  className="flex-1 h-10 bg-white border border-[#E8D5B7] rounded-xl font-cabinet font-semibold text-sm text-[#6B4F3A]">Cancel</button>
              </div>
            </div>
          ) : emergencyContact?.email ? (
            <div className="flex flex-col gap-1">
              <p className="font-cabinet font-semibold text-[#1E1410]">{emergencyContact.name}</p>
              <p className="font-jakarta text-sm text-[#6B4F3A]">{emergencyContact.phone}</p>
              <p className="font-jakarta text-sm text-[#E8640C] flex items-center gap-1"><Mail size={12} /> {emergencyContact.email}</p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="font-jakarta text-sm text-[#6B4F3A] mb-3">No emergency contact set. Please add one before using SOS.</p>
              <button onClick={() => setEditingContact(true)}
                className="h-10 px-6 bg-[#E8640C] text-white rounded-xl font-cabinet font-semibold text-sm">Add Emergency Contact</button>
            </div>
          )}
        </div>

        {/* SOS Button Area */}
        <div className="flex flex-col items-center">
          {phase === 'idle' && (
            <>
              <div className="w-40 h-40 bg-[#C0392B]/10 rounded-full flex items-center justify-center animate-pulse mb-6">
                <AlertTriangle size={64} className="text-[#C0392B]" />
              </div>
              <h1 className="font-display font-bold text-3xl text-[#1E1410] text-center">Emergency SOS</h1>
              <p className="mt-3 text-[#6B4F3A] text-center max-w-md font-jakarta text-sm">
                Pressing the button will capture your location, photos from both cameras, and a 15-second audio recording.
                Everything will be emailed and sent via WhatsApp to your emergency contact.
              </p>
              <button onClick={triggerSOS}
                className="mt-10 w-56 h-56 rounded-full bg-[#C0392B] text-white flex flex-col items-center justify-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all border-4 border-[#C0392B]/30">
                <Phone size={48} />
                <span className="font-cabinet font-bold text-xl tracking-widest">SEND SOS</span>
              </button>
            </>
          )}

          {phase === 'capturing' && (
            <div className="text-center">
              <Camera size={56} className="text-[#C0392B] mx-auto mb-6 animate-pulse" />
              <h2 className="font-display font-bold text-2xl text-[#1E1410] mb-4">Capturing Evidence...</h2>
              <p className="font-jakarta text-sm text-[#6B4F3A] mb-6">Please allow camera and location access if prompted.</p>
              <div className="flex flex-col gap-3 items-start mx-auto w-fit">
                {[
                  { label: 'Getting GPS location', done: captureStatus.location },
                  { label: 'Front camera photo', done: captureStatus.frontCam },
                  { label: 'Rear camera photo', done: captureStatus.backCam },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-3">
                    {s.done ? <CheckCircle2 size={18} className="text-[#2D6A4F]" /> : <Loader2 size={18} className="animate-spin text-[#B09880]" />}
                    <span className={`font-jakarta text-sm ${s.done ? 'text-[#2D6A4F] font-semibold' : 'text-[#6B4F3A]'}`}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {phase === 'recording' && (
            <div className="text-center">
              {/* Animated recording indicator */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-[#C0392B]/10 animate-ping" />
                <div className="absolute inset-2 rounded-full bg-[#C0392B]/20 animate-pulse" />
                <div className="absolute inset-0 rounded-full flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-[#C0392B] flex items-center justify-center">
                    <Mic size={32} className="text-white" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#C0392B] animate-pulse" />
                <span className="font-cabinet font-bold text-lg text-[#C0392B] uppercase tracking-wider">Recording</span>
              </div>
              <p className="font-display font-bold text-5xl text-[#1E1410] tabular-nums">{recordingTimer}s</p>
              <p className="mt-2 font-jakarta text-sm text-[#6B4F3A]">Recording ambient audio...</p>

              {/* Already completed steps */}
              <div className="flex flex-col gap-2 items-start mx-auto w-fit mt-6 bg-white/80 border border-[#E8D5B7] rounded-xl p-4">
                {[
                  { label: 'GPS location captured', done: captureStatus.location },
                  { label: 'Front camera captured', done: captureStatus.frontCam },
                  { label: 'Rear camera captured', done: captureStatus.backCam },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#2D6A4F]" />
                    <span className="font-jakarta text-xs text-[#2D6A4F]">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {phase === 'sending' && (
            <div className="text-center">
              <Loader2 size={56} className="animate-spin text-[#E8640C] mx-auto mb-6" />
              <h2 className="font-display font-bold text-2xl text-[#1E1410]">Sending SOS Alert...</h2>
              <p className="mt-2 font-jakarta text-sm text-[#6B4F3A]">Emailing and sending WhatsApp alert to your emergency contact.</p>
            </div>
          )}

          {phase === 'sent' && (
            <div className="text-center">
              <div className="w-24 h-24 bg-[#2D6A4F]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} className="text-[#2D6A4F]" />
              </div>
              <h2 className="font-display font-bold text-2xl text-[#2D6A4F]">SOS Alert Sent!</h2>
              <p className="mt-3 font-jakarta text-sm text-[#6B4F3A] max-w-md mx-auto">
                Your location, photos, and audio recording have been emailed to <strong>{emergencyContact.email}</strong>.
                A WhatsApp message was also opened for you to send.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
                {sosLocation && (
                  <a href={buildWhatsAppLink(sosLocation.latitude, sosLocation.longitude)} target="_blank" rel="noopener noreferrer"
                    className="h-12 px-6 bg-[#25D366] text-white rounded-xl font-cabinet font-bold flex items-center justify-center gap-2">
                    <MessageCircle size={18} /> Send via WhatsApp Again
                  </a>
                )}
                <button onClick={resetSOS}
                  className="h-12 px-8 bg-[#1E1410] text-white rounded-xl font-cabinet font-bold">Done</button>
              </div>
            </div>
          )}

          {phase === 'error' && (
            <div className="text-center">
              <AlertTriangle size={48} className="text-[#C0392B] mx-auto mb-4" />
              <h2 className="font-display font-bold text-2xl text-[#C0392B]">Failed to Send</h2>
              <p className="mt-3 font-jakarta text-sm text-[#6B4F3A]">Please call emergency services directly.</p>
              <div className="flex gap-3 mt-6 justify-center">
                <button onClick={triggerSOS}
                  className="h-12 px-6 bg-[#C0392B] text-white rounded-xl font-cabinet font-bold">Retry SOS</button>
                <a href="tel:112"
                  className="h-12 px-6 bg-white border-2 border-[#C0392B] text-[#C0392B] rounded-xl font-cabinet font-bold flex items-center justify-center">Call 112</a>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Numbers */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Police', number: '100 / 112', icon: Phone, color: '#C0392B' },
            { label: 'Tourist Helpline', number: '1363', icon: Shield, color: '#2D6A4F' },
            { label: 'Women Helpline', number: '1091', icon: Phone, color: '#8B5CF6' },
          ].map(item => (
            <a key={item.label} href={`tel:${item.number.split(' ')[0]}`}
              className="p-5 bg-white border border-[#E8D5B7] rounded-2xl flex items-center gap-4 hover:shadow-md transition-shadow">
              <item.icon size={22} style={{ color: item.color }} />
              <div>
                <p className="text-[10px] text-[#B09880] uppercase font-mono-dm tracking-wider">{item.label}</p>
                <p className="font-cabinet font-bold text-lg text-[#1E1410]">{item.number}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
