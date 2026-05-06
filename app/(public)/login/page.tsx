"use client";

export const dynamic = 'force-dynamic';

import React, { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "register" ? "register" : "login";
  const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab as "login" | "register");
  const { showToast } = useToast();
  const supabase = createClient();

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

  // Register state
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPw, setShowRegPw] = useState(false);
  const [showRegConfirmPw, setShowRegConfirmPw] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!loginEmail) errors.email = "Email is required";
    if (!loginPassword) errors.password = "Password is required";
    if (Object.keys(errors).length) { setLoginErrors(errors); return; }

    setLoginLoading(true);
    setLoginErrors({});
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      showToast("error", "Login Failed", error.message);
      setLoginErrors({ password: error.message });
    } else {
      showToast("success", "Welcome back!", "Redirecting to your dashboard...");
      router.push("/dashboard");
      router.refresh();
    }
    setLoginLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!regFullName.trim()) errors.fullName = "Full name is required";
    if (!regEmail) errors.email = "Email is required";
    if (!regPassword || regPassword.length < 6) errors.password = "Password must be at least 6 characters";
    if (regPassword !== regConfirmPassword) errors.confirmPassword = "Passwords do not match";
    if (!agreedToTerms) errors.terms = "You must agree to the terms";
    if (Object.keys(errors).length) { setRegErrors(errors); return; }

    setRegLoading(true);
    setRegErrors({});
    const { error } = await supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
      options: { data: { full_name: regFullName } },
    });

    if (error) {
      showToast("error", "Registration Failed", error.message);
      setRegErrors({ email: error.message });
    } else {
      showToast("success", "Account Created!", "Redirecting to your dashboard...");
      router.push("/dashboard");
      router.refresh();
    }
    setRegLoading(false);
  };

  return (
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr]">

        {/* ── LOGIN SIDE ── */}
        <div className="p-8 lg:p-10">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Welcome Back!</h2>
            <p className="text-gray-500 text-sm">Login to your account.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              error={loginErrors.email}
              required
              id="login-email"
            />
            <Input
              label="Password"
              type={showLoginPw ? "text" : "password"}
              placeholder="Enter your password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              rightIcon={showLoginPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              onRightIconClick={() => setShowLoginPw(!showLoginPw)}
              error={loginErrors.password}
              required
              id="login-password"
            />
            <div className="text-right">
              <button type="button" className="text-sm text-[#2563EB] hover:underline font-medium">
                Forgot password?
              </button>
            </div>
            <Button type="submit" fullWidth size="lg" loading={loginLoading} id="login-submit">
              Login
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-500">
            Don&apos;t have an account?{" "}
            <button onClick={() => setActiveTab("register")} className="text-[#2563EB] font-semibold hover:underline">
              Register here
            </button>
          </p>
        </div>

        {/* ── CENTER DIVIDER ── */}
        <div className="hidden lg:flex flex-col items-center justify-center px-4">
          <div className="flex-1 w-px bg-gray-200" />
          <div className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-sm font-semibold text-gray-400 bg-white shadow-sm my-4">
            or
          </div>
          <div className="flex-1 w-px bg-gray-200" />
        </div>

        {/* ── REGISTER SIDE ── */}
        <div className="p-8 lg:p-10 bg-[#FAFBFF]">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Create an Account</h2>
            <p className="text-gray-500 text-sm">Sign up to start your application</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input label="Full Name" type="text" placeholder="Enter your full name" value={regFullName}
              onChange={(e) => setRegFullName(e.target.value)} icon={<User className="w-4 h-4" />}
              error={regErrors.fullName} required id="reg-fullname" />
            <Input label="Email Address" type="email" placeholder="Enter your email" value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)} icon={<Mail className="w-4 h-4" />}
              error={regErrors.email} required id="reg-email" />
            <Input label="Password" type={showRegPw ? "text" : "password"} placeholder="Create a password"
              value={regPassword} onChange={(e) => setRegPassword(e.target.value)} icon={<Lock className="w-4 h-4" />}
              rightIcon={showRegPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              onRightIconClick={() => setShowRegPw(!showRegPw)} error={regErrors.password} required id="reg-password" />
            <Input label="Confirm Password" type={showRegConfirmPw ? "text" : "password"} placeholder="Confirm your password"
              value={regConfirmPassword} onChange={(e) => setRegConfirmPassword(e.target.value)} icon={<Lock className="w-4 h-4" />}
              rightIcon={showRegConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              onRightIconClick={() => setShowRegConfirmPw(!showRegConfirmPw)} error={regErrors.confirmPassword} required id="reg-confirm-password" />

            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#1A3A8F] focus:ring-[#1A3A8F]" id="terms-checkbox" />
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <button type="button" className="text-[#2563EB] hover:underline font-medium">Terms and Conditions</button>
                  {" "}and{" "}
                  <button type="button" className="text-[#2563EB] hover:underline font-medium">Privacy Policy</button>
                </span>
              </label>
              {regErrors.terms && <p className="mt-1 text-xs text-red-600">{regErrors.terms}</p>}
            </div>

            <Button type="submit" fullWidth size="lg" loading={regLoading} id="register-submit">
              Register
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-500">
            Already have an account?{" "}
            <button onClick={() => setActiveTab("login")} className="text-[#2563EB] font-semibold hover:underline">
              Login here
            </button>
          </p>
        </div>
      </div>

      {/* Cityscape illustration */}
      <div className="relative h-28 overflow-hidden">
        <Image src="/login-cityscape.png" alt="Philippine cityscape" fill className="object-cover object-top opacity-30" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FB]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center gap-3">
          <Link href="/home" className="flex items-center gap-4">
            <div className="w-12 h-12 relative flex-shrink-0">
              <Image src="/dhsud-logo.png" alt="DHSUD Logo" fill className="object-contain" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 leading-none uppercase tracking-wide">DHSUD</p>
              <p className="text-xl font-extrabold text-[#1A3A8F] leading-tight">eServices Portal</p>
            </div>
            <span className="w-px h-11 bg-gray-200 mx-2" />
            <span className="text-3xl font-extrabold text-[#2563EB]">ePermits</span>
          </Link>
        </div>
      </header>

      {/* Page Title Banner */}
      <div className="bg-[#0F2461] py-3 px-6">
        <p className="text-white font-bold text-sm uppercase tracking-wide text-center">Login / Registration</p>
      </div>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center py-10 px-4">
        <Suspense fallback={<div className="w-full max-w-5xl h-96 bg-white rounded-2xl animate-pulse" />}>
          <LoginContent />
        </Suspense>
      </main>
    </div>
  );
}
