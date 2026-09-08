import { Check } from "lucide-react";

const STEPS = ["Cart", "Shipping", "Payment", "Confirmation"];

type CheckoutStepperProps = {
  currentStep: number;
  // The Figma spec highlights the immediately-following step's label in
  // dark aubergine (rather than muted gray) only on some screens (seen on
  // the checkout/shipping page, pointing at "Payment") — not a universal
  // rule, so it's opt-in per caller rather than inferred automatically.
  emphasizeNext?: boolean;
};

export function CheckoutStepper({
  currentStep,
  emphasizeNext = false,
}: CheckoutStepperProps) {
  return (
    <div className="relative flex items-center justify-between max-w-2xl mx-auto mb-16">
      <div className="absolute left-4 right-4 top-4 h-px bg-aubergine/10" />
      <div
        className="absolute left-4 top-4 h-px bg-magenta-deep transition-all"
        style={{
          width: `calc(${(currentStep / (STEPS.length - 1)) * 100}% - ${
            (currentStep / (STEPS.length - 1)) * 32
          }px)`,
        }}
      />
      {STEPS.map((label, i) => {
        const done = i <= currentStep;
        const upNext = emphasizeNext && i === currentStep + 1;
        return (
          <div
            key={label}
            className="relative z-10 flex flex-col items-center gap-2"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold border-[1.6px] ${
                done
                  ? "bg-magenta-deep border-magenta-deep text-white"
                  : "bg-[#F7F8F7] border-aubergine/20 text-aubergine/30"
              }`}
            >
              {done ? <Check size={16} /> : i + 1}
            </div>
            <span
              className={`text-[10px] font-medium tracking-[0.5px] ${
                done
                  ? "text-magenta-deep"
                  : upNext
                    ? "text-aubergine"
                    : "text-[#6B7280]"
              }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
