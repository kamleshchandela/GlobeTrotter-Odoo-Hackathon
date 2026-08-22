import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../../store/authSlice";
import { API_BASE_URL, GOOGLE_OAUTH_CLIENT_ID } from "../../config/env";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Please enter a valid email address.").required("Email is required"),
  password: Yup.string().required("Password is required."),
});

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.05 2.53.84 3.2 1.05 1.45-.48 2.91-1.39 4.38-1.18 1.83.25 3.33 1.25 4.15 2.76-3.48 2.03-2.86 6.32.49 7.72-.75 1.81-1.77 3.59-4.22 2.62zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.36 2.37-1.92 4.26-3.74 4.25z" fill="#000000" />
  </svg>
);

const GoogleLoginButton = ({ onSuccess, onError, disabled }) => {
  const login = useGoogleLogin({
    onSuccess,
    onError
  });

  return (
    <button 
      type="button" 
      onClick={() => login()} 
      disabled={disabled}
      className="flex-1 h-[52px] bg-white border border-sand rounded-[10px] flex items-center justify-center gap-2 hover:bg-ivory hover:border-[#C8B597] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <GoogleIcon />
      <span className="font-cabinet font-medium text-[14px] text-charcoal">Google</span>
    </button>
  );
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setError("");
        dispatch(loginStart());
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        const resData = await res.json().catch(() => ({ message: "Server returned a non-JSON response" }));
        if (res.ok) {
          dispatch(loginSuccess({ user: resData, token: resData.token }));
          navigate('/home');
        } else {
          const errorMsg = resData?.message || 'Invalid email or password. Please try again.';
          dispatch(loginFailure(errorMsg));
          setError(errorMsg);
        }
      } catch (err) {
        console.error('Login error:', err);
        const errorMsg = 'Unable to connect to the server. Please check your internet connection and try again.';
        dispatch(loginFailure(errorMsg));
        setError(errorMsg);
      } finally {
        setSubmitting(false);
      }
    },
  });



  const TopRightLink = (
    <span className="text-sm font-jakarta text-taupe">
      New to My Itinerary?{" "}
      <Link to="/auth/signup" className="text-saffron hover:underline font-medium">Create an account</Link>
    </span>
  );

  return (
    <AuthLayout
      photoUrl="https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=2000"
      quote={`Every journey in India\nbegins with one safe step.`}
      badges={["Verified Guardians", "Real-Time Safety", "Women-First Design"]}
      topRightContent={TopRightLink}
    >
      <div>
        <h1 className="font-display font-bold text-4xl text-charcoal mb-2">Welcome back</h1>
        <p className="font-jakarta text-taupe text-[15px]">
          Log in to continue your safe journey across India.
        </p>
      </div>

      <div className="h-[24px]"></div>
      
      {error && (
        <div className="mb-6 p-4 bg-[#FFF0F0] border-l-4 border-sindoor rounded-r-[10px] flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <AlertCircle className="h-5 w-5 text-sindoor shrink-0 mt-0.5" />
          <p className="font-jakarta text-[14px] text-[#A03030] leading-snug">
            {error}
          </p>
        </div>
      )}

      <div className="h-[1px] w-full bg-sand"></div>
      <div className="h-[24px]"></div>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
        <div className="relative">
          <label className="block font-cabinet font-medium text-[13px] text-charcoal uppercase tracking-wide mb-2">
            EMAIL ADDRESS
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-[18px] w-[18px] text-[#B09880]" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full h-[52px] pl-11 pr-4 rounded-[10px] border-[1.5px] bg-white font-jakarta text-[15px] outline-none transition-all duration-200
                ${
                  formik.touched.email && formik.errors.email
                    ? "border-sindoor focus:border-sindoor"
                    : "border-sand focus:border-saffron focus:shadow-[0_0_0_4px_rgba(232,100,12,0.15)]"
                }`}
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <p className="mt-1.5 text-[13px] font-jakarta text-sindoor">
              {formik.errors.email}
            </p>
          )}
        </div>

        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <label className="block font-cabinet font-medium text-[13px] text-charcoal uppercase tracking-wide">
              PASSWORD
            </label>
            <Link to="/auth/forgot-password" className="text-[13px] font-jakarta text-saffron hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-[18px] w-[18px] text-[#B09880]" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full h-[52px] pl-11 pr-11 rounded-[10px] border-[1.5px] bg-white font-jakarta text-[15px] outline-none transition-all duration-200
                ${
                  formik.touched.password && formik.errors.password
                    ? "border-sindoor focus:border-sindoor"
                    : "border-sand focus:border-saffron focus:shadow-[0_0_0_4px_rgba(232,100,12,0.15)]"
                }`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#6B4F3A] hover:text-saffron transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-[20px] w-[20px]" />
              ) : (
                <Eye className="h-[20px] w-[20px]" />
              )}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="mt-1.5 text-[13px] font-jakarta text-sindoor">
              {formik.errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full h-[52px] mt-2 bg-saffron hover:bg-[#F07020] text-white font-cabinet font-semibold text-base rounded-[10px] shadow-[0_4px_16px_rgba(232,100,12,0.30)] hover:shadow-[0_6px_20px_rgba(232,100,12,0.40)] transition-all duration-200 disabled:bg-sand disabled:text-[#B09880] disabled:shadow-none flex items-center justify-center"
        >
          {formik.isSubmitting ? (
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            "Log In"
          )}
        </button>
      </form>

      <div className="my-[28px] flex items-center gap-4">
        <div className="flex-1 h-[1px] bg-sand"></div>
        <span className="font-jakarta text-[13px] text-taupe">or continue with</span>
        <div className="flex-1 h-[1px] bg-sand"></div>
      </div>

      <div className="flex gap-3">
        {GOOGLE_OAUTH_CLIENT_ID ? (
          <GoogleLoginButton 
            onSuccess={async (tokenResponse) => {
              try {
                dispatch(loginStart());
                const res = await fetch(`${API_BASE_URL}/auth/google`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ token: tokenResponse.access_token }),
                });
                const data = await res.json().catch(() => ({ message: "Server returned a non-JSON response" }));
                if (res.ok) {
                  dispatch(loginSuccess({ user: data, token: data.token }));
                  if (data.isProfileComplete === false) navigate('/complete-profile');
                  else navigate('/home');
                } else {
                  setError(data?.message || 'Google authentication failed');
                }
              } catch (err) {
                console.error('Google login error:', err);
                setError('Google login failed. Unable to connect to the authentication server.');
                dispatch(loginFailure('Google authentication unreachable.'));
              }
            }}
            onError={() => setError('Google Authentication failed.')}
          />
        ) : (
          <button type="button" disabled className="flex-1 h-[52px] bg-white border border-sand rounded-[10px] flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
            <GoogleIcon />
            <span className="font-cabinet font-medium text-[14px] text-charcoal">Google (Disabled)</span>
          </button>
        )}
        <button type="button" className="flex-1 h-[52px] bg-white border border-sand rounded-[10px] flex items-center justify-center gap-2 hover:bg-ivory hover:border-[#C8B597] transition-all shadow-sm">
          <AppleIcon />
          <span className="font-cabinet font-medium text-[14px] text-charcoal">Apple</span>
        </button>
      </div>


      <div className="mt-8 text-center text-[12px] font-jakarta text-taupe leading-relaxed max-w-[320px] mx-auto">
        By logging in, you agree to our{" "}
        <Link to="/terms" className="text-saffron hover:underline">Terms of Service</Link>{" "}
        and{" "}
        <Link to="/privacy" className="text-saffron hover:underline">Privacy Policy</Link>
      </div>
    </AuthLayout>
  );
}
