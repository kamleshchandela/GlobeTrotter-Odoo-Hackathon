import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Check, X, ArrowRight } from "lucide-react";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { CountryCodeSelect } from "../../components/ui/CountryCodeSelect";
import { useFormik } from "formik";
import * as Yup from "yup";

const step1Schema = Yup.object().shape({
  fullName: Yup.string().min(2, "Full name is required").required("Full name is required"),
  email: Yup.string().email("Valid email required").required("Email is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Enter a valid 10-digit phone number (digits only)")
    .required("Phone number is required"),
  password: Yup.string().min(8, "Minimum 8 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], "Passwords do not match.")
    .required("Please confirm your password"),
  terms: Yup.boolean().oneOf([true], "You must agree to the terms"),
});

export default function SignupStep1() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dialCode, setDialCode] = useState("+91");

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
    validationSchema: step1Schema,
    onSubmit: (values) => {
      const phoneWithCode = dialCode + values.phone;
      sessionStorage.setItem("signup_step1", JSON.stringify({ ...values, phone: phoneWithCode }));
      navigate("/auth/signup/step2");
    },
  });

  const pw = formik.values.password || "";
  let strengthStr = "Weak";
  let strengthColor = "bg-sindoor";
  let width = "25%";
  if (pw.length > 5) { strengthStr = "Fair"; strengthColor = "bg-turmeric"; width = "50%"; }
  if (pw.length >= 8) { strengthStr = "Strong"; strengthColor = "bg-banyan"; width = "75%"; }
  if (pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw)) { strengthStr = "Very Strong"; strengthColor = "bg-[#1B4332]"; width = "100%"; }

  const stepIndicator = (
    <div className="flex flex-col items-end gap-[20px] pointer-events-none">
      <div className="flex items-center gap-4">
        <span className="font-mono-dm text-[11px] text-white bg-black/20 px-2 py-0.5 rounded backdrop-blur-sm">Basic Info</span>
        <div className="w-[10px] h-[10px] rounded-full bg-saffron shadow-[0_0_8px_rgba(232,100,12,0.8)] relative z-10" />
      </div>
      <div className="w-[2px] h-[20px] bg-white/20 absolute top-[15px] right-[4px]" />
      <div className="flex items-center gap-4">
        <span className="font-mono-dm text-[11px] text-white/60">Preferences</span>
        <div className="w-[10px] h-[10px] rounded-full bg-white/30 relative z-10" />
      </div>
      <div className="w-[2px] h-[20px] bg-white/20 absolute top-[45px] right-[4px]" />
      <div className="flex items-center gap-4">
        <span className="font-mono-dm text-[11px] text-white/60">Safety</span>
        <div className="w-[10px] h-[10px] rounded-full bg-white/30 relative z-10" />
      </div>
    </div>
  );

  const TopRightLink = (
    <span className="text-sm font-jakarta text-taupe">
      Already have an account?{" "}
      <Link to="/auth/login" className="text-saffron hover:underline font-medium">Log in</Link>
    </span>
  );

  return (
    <AuthLayout
      photoUrl="https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2000"
      topLabel="STEP 1 OF 3"
      quote={`Tell us who you are.\nWe'll keep you safe wherever you go.`}
      stepIndicator={stepIndicator}
      topRightContent={TopRightLink}
    >
      <div>
        <h1 className="font-display font-bold text-4xl text-charcoal mb-2">Create your account</h1>
        <p className="font-jakarta text-[15px] text-taupe mb-8">Start your safer India journey in 3 quick steps.</p>
        
        {/* Horizontal Step Strip for Form Area */}
        <div className="flex justify-between items-center mb-10 pb-4 border-b border-sand text-center px-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-saffron shadow-[0_0_8px_rgba(232,100,12,0.5)]" />
            <span className="font-mono-dm text-[10px] font-bold text-charcoal tracking-widest uppercase">Basic Info</span>
          </div>
          <div className="flex-1 h-[2px] bg-sand mx-4 -mt-5" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-sand" />
            <span className="font-mono-dm text-[10px] text-taupe uppercase tracking-widest">Preferences</span>
          </div>
          <div className="flex-1 h-[2px] bg-sand mx-4 -mt-5" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-sand" />
            <span className="font-mono-dm text-[10px] text-taupe uppercase tracking-widest">Safety</span>
          </div>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
        <div className="relative">
          <label className="block font-cabinet font-medium text-[13px] text-charcoal uppercase tracking-wide mb-2">FULL NAME</label>
          <div className="relative">
            <User className="absolute top-4 left-4 h-[18px] w-[18px] text-[#B09880]" />
            <input 
              type="text" 
              name="fullName"
              placeholder="As it appears on your ID" 
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full h-[52px] pl-11 pr-4 rounded-[10px] border-[1.5px] bg-white outline-none transition-all font-jakarta text-[15px] ${formik.touched.fullName && formik.errors.fullName ? "border-sindoor focus:shadow-[0_0_0_4px_rgba(192,57,43,0.15)]" : "border-sand focus:border-saffron focus:shadow-[0_0_0_4px_rgba(232,100,12,0.15)]"}`} 
            />
          </div>
          {formik.touched.fullName && formik.errors.fullName && <p className="mt-1.5 text-[13px] font-jakarta text-sindoor">{formik.errors.fullName}</p>}
        </div>

        <div className="relative">
          <label className="block font-cabinet font-medium text-[13px] text-charcoal uppercase tracking-wide mb-2">EMAIL ADDRESS</label>
          <div className="relative">
            <Mail className="absolute top-4 left-4 h-[18px] w-[18px] text-[#B09880]" />
            <input 
              type="email" 
              name="email"
              placeholder="you@example.com" 
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full h-[52px] pl-11 pr-4 rounded-[10px] border-[1.5px] bg-white outline-none transition-all font-jakarta text-[15px] ${formik.touched.email && formik.errors.email ? "border-sindoor focus:shadow-[0_0_0_4px_rgba(192,57,43,0.15)]" : "border-sand focus:border-saffron focus:shadow-[0_0_0_4px_rgba(232,100,12,0.15)]"}`} 
            />
          </div>
          {formik.touched.email && formik.errors.email ? (
            <p className="mt-1.5 text-[13px] font-jakarta text-sindoor">{formik.errors.email}</p>
          ) : (
            <p className="mt-1.5 text-[13px] font-jakarta text-taupe select-none">We will send a verification link to this email.</p>
          )}
        </div>

        <div className="relative">
          <label className="block font-cabinet font-medium text-[13px] text-charcoal uppercase tracking-wide mb-2">PHONE NUMBER</label>
          <div className={`relative flex items-center bg-white rounded-[10px] border-[1.5px] overflow-visible h-[52px] transition-all
            ${formik.touched.phone && formik.errors.phone ? "border-sindoor focus-within:shadow-[0_0_0_4px_rgba(192,57,43,0.15)]" : "border-sand focus-within:border-saffron focus-within:shadow-[0_0_0_4px_rgba(232,100,12,0.15)]"}`}
          >
            <CountryCodeSelect 
              value={dialCode} 
              onChange={setDialCode} 
            />
            <input 
              type="tel" 
              name="phone"
              placeholder="10-digit mobile number" 
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full h-[52px] pl-3 pr-4 outline-none bg-transparent font-jakarta text-[15px]" 
            />
          </div>
          {formik.touched.phone && formik.errors.phone ? (
            <p className="mt-1.5 text-[13px] font-jakarta text-sindoor">{formik.errors.phone}</p>
          ) : (
            <p className="mt-1.5 text-[13px] font-jakarta text-taupe select-none">Used for OTP verification and SOS alerts only.</p>
          )}
        </div>

        <div className="relative">
          <label className="block font-cabinet font-medium text-[13px] text-charcoal uppercase tracking-wide mb-2">CREATE PASSWORD</label>
          <div className="relative">
            <Lock className="absolute top-4 left-4 h-[18px] w-[18px] text-[#B09880]" />
            <input 
              type={showPassword ? "text" : "password"} 
              name="password"
              placeholder="Minimum 8 characters" 
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full h-[52px] pl-11 pr-11 rounded-[10px] border-[1.5px] bg-white outline-none transition-all font-jakarta text-[15px] ${formik.touched.password && formik.errors.password ? "border-sindoor focus:shadow-[0_0_0_4px_rgba(192,57,43,0.15)]" : "border-sand focus:border-saffron focus:shadow-[0_0_0_4px_rgba(232,100,12,0.15)]"}`} 
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-4 right-4 text-[#6B4F3A] hover:text-saffron transition-colors">
              {showPassword ? <EyeOff className="w-[20px] h-[20px]" /> : <Eye className="w-[20px] h-[20px]" />}
            </button>
          </div>
          {pw.length > 0 ? (
            <div className="flex items-center gap-3 mt-3">
              <div className="h-[4px] flex-1 bg-sand border border-sand/50 rounded-full overflow-hidden">
                <div className={`h-full ${strengthColor} transition-all duration-300`} style={{ width }} />
              </div>
              <span className={`text-[12px] font-mono-dm font-bold tracking-wider uppercase ${formik.errors.password ? "text-sindoor" : "text-taupe"}`}>{strengthStr}</span>
            </div>
          ) : (
            formik.touched.password && formik.errors.password && <p className="mt-1.5 text-[13px] font-jakarta text-sindoor">{formik.errors.password}</p>
          )}
        </div>

        <div className="relative">
          <label className="block font-cabinet font-medium text-[13px] text-charcoal uppercase tracking-wide mb-2">CONFIRM PASSWORD</label>
          <div className="relative">
            <Lock className="absolute top-4 left-4 h-[18px] w-[18px] text-[#B09880]" />
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              name="confirmPassword"
              placeholder="Re-enter your password" 
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full h-[52px] pl-11 pr-11 rounded-[10px] border-[1.5px] bg-white outline-none transition-all font-jakarta text-[15px] ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-sindoor focus:shadow-[0_0_0_4px_rgba(192,57,43,0.15)]" : "border-sand focus:border-saffron focus:shadow-[0_0_0_4px_rgba(232,100,12,0.15)]"}`} 
            />
            <div className="absolute top-[16px] right-4 pointer-events-none">
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? <X className="w-5 h-5 text-sindoor" /> : (formik.values.confirmPassword && width === "100%" && formik.values.password === formik.values.confirmPassword ? <Check className="w-5 h-5 text-banyan" /> : null)}
            </div>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <p className="mt-1.5 text-[13px] font-jakarta text-sindoor">{formik.errors.confirmPassword}</p>
          ) : (formik.values.confirmPassword && formik.values.password === formik.values.confirmPassword ? (
            <p className="mt-1.5 text-[13px] font-jakarta text-banyan">Passwords match.</p>
          ) : null)}
        </div>

        <div className="flex items-start gap-3 mt-2">
          <label className="relative flex cursor-pointer items-center mt-0.5">
            <input 
              type="checkbox" 
              name="terms"
              checked={formik.values.terms}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="peer sr-only" 
            />
            <div className="h-[18px] w-[18px] rounded-[4px] border-[1.5px] border-sand peer-checked:bg-saffron peer-checked:border-saffron flex items-center justify-center transition-all bg-white">
              <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 stroke-[3px]" />
            </div>
          </label>
          <div className="text-[14px] font-jakarta text-taupe leading-relaxed">
            I agree to the <Link to="/terms" className="text-saffron hover:underline font-medium">Terms of Service</Link> and <Link to="/privacy" className="text-saffron hover:underline font-medium">Privacy Policy</Link>
          </div>
        </div>
        {formik.touched.terms && formik.errors.terms && <p className="text-[13px] font-jakarta text-sindoor ml-[30px] -mt-2">{formik.errors.terms}</p>}

        <button type="submit" className="w-full h-[52px] bg-saffron text-white font-cabinet font-semibold text-base rounded-[10px] flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(232,100,12,0.30)] hover:shadow-[0_6px_20px_rgba(232,100,12,0.40)] hover:bg-[#F07020] transition-all mt-4">
          Continue to Step 2 <ArrowRight className="w-[18px] h-[18px]" />
        </button>

        <div className="text-center mt-2 md:hidden">
            <Link to="/auth/login" className="text-[14px] font-jakarta text-taupe hover:text-charcoal transition-colors">
              Already have an account? <span className="text-saffron">Log in</span>
            </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
