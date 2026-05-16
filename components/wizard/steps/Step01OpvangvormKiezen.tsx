'use client'

import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { Opvangvorm } from '@/lib/types'

const options: { value: Opvangvorm; label: string; sub: string; desc: string }[] = [
  {
    value: 'KDV',
    label: 'KDV',
    sub: 'Kinderdagverblijf',
    desc: 'Voor kinderen van 0 tot 4 jaar. Inclusief slaapruimten en volledige dagopvang.',
  },
  {
    value: 'BSO',
    label: 'BSO',
    sub: 'Buitenschoolse Opvang',
    desc: 'Voor kinderen van 4 tot 12 jaar. Vóór en/of na schooltijd, met optie voor gedeelde ruimten.',
  },
]

export function Step01OpvangvormKiezen() {
  const { opvangvorm, setOpvangvorm } = useStore()

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Stap 1</p>
        <h2 className="text-xl font-bold text-foreground mb-1">Opvangvorm kiezen</h2>
        <p className="text-sm text-muted-foreground">Selecteer het type kinderopvang dat u wilt doorrekenen.</p>
      </div>

      <div className="grid gap-3">
        {options.map((opt) => {
          const isSelected = opvangvorm === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setOpvangvorm(opt.value)}
              className={cn(
                'w-full text-left p-5 rounded-xl border-2 transition-all',
                isSelected
                  ? 'border-primary bg-primary/8'
                  : 'border-border bg-card hover:border-border/60'
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all',
                  isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                )} />
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className={cn('text-lg font-bold', isSelected ? 'text-primary' : 'text-foreground')}>{opt.label}</span>
                    <span className="text-sm text-muted-foreground font-medium">{opt.sub}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{opt.desc}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
