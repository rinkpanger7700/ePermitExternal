import { Check } from "lucide-react";

// ── Wizard Stepper (4 steps, used in new-application flow) ──

export interface WizardStep {
  label: string;
  step: number;
}

interface StepperProps {
  steps: WizardStep[];
  currentStep: number; // 1-based
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-start w-full">
      {steps.map((s, i) => {
        const done = currentStep > s.step;
        const active = currentStep === s.step;
        const isLast = i === steps.length - 1;

        return (
          <div key={s.step} className="flex flex-col items-center flex-1 relative">
            {/* Connector line */}
            {!isLast && (
              <div className={`absolute top-[18px] left-[50%] w-full h-0.5 ${done ? "bg-green-400" : "bg-gray-200"}`} />
            )}
            
            {/* Circle */}
            <div
              className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 flex-shrink-0 transition-all ${
                done
                  ? "bg-green-500 border-green-500 text-white"
                  : active
                  ? "bg-[#1A3A8F] border-[#1A3A8F] text-white"
                  : "bg-white border-gray-300 text-gray-400"
              }`}
            >
              {done ? <Check className="w-5 h-5" strokeWidth={2.5} /> : s.step}
            </div>

            {/* Label */}
            <span
              className={`mt-1.5 text-xs font-semibold text-center leading-tight px-2 ${
                done ? "text-green-600" : active ? "text-[#1A3A8F]" : "text-gray-400"
              }`}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Tracking Stepper (5 stages used in application detail) ──

export interface TrackingStep {
  label: string;
  status: "completed" | "active" | "pending";
  date?: string;
  sublabel?: string;
}

interface TrackingStepperProps {
  steps: TrackingStep[];
}

export function TrackingStepper({ steps }: TrackingStepperProps) {
  return (
    <div className="flex items-start w-full">
      {steps.map((s, i) => {
        const done = s.status === "completed";
        const active = s.status === "active";
        const isLast = i === steps.length - 1;

        return (
          <div key={s.label} className="flex flex-col items-center flex-1 relative">
            {/* Connector */}
            {!isLast && (
              <div className={`absolute top-[20px] left-[50%] w-full h-0.5 ${done ? "bg-green-400" : "bg-gray-200"}`} />
            )}

            {/* Step node */}
            <div
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 flex-shrink-0 ${
                done
                  ? "bg-green-500 border-green-500 text-white"
                  : active
                  ? "bg-[#1A3A8F] border-[#1A3A8F] text-white"
                  : "bg-white border-gray-300 text-gray-400"
              }`}
            >
              {done ? <Check className="w-5 h-5" strokeWidth={2.5} /> : i + 1}
            </div>

            {/* Label and sublabel */}
            <div className="text-center mt-2 px-2">
              <p className={`text-xs font-semibold ${done ? "text-green-600" : active ? "text-[#1A3A8F]" : "text-gray-400"}`}>
                {s.label}
              </p>
              <p className={`text-[11px] mt-0.5 ${done ? "text-gray-500" : active ? "text-gray-600 font-medium" : "text-gray-400"}`}>
                {s.sublabel ?? (done ? s.date ?? "Done" : active ? "In Progress" : "Pending")}
              </p>
              {s.date && done && (
                <p className="text-[10px] text-gray-400 mt-0.5">{s.date}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
