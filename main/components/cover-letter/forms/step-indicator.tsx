import { Check } from "lucide-react" // Import the Check component

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="ml-10 md:ml-20 flex items-center justify-between">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep

        return (
          <div key={stepNumber} className="flex flex-1 items-center">
            <div className="relative flex items-center justify-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                  isActive
                    ? "border-white bg-white text-black"
                    : isCompleted
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-300 bg-white text-gray-500"
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : <span className="text-sm">{stepNumber}</span>}
              </div>
              <span
                className={`absolute -bottom-6 whitespace-nowrap text-xs ${
                  isActive ? "font-medium text-gray-200" : "text-white"
                }`}
              >
                {stepNumber === 1
                  ? "Personal Info"
                  : stepNumber === 2
                    ? "Job Details"
                    : stepNumber === 3
                      ? "Preferences"
                      : "Template"}
              </span>
            </div>
            {stepNumber < totalSteps && (
              <div className={`h-px flex-1 ${stepNumber < currentStep ? "bg-gray-400" : "bg-gray-300"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
