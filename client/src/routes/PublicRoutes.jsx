import { lazy } from "react";
import { Routes, Route } from "react-router-dom";


const LandingPage = lazy(() => import("../pages/home/LandingPage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const SignupStep1 = lazy(() => import("../pages/auth/SignupStep1"));
const SignupStep2 = lazy(() => import("../pages/auth/SignupStep2"));
const SignupStep3 = lazy(() => import("../pages/auth/SignupStep3"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const OtpVerification = lazy(() => import("../pages/auth/OtpVerification"));
const TermsPage = lazy(() => import("../pages/system/TermsPage"));
const PrivacyPage = lazy(() => import("../pages/system/PrivacyPage"));

const PublicRoutes = () => (
  <>
    <Route path="/" element={<LandingPage />} />
    <Route path="/auth/login" element={<LoginPage />} />
    <Route path="/auth/signup" element={<SignupStep1 />} />
    <Route path="/auth/signup/step2" element={<SignupStep2 />} />
    <Route path="/auth/signup/step3" element={<SignupStep3 />} />
    <Route path="/auth/forgot-password" element={<ForgotPassword />} />
    <Route path="/auth/verify-otp" element={<OtpVerification />} />
    <Route path="/terms" element={<TermsPage />} />
    <Route path="/privacy" element={<PrivacyPage />} />
  </>
);



export default PublicRoutes;
