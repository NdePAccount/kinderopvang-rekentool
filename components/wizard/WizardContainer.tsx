'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { getSteps, getNextStep, getPrevStep } from '@/lib/steps'
import { validateStep } from '@/lib/validation'
import { StepProgress } from './StepProgress'
import { ValidationError } from './shared/ValidationError'
import { Button } from '@/components/ui/button'
import { getFNO } from '@/lib/calculations'

import { Step00Welcome } from './steps/Step00Welcome'
import { Step01OpvangvormKiezen } from './steps/Step01OpvangvormKiezen'
import { Step02GroepenMaken } from './steps/Step02GroepenMaken'
import { Step03Speelruimte } from './steps/Step03Speelruimte'
import { Step04Slaapruimte } from './steps/Step04Slaapruimte'
import { Step05Sanitair } from './steps/Step05Sanitair'
import { Step06Keuken } from './steps/Step06Keuken'
import { Step07Kantoor } from './steps/Step07Kantoor'
import { Step08Overig } from './steps/Step08Overig'
import { Step09OndersteundeRuimten } from './steps/Step09OndersteundeRuimten'
import { Step10GedeeldeRuimten } from './steps/Step10GedeeldeRuimten'
import { Step11Kosten } from './steps/Step11Kosten'
import { Step12Huursom } from './steps/Step12Huursom'
import { Step13Resultaat } from './steps/Step13Resultaat'

const STEP_COMPONENTS: Record<number, React.ComponentType> = {
  0: Step00Welcome,
  1: Step01OpvangvormKiezen,
  2: Step02GroepenMaken,
  3: Step03Speelruimte,
  4: Step04Slaapruimte,
  5: Step05Sanitair,
  6: Step06Keuken,
  7: Step07Kantoor,
  8: Step08Overig,
  9: Step09OndersteundeRuimten,
  10: Step10GedeeldeRuimten,
  11: Step11Kosten,
  12: Step12Huursom,
  13: Step13Resultaat,
}

export function WizardContainer() {
  const state = useStore()
  const [error, setError] = useState<string | null>(null)
  const steps = getSteps(state.opvangvorm)
  const isLast = state.step === 13
  const isFirst = state.step === 0
  const fno = state.step >= 3 ? getFNO(state) : null
  const currentStepIndex = steps.findIndex(s => s.index === state.step)
  const currentStepLabel = steps[currentStepIndex]?.label ?? ''

  const StepComponent = STEP_COMPONENTS[state.step]

  function handleNext() {
    const err = validateStep(state.step, state)
    if (err) { setError(err); return }
    setError(null)
    if (!isLast) state.setStep(getNextStep(state.step, state.opvangvorm))
  }

  function handleBack() {
    setError(null)
    state.setStep(getPrevStep(state.step, state.opvangvorm))
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 bg-[var(--sidebar)] flex flex-col fixed left-0 top-0 h-full z-20 overflow-y-auto">
        {/* Logo area */}
        <div className="px-6 pt-8 pb-6 border-b border-white/10">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Rekentool</p>
          <h1 className="text-lg font-bold text-white leading-tight">Kinderopvang<br />Huisvesting</h1>
          {state.opvangvorm && (
            <span className="mt-3 inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30">
              {state.opvangvorm}
            </span>
          )}
        </div>

        {/* Step navigation */}
        <div className="flex-1 px-3 py-4 overflow-y-auto">
          <StepProgress
            steps={steps}
            currentStep={state.step}
            onStepClick={(s) => { setError(null); state.setStep(s) }}
          />
        </div>

        {/* Running FNO total */}
        {fno !== null && fno > 0 && (
          <div className="px-6 py-5 border-t border-white/10">
            <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Totaal FNO</p>
            <p className="text-2xl font-bold text-white tabular-nums">
              {fno.toLocaleString('nl-NL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              <span className="text-sm font-normal text-white/50 ml-1">m²</span>
            </p>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="ml-72 flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Stap {currentStepIndex + 1} van {steps.length}
            </p>
            <p className="text-sm font-semibold text-foreground">{currentStepLabel}</p>
          </div>
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="w-32 h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${((currentStepIndex) / (steps.length - 1)) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">
              {Math.round((currentStepIndex / (steps.length - 1)) * 100)}%
            </span>
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 px-8 py-10 max-w-2xl w-full mx-auto">
          <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
            {StepComponent && <StepComponent />}

            {error && (
              <div className="mt-6">
                <ValidationError message={error} />
              </div>
            )}

            {/* Navigation */}
            {!isFirst && (
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button variant="outline" onClick={handleBack} className="px-6">
                  ← Vorige
                </Button>
                {!isLast && (
                  <Button onClick={handleNext} className="px-6">
                    Volgende →
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
