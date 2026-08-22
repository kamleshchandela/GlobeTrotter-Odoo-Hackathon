import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Info, ArrowLeft, Send } from "lucide-react";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export default function ForgotPassword() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(45);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data) => {
    setIsSuccess(true);
    
    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const TopRightLink = (
    <span className="text-sm font-jakarta text-taupe">
      Remember your password?{" "}
      <Link to="/auth/login" className="text-saffron hover:underline font-medium">Log in</Link>
    </span>
  );

  return (
    <AuthLayout
      photoUrl="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2000"
      quote={`It happens to everyone.\nWe will get you back on the road.`}
      topRightContent={TopRightLink}
    >
      {!isSuccess ? (
        <>
          <div>
            <h1 className="font-display font-bold text-4xl text-charcoal mb-2">Reset your password</h1>
            <p className="font-jakarta text-taupe text-[15px] mb-8">
              Enter the email address linked to your account. We will send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div className="relative">
              <label className="block font-cabinet font-medium text-[13px] text-charcoal uppercase tracking-wide mb-2">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="absolute top-4 left-4 h-[18px] w-[18px] text-[#B09880]" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className={`w-full h-[52px] pl-11 pr-4 rounded-[10px] border-[1.5px] bg-white font-jakarta text-[15px] outline-none transition-all
                    ${errors.email ? "border-sindoor focus:shadow-[0_0_0_4px_rgba(192,57,43,0.15)]" : "border-sand focus:border-saffron focus:shadow-[0_0_0_4px_rgba(232,100,12,0.15)]"}`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-[13px] font-jakarta text-sindoor">{errors.email.message}</p>
              )}
            </div>

            <div className="bg-[#FEF3E2] border-[1.5px] border-sand rounded-[10px] p-4 flex gap-3 items-start mt-2 shadow-sm">
              <Info className="w-[20px] h-[20px] text-turmeric shrink-0 mt-[1px]" />
              <p className="text-[13px] font-jakarta text-taupe leading-relaxed">
                The reset link will be valid for 15 minutes. Check your spam folder if you do not see the email.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[52px] bg-saffron hover:bg-[#F07020] text-white font-cabinet font-semibold text-base rounded-[10px] shadow-[0_4px_16px_rgba(232,100,12,0.30)] hover:shadow-[0_6px_20px_rgba(232,100,12,0.40)] transition-all flex justify-center items-center mt-4"
            >
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Send Reset Link"
              )}
            </button>

            <Link to="/auth/login" className="flex justify-center items-center gap-2 text-[14px] font-jakarta text-taupe hover:text-charcoal mt-6 transition-colors w-fit mx-auto">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </form>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-8 animate-fade-in">
          <div className="w-[80px] h-[80px] rounded-full border-[2px] border-banyan bg-[rgba(45,106,79,0.1)] flex items-center justify-center mb-8 shadow-sm">
            <Send className="w-9 h-9 text-banyan ml-1" />
          </div>
          <h2 className="font-display font-bold text-[30px] text-charcoal mb-4">Check your inbox</h2>
          <p className="font-jakarta text-taupe text-[16px] max-w-[360px] mx-auto leading-relaxed mb-6">
            We have sent a password reset link to the email address you provided. The link expires in 15 minutes.
          </p>
          <div className="bg-[#FEF3E2] border-[1.5px] border-sand px-5 py-2 rounded-full mb-10 shadow-sm">
            <span className="font-mono-dm text-[13px] text-charcoal font-medium">{watch("email")}</span>
          </div>

          <button className="w-full h-[52px] bg-saffron hover:bg-[#F07020] text-white font-cabinet font-semibold text-base rounded-[10px] shadow-[0_4px_16px_rgba(232,100,12,0.30)] hover:shadow-[0_6px_20px_rgba(232,100,12,0.40)] transition-all flex justify-center items-center mb-8">
             Open Email App
          </button>

          {countdown > 0 ? (
            <p className="font-mono-dm text-[14px] text-taupe">Did not receive it? Resend in 0:{countdown.toString().padStart(2, '0')}</p>
          ) : (
            <button onClick={() => setCountdown(45)} className="font-jakarta text-[14px] text-saffron hover:underline focus:outline-none font-medium">
              Resend reset link
            </button>
          )}
        </div>
      )}
    </AuthLayout>
  );
}
