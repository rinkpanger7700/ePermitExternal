"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Info,
  Download,
  Building2,
  MapPin,
  Hammer,
  HardHat,
  FileText,
  Shield,
} from "lucide-react";

/* ─── Types ─── */
interface FormData {
  developmentType: string;
  projectName: string;
  projectLocation: string;
  totalLandArea: string;
  // Land Area Cost
  landPricePerSqm: string;
  // Land Development Cost
  landDevCostPerSqm: string;
  // Building Construction Cost
  residentialFloorArea: string;
  constructionCostPerSqm: string;
}

const DEVELOPMENT_TYPES = [
  "Condominium",
  "Subdivision",
  "Mixed-Use",
  "Townhouse",
  "Socialized Housing",
];

/* ─── Helpers ─── */
const fmt = (n: number) =>
  "₱" +
  n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const parseNum = (s: string) => {
  const v = parseFloat(s.replace(/,/g, ""));
  return isNaN(v) ? 0 : v;
};

/* ─── Accordion Item ─── */
function AccordionItem({
  id,
  icon: Icon,
  title,
  open,
  onToggle,
  children,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        id={`accordion-${id}`}
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-[#F8FAFF] transition-colors"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-[#1A3A8F]" />
          <span className="font-semibold text-gray-800 text-sm">{title}</span>
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-2 bg-white border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── Input Field ─── */
function FormField({
  id,
  label,
  value,
  onChange,
  type = "text",
  prefix,
  suffix,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
}) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#1A3A8F] focus-within:border-transparent">
        {prefix && (
          <span className="px-3 py-2.5 bg-gray-50 text-gray-500 text-xs border-r border-gray-200">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "0.00"}
          className="flex-1 px-3 py-2.5 text-sm text-gray-800 bg-white outline-none"
        />
        {suffix && (
          <span className="px-3 py-2.5 bg-gray-50 text-gray-500 text-xs border-l border-gray-200">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Result Row ─── */
function ResultRow({
  label,
  value,
  bold,
  indent,
}: {
  label: string;
  value: string;
  bold?: boolean;
  indent?: boolean;
}) {
  return (
    <div
      className={`flex justify-between py-2.5 ${
        bold ? "font-bold text-gray-900" : "text-gray-600"
      } ${indent ? "pl-4" : ""} border-b border-gray-100 last:border-0`}
    >
      <span className={`text-sm ${bold ? "text-gray-900" : "text-gray-600"}`}>{label}</span>
      <span className={`text-sm tabular-nums ${bold ? "text-gray-900" : "text-gray-600"}`}>{value}</span>
    </div>
  );
}

/* ─── Main Page ─── */
export default function BHDPCalculatorPage() {
  const [form, setForm] = useState<FormData>({
    developmentType: "Condominium",
    projectName: "",
    projectLocation: "",
    totalLandArea: "",
    landPricePerSqm: "",
    landDevCostPerSqm: "",
    residentialFloorArea: "",
    constructionCostPerSqm: "",
  });

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    projectDetails: false,
    landAreaCost: false,
    landDevCost: false,
    buildingCost: false,
  });

  const [showDetailed, setShowDetailed] = useState(false);

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const set = (key: keyof FormData) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* ─── Computation ─── */
  const results = useMemo(() => {
    const landArea = parseNum(form.totalLandArea);
    const landPrice = parseNum(form.landPricePerSqm);
    const landDevCostPerSqm = parseNum(form.landDevCostPerSqm);
    const resFloorArea = parseNum(form.residentialFloorArea);
    const constructionCostPerSqm = parseNum(form.constructionCostPerSqm);

    const landAreaCost = landArea * landPrice;
    const landDevelopmentCost = landArea * landDevCostPerSqm;
    const buildingConstructionCost = resFloorArea * constructionCostPerSqm;
    const totalProjectCost = landAreaCost + landDevelopmentCost + buildingConstructionCost;
    const socializedHousingReq = totalProjectCost * 0.05;

    return {
      landAreaCost,
      landDevelopmentCost,
      buildingConstructionCost,
      totalProjectCost,
      socializedHousingReq,
    };
  }, [form]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB]">
      {/* ── HEADER ── */}
      <header className="bg-[#0F2461] py-4 px-6 lg:px-12">
        <h1 className="text-white font-bold text-lg lg:text-xl leading-tight">
          BHDP Compliance Calculator{" "}
          <span className="font-normal text-blue-200 text-sm lg:text-base">
            (Section 18 of RA 7279 as amended by RA 10884)
          </span>
        </h1>
      </header>

      {/* ── DISCLAIMER ── */}
      <div className="bg-[#FFFBEA] border-b border-[#F5E6A0] px-6 lg:px-12 py-3">
        <div className="max-w-[1400px] mx-auto flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#B45309] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#78350F] leading-relaxed">
            <span className="font-bold">Disclaimer:</span> The figures presented in this report are
            system-generated and intended solely for computing balance housing compliance. Figures are
            indicative and may not reflect project cost. Computations are subject to review by DHSUD
            Regional Office.
          </p>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 lg:px-12 py-6">
        {/* Back button */}
        <div className="flex justify-end mb-4">
          <Link
            href="/epermits"
            id="bhdp-back-btn"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A3A8F] text-white font-semibold text-sm rounded-lg hover:bg-[#0F2461] transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* ── LEFT: Project Input Form ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            {/* Panel header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-[#1A3A8F]" />
              </div>
              <div>
                <h2 className="font-bold text-[#1A3A8F] text-base">Project Input Form</h2>
                <p className="text-xs text-gray-500">Enter your project details and costs in the sections below</p>
              </div>
            </div>

            {/* Development Type badge */}
            <div className="mb-5">
              <div className="flex items-center gap-2 px-4 py-2.5 border border-[#BFDBFE] bg-[#EFF6FF] rounded-lg">
                <span className="text-xs font-semibold text-[#1A3A8F]">Development Type:</span>
                <select
                  id="dev-type-select"
                  value={form.developmentType}
                  onChange={(e) => set("developmentType")(e.target.value)}
                  className="text-xs font-medium text-[#1A3A8F] bg-transparent outline-none cursor-pointer"
                >
                  {DEVELOPMENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Accordion sections */}
            <div className="flex flex-col gap-3">

              {/* Project Details */}
              <AccordionItem
                id="project-details"
                icon={Building2}
                title="Project Details"
                open={openSections.projectDetails}
                onToggle={() => toggleSection("projectDetails")}
              >
                <FormField
                  id="project-name"
                  label="Project Name"
                  type="text"
                  value={form.projectName}
                  onChange={set("projectName")}
                  placeholder="Enter project name"
                />
                <FormField
                  id="project-location"
                  label="Project Location"
                  type="text"
                  value={form.projectLocation}
                  onChange={set("projectLocation")}
                  placeholder="City / Municipality"
                />
                <FormField
                  id="total-land-area"
                  label="Total Land Area"
                  type="number"
                  value={form.totalLandArea}
                  onChange={set("totalLandArea")}
                  suffix="sqm"
                  placeholder="0"
                />
                <FormField
                  id="res-floor-area-detail"
                  label="Total Floor Area – Residential"
                  type="number"
                  value={form.residentialFloorArea}
                  onChange={set("residentialFloorArea")}
                  suffix="sqm"
                  placeholder="0"
                />
              </AccordionItem>

              {/* Land Area Cost */}
              <AccordionItem
                id="land-area-cost"
                icon={MapPin}
                title="Land Area Cost"
                open={openSections.landAreaCost}
                onToggle={() => toggleSection("landAreaCost")}
              >
                <FormField
                  id="land-price-sqm"
                  label="Land Price per sqm"
                  type="number"
                  value={form.landPricePerSqm}
                  onChange={set("landPricePerSqm")}
                  prefix="₱"
                  placeholder="0.00"
                />
                <div className="mt-2 p-3 bg-[#F8FAFF] rounded-lg border border-[#BFDBFE]">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Computed Land Area Cost:</span>
                    <span className="font-bold text-[#1A3A8F]">{fmt(results.landAreaCost)}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    = Land Area ({parseNum(form.totalLandArea).toLocaleString()} sqm) × Price per sqm
                  </p>
                </div>
              </AccordionItem>

              {/* Land Development Cost */}
              <AccordionItem
                id="land-dev-cost"
                icon={Hammer}
                title="Land Development Cost"
                open={openSections.landDevCost}
                onToggle={() => toggleSection("landDevCost")}
              >
                <FormField
                  id="land-dev-cost-sqm"
                  label="Land Development Cost per sqm"
                  type="number"
                  value={form.landDevCostPerSqm}
                  onChange={set("landDevCostPerSqm")}
                  prefix="₱"
                  placeholder="0.00"
                />
                <div className="mt-2 p-3 bg-[#F8FAFF] rounded-lg border border-[#BFDBFE]">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Computed Land Development Cost:</span>
                    <span className="font-bold text-[#1A3A8F]">{fmt(results.landDevelopmentCost)}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    = Land Area ({parseNum(form.totalLandArea).toLocaleString()} sqm) × Dev. Cost per sqm
                  </p>
                </div>
              </AccordionItem>

              {/* Building Construction Cost */}
              <AccordionItem
                id="building-cost"
                icon={HardHat}
                title="Building Construction Cost"
                open={openSections.buildingCost}
                onToggle={() => toggleSection("buildingCost")}
              >
                <FormField
                  id="res-floor-area"
                  label="Residential Floor Area"
                  type="number"
                  value={form.residentialFloorArea}
                  onChange={set("residentialFloorArea")}
                  suffix="sqm"
                  placeholder="0"
                />
                <FormField
                  id="construction-cost-sqm"
                  label="Construction Cost per sqm"
                  type="number"
                  value={form.constructionCostPerSqm}
                  onChange={set("constructionCostPerSqm")}
                  prefix="₱"
                  placeholder="0.00"
                />
                <div className="mt-2 p-3 bg-[#F8FAFF] rounded-lg border border-[#BFDBFE]">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Computed Building Construction Cost:</span>
                    <span className="font-bold text-[#1A3A8F]">{fmt(results.buildingConstructionCost)}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    = Floor Area ({parseNum(form.residentialFloorArea).toLocaleString()} sqm) × Cost per sqm
                  </p>
                </div>
              </AccordionItem>

            </div>
          </div>

          {/* ── RIGHT: Results Summary ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            {/* Panel header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border-2 border-[#1A3A8F] flex items-center justify-center flex-shrink-0">
                  <Info className="w-4 h-4 text-[#1A3A8F]" />
                </div>
                <div>
                  <h2 className="font-bold text-[#1A3A8F] text-base">Results Summary</h2>
                  <p className="text-xs text-gray-500">View calculated costs, metrics, and visualizations</p>
                </div>
              </div>
              <button
                id="bhdp-export-pdf"
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>

            {/* Computation Card */}
            <div className="border border-gray-200 rounded-xl p-5 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-bold text-gray-900 text-sm">Socialized Housing Compliance Computation</h3>
                <Info className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              </div>

              <ResultRow
                label="Total Project Cost (Residential):"
                value={fmt(results.totalProjectCost)}
                bold
              />
              <ResultRow
                label="Land Area Cost:"
                value={fmt(results.landAreaCost)}
              />
              <ResultRow
                label="Land Development Cost:"
                value={fmt(results.landDevelopmentCost)}
              />
              <ResultRow
                label="Building Construction Cost (Residential):"
                value={fmt(results.buildingConstructionCost)}
              />
              <ResultRow
                label="Socialized Housing Requirement (5%):"
                value={fmt(results.socializedHousingReq)}
              />
            </div>

            {/* Show Detailed Panels toggle */}
            <button
              id="bhdp-show-detailed"
              onClick={() => setShowDetailed((v) => !v)}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#1A3A8F] mx-auto hover:underline transition-colors"
            >
              {showDetailed ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              {showDetailed ? "Hide Detailed Panels" : "Show Detailed Panels"}
            </button>

            {/* Detailed breakdown panel */}
            {showDetailed && (
              <div className="mt-4 border border-gray-200 rounded-xl p-5 bg-[#F8FAFF] animate-slide-up">
                <h4 className="font-bold text-gray-800 text-sm mb-3">Detailed Breakdown</h4>

                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Land Area Cost</p>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Land Area</span>
                      <span>{parseNum(form.totalLandArea).toLocaleString()} sqm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price per sqm</span>
                      <span>{fmt(parseNum(form.landPricePerSqm))}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-[#1A3A8F] pt-1 border-t border-gray-200">
                      <span>Subtotal</span>
                      <span>{fmt(results.landAreaCost)}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Land Development Cost</p>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Land Area</span>
                      <span>{parseNum(form.totalLandArea).toLocaleString()} sqm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dev. Cost per sqm</span>
                      <span>{fmt(parseNum(form.landDevCostPerSqm))}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-[#1A3A8F] pt-1 border-t border-gray-200">
                      <span>Subtotal</span>
                      <span>{fmt(results.landDevelopmentCost)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Building Construction Cost</p>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Residential Floor Area</span>
                      <span>{parseNum(form.residentialFloorArea).toLocaleString()} sqm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Construction Cost per sqm</span>
                      <span>{fmt(parseNum(form.constructionCostPerSqm))}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-[#1A3A8F] pt-1 border-t border-gray-200">
                      <span>Subtotal</span>
                      <span>{fmt(results.buildingConstructionCost)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-[#1A3A8F] rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-xs font-semibold">Socialized Housing Requirement (5%)</span>
                    <span className="text-white font-bold text-sm">{fmt(results.socializedHousingReq)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
