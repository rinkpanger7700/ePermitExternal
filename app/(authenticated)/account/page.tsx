"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { User, Mail, Shield, Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/ToastProvider";
import { usePageTitle } from "@/context/PageTitleContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AccountPage() {
  usePageTitle("MY ACCOUNT");
  const { profile, user } = useAuth();
  const { showToast } = useToast();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name ?? "");

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", user.id);
    if (error) showToast("error", "Save Failed", error.message);
    else showToast("success", "Profile updated!");
    setSaving(false);
  };

  return (
    <div className="px-6 py-6 w-full space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">My Account</h2>
          <p className="text-gray-500 mt-2 text-sm">Manage your profile information and account settings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Avatar Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center gap-4">
              <div className="w-28 h-28 bg-[#EFF6FF] rounded-full flex items-center justify-center border-4 border-[#DBEAFE] flex-shrink-0 shadow-sm">
                <User className="w-12 h-12 text-[#1A3A8F]" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">{profile?.full_name || "User"}</p>
                <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
                <span className="inline-block mt-3 text-xs bg-blue-50 text-[#1A3A8F] font-semibold px-4 py-1.5 rounded-full capitalize">
                  {profile?.role || "Applicant"}
                </span>
              </div>
            </div>

            {/* Security section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#1A3A8F]" />
                </div>
                Security
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                To change your password, use the &quot;Forgot password?&quot; option on the login page and enter your registered email address. A reset link will be sent to your inbox.
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 space-y-8">
              <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6 md:col-span-2">
                  <Input
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    icon={<User className="w-4 h-4" />}
                    id="account-fullname"
                  />
                  <Input
                    label="Email Address"
                    value={user?.email || ""}
                    disabled
                    icon={<Mail className="w-4 h-4" />}
                    id="account-email"
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <Button onClick={handleSave} loading={saving} size="lg" id="save-profile-btn" className="w-full sm:w-auto px-10">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
