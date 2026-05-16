'use client'

import { cn } from '@/lib/utils'
import type { StepDef } from '@/lib/steps'

interface StepProgressProps {
  steps: StepDef[]
  currentStep: number
  onStepClick: (index: number) => void
}

export function StepProgress({ steps, currentStep, onStepClick }: StepProgressProps) {
  return (
    <nav className="flex flex-col gap-0.5">
      {steps.map((step) => {
        const isDone = step.index < currentStep
        const isActive = step.index === currentStep
        const isClickable = step.index < currentStep

        return (
          <button
            key={step.index}
            onClick={() => isClickable && onStepClick(step.index)}
            disabled={!isClickable && !isActive}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all w-full',
              isActive && 'bg-white/10 text-white',
              isDone && !isActive && 'text-white/60 hover:bg-white/5 hover:text-white/80 cursor-pointer',
              !isDone && !isActive && 'text-white/30 cursor-default',
            )}
          >
            {/* Step circle */}
            <span className={cn(
              'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all',
              isActive && 'bg-[var(--primary)] text-white',
              isDone && 'bg-white/20 text-white',
              !isDone && !isActive && 'bg-white/10 text-white/30',
            )}>
              {isDone ? '✓' : steps.indexOf(step) + 1}
            </span>

            {/* Label */}
            <span className={cn('text-sm font-medium leading-tight', isActive && 'text-white')}>
              {step.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
