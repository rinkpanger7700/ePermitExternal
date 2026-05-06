"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Grid2X2, FileCheck, Tag, PenLine, Home, FileBadge, CalendarClock } from "lucide-react";
import { usePageTitle } from "@/context/PageTitleContext";
import { APPLICATION_TYPE_SLUGS } from "@/lib/constants";
import type { ApplicationType } from "@/lib/types";

const APP_TYPES: {
  type: ApplicationType;
  icon: React.ElementType;
  description: string;
  bg: string;
}[] = [
  {
    type: "Development Permit",
    icon: Grid2X2,
    description: "Apply for a development permit for your project.",
    bg: "bg-[#2563EB]", // Blue
  },
  {
    type: "Certificate of Registration and License to Sell",
    icon: FileCheck,
    description: "Apply for certificate of registration and license to sell.",
    bg: "bg-[#22C55E]", // Green
  },
  {
    type: "Temporary License to Sell",
    icon: Tag,
    description: "Apply for a temporary license to sell.",
    bg: "bg-[#F59E0B]", // Orange/Yellow
  },
  {
    type: "Alteration of Plan",
    icon: PenLine,
    description: "Apply for alteration or modification of an approved plan.",
    bg: "bg-[#8B5CF6]", // Purple
  },
  {
    type: "Application for Balanced Housing",
    icon: Home,
    description: "Apply for balanced housing compliance requirements.",
    bg: "bg-[#06B6D4]", // Teal/Cyan
  },
  {
    type: "Application for COC",
    icon: FileBadge,
    description: "Apply for a certificate of completion.",
    bg: "bg-[#EF4444]", // Red
  },
  {
    type: "Application for Additional Period of Time to Complete Project",
    icon: CalendarClock,
    description: "Request an extension to complete the project.",
    bg: "bg-[#3B82F6]", // Lighter Blue
  },
];

export default function NewApplicationPage() {
  usePageTitle("NEW APPLICATION");
  return (
    <div className="px-4 sm:px-6 py-6 max-w-[1600px] mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 lg:p-10 shadow-sm min-h-[calc(100vh-140px)]">
        
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F2461]">Select Application Type</h2>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Choose the type of application you want to file. Each type has specific requirements.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full">
          {APP_TYPES.map(({ type, icon: Icon, description, bg }) => {
            let displayTitle: string = type;
            if (type === "Certificate of Registration and License to Sell") displayTitle = "Application for CR/LS";
            else if (type === "Alteration of Plan") displayTitle = "Application for Alteration";
            else if (!type.startsWith("Application for")) displayTitle = `Application for ${type}`;
              
            return (
              <Link
                key={type}
                href={`/new-application/${APPLICATION_TYPE_SLUGS[type]}/step1`}
                className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 flex items-start gap-4 hover:shadow-lg hover:border-[#BFDBFE] transition-all duration-200 group h-full"
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 ${bg} rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col flex-1 h-full">
                  <h3 className="font-bold text-[#1e293b] leading-snug mb-1.5 text-sm sm:text-base">{displayTitle}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-4 flex-1">{description}</p>
                  <div className="flex justify-end mt-auto">
                    <ArrowRight className="w-5 h-5 text-[#2563EB] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
