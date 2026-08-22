import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Mail } from "lucide-react";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import { API_BASE_URL } from "../../config/env";

export default function OtpVerification() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isShake, setIsShake] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  
  const dispatch = useDispatch();
  const userId = sessionStorage.getItem("verify_userId");
  const email = sessionStorage.getItem("verify_email") || "your email";

  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(false);

    // Auto-advance
    if (value !== "" && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split("");
      setOtp(newOtp);
      inputRefs[5].current.focus();
    }
  };

  const onSubmit = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setError(true);
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
      return;
    }
    
    setIsVerifying(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp: code })
      });
      const data = await res.json();
      
      if (res.ok) {
        setSuccess(true);
        sessionStorage.removeItem("verify_userId");
        sessionStorage.removeItem("verify_email");
        
        // Save to Redux store
        dispatch(loginSuccess({ user: data, token: data.token }));
        
        setTimeout(() => navigate("/home"), 1500);
      } else {
        setError(true);
        setIsShake(true);
        setTimeout(() => setIsShake(false), 500);
      }
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setResendMsg("");
    try {
      const res = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (res.ok) {
        setCountdown(60);
        setError(false);
        setOtp(["", "", "", "", "", ""]);
        setResendMsg("✓ New OTP sent to your email!");
        setTimeout(() => setResendMsg(""), 5000);
      } else {
        setResendMsg(data.message || "Failed to resend");
      }
    } catch (err) {
      setResendMsg("Network error. Try again.");
    }
  };

  const TopRightLink = (
    <span className="text-sm font-jakarta text-taupe">
      Wrong email?{" "}
      <Link to="/auth/signup" className="text-saffron hover:underline font-medium">Go back</Link>
    </span>
  );

  return (
    <AuthLayout
      photoUrl="https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2000"
      topLabel="ONE LAST STEP"
      quote={`Verified travelers.\nVerified guardians.\nVerified safety.`}
      topRightContent={TopRightLink}
    >
      <div className="flex flex-col items-center justify-center w-full max-w-[360px] mx-auto text-center mt-[-20px] mb-8 lg:hidden">
         {/* Illustration */}
         <div className="relative w-[100px] h-[100px] bg-[#FFF2E6] rounded-full flex items-center justify-center mb-6">
            <Mail className="w-12 h-12 text-saffron stroke-[1.5px]" />
            <div className="absolute right-[-4px] bottom-[-4px] bg-white rounded-full p-1.5 shadow-md">
                <Shield className="w-5 h-5 text-banyan fill-[#E8F2ED]" />
            </div>
         </div>
      </div>

      <div>
        <h1 className="font-display font-bold text-4xl text-charcoal mb-2">Check your email</h1>
        <p className="font-jakarta text-taupe text-[15px] mb-1">Enter the 6-digit code we sent to</p>
        <p className="font-cabinet font-semibold text-charcoal text-lg mb-2 tracking-wide">{email}</p>
        <p className="font-jakarta text-taupe text-[14px]">This keeps your account and safety profile secure.</p>
      </div>

      <div className={`mt-10 mb-8 ${isShake ? "animate-shake" : ""}`}>
        <div className="flex justify-between gap-2 max-w-[360px] mx-auto">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={`w-[50px] h-[64px] sm:w-[56px] text-center font-display font-bold text-[28px] rounded-[10px] outline-none transition-all duration-200
                ${success ? "bg-banyan text-white border-banyan shadow-[0_0_0_4px_rgba(45,106,79,0.15)]" : 
                  error ? "bg-white text-sindoor border-[1.5px] border-sindoor focus:shadow-[0_0_0_4px_rgba(192,57,43,0.15)]" : 
                  digit ? "bg-white text-charcoal border-[1.5px] border-saffron" : 
                  "bg-white text-charcoal border-[1.5px] border-sand focus:border-saffron focus:shadow-[0_0_0_4px_rgba(232,100,12,0.15)]"
                }`}
            />
          ))}
        </div>
        
        <div className="h-[20px] mt-4 flex justify-center items-center">
            {error && <p className="text-[13px] font-jakarta text-sindoor font-medium">Incorrect code. Please try again.</p>}
            {success && <p className="text-[13px] font-jakarta text-banyan font-medium">✓ Verified successfully!</p>}
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5 mb-10">
        <p className="text-[14px] font-jakarta text-taupe">Did not receive the code?</p>
        {countdown > 0 ? (
          <p className="font-mono-dm text-[14px] text-taupe font-bold tracking-widest">Resend OTP in <span className="text-charcoal">0:{countdown.toString().padStart(2, '0')}</span></p>
        ) : (
          <button onClick={handleResendOtp} className="font-jakarta text-[14px] text-saffron hover:underline focus:outline-none font-medium">
            Resend OTP
          </button>
        )}
        {resendMsg && (
          <p className={`text-[13px] font-jakarta font-medium mt-1 ${resendMsg.startsWith("✓") ? "text-banyan" : "text-sindoor"}`}>
            {resendMsg}
          </p>
        )}
      </div>

      <button
        onClick={onSubmit}
        disabled={isVerifying}
        className="w-full h-[52px] bg-saffron hover:bg-[#F07020] text-white font-cabinet font-semibold text-base rounded-[10px] shadow-[0_4px_16px_rgba(232,100,12,0.30)] hover:shadow-[0_6px_20px_rgba(232,100,12,0.40)] transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isVerifying ? (
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : success ? (
          <>✓ Verified</>
        ) : (
          <>Verify and Continue <ArrowRight className="w-[18px] h-[18px]" /></>
        )}
      </button>

      <div className="flex justify-center items-center gap-2 mt-8">
        <Shield className="w-4 h-4 text-taupe shrink-0" />
        <span className="text-[12px] font-jakarta text-taupe leading-relaxed">Your email is used only for verification. We never spam.</span>
      </div>
    </AuthLayout>
  );
}
