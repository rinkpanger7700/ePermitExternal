"use client";

import { HelpCircle, ChevronDown, Phone, Mail, MapPin } from "lucide-react";
import { usePageTitle } from "@/context/PageTitleContext";

const FAQS = [
  {
    q: "How do I apply for a Development Permit?",
    a: "Click 'New Application' in the sidebar, select 'Application for Development Permit', fill in the applicant and project information, upload the required documents, review and submit, then proceed to payment.",
  },
  {
    q: "What file formats are accepted for document uploads?",
    a: "Only PDF files are accepted for all document uploads. Each file must not exceed 10MB in size.",
  },
  {
    q: "How long does the evaluation process take?",
    a: "The evaluation process typically takes 15 to 30 working days from the date of receipt of complete documentary requirements and payment.",
  },
  {
    q: "How do I pay my application fee?",
    a: "After submitting your application, you will receive an Order of Payment. You can pay via LANDBank LinkBiz portal or scan the QR code on the payment page.",
  },
  {
    q: "How will I know when my permit is ready?",
    a: "You will receive a notification in the Notifications section when your permit is released. You can also track your application status in real time on the Track Application page.",
  },
  {
    q: "What should I do if I uploaded the wrong document?",
    a: "Go back to the Requirements Upload step and re-upload the correct document. The system will automatically update the status.",
  },
  {
    q: "How do I contact DHSUD for assistance?",
    a: "You can reach us via the contact details below. Our office is open Monday to Friday, 8:00 AM to 5:00 PM.",
  },
];

export default function HelpPage() {
  usePageTitle("HELP & SUPPORT");
  return (
    <div className="px-6 py-6 w-full space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Help & Support</h2>
          <p className="text-gray-500 mt-2 text-sm">Frequently asked questions and contact information.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column: FAQs */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden h-fit">
              <div className="px-8 py-6 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shadow-sm">
                    <HelpCircle className="w-5 h-5 text-[#1A3A8F]" />
                  </div>
                  Frequently Asked Questions
                </h3>
              </div>
              {FAQS.map((faq, i) => (
                <details key={i} className="group px-8">
                  <summary className="flex items-center justify-between py-5 cursor-pointer list-none font-semibold text-gray-800 text-sm gap-4">
                    {faq.q}
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="pb-5 text-sm text-gray-500 leading-relaxed -mt-1">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Right Column: Contact Info */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-fit">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                Contact Us
              </h3>
              <div className="grid grid-cols-1 gap-5">
                {[
                  { icon: Phone, label: "Phone", value: "(02) 8351-2437", bg: "bg-blue-50", color: "text-[#1A3A8F]" },
                  { icon: Mail, label: "Email", value: "epermits@dhsud.gov.ph", bg: "bg-green-50", color: "text-green-600" },
                  { icon: MapPin, label: "Address", value: "Kalayaan Ave., Diliman, Quezon City", bg: "bg-purple-50", color: "text-purple-600" },
                ].map(({ icon: Icon, label, value, bg, color }) => (
                  <div key={label} className={`flex items-start gap-4 p-5 ${bg} rounded-2xl border border-white border-opacity-50`}>
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">{label}</p>
                      <p className="text-sm text-gray-800 font-semibold leading-relaxed">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
