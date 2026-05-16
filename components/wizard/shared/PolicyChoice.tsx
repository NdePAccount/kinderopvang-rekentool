'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface PolicyChoiceProps {
  label: string
  hint?: string
  optionA: string
  optionB: string
  value: 'a' | 'b'
  onChange: (v: 'a' | 'b') => void
  children?: React.ReactNode
  className?: string
}

export function PolicyChoice({ label, hint, optionA, optionB, value, onChange, children, className }: PolicyChoiceProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <Label className="text-sm font-semibold text-foreground">{label}</Label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange('a')}
          className={cn(
            'flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all text-left',
            value === 'a'
              ? 'border-primary bg-primary/8 text-primary'
              : 'border-border bg-card text-muted-foreground hover:border-border/80 hover:text-foreground'
          )}
        >
          <span className={cn(
            'inline-flex items-center gap-2',
          )}>
            <span className={cn(
              'w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all',
              value === 'a' ? 'border-primary bg-primary' : 'border-muted-foreground/40'
            )} />
            {optionA}
          </span>
        </button>
        <button
          type="button"
          onClick={() => onChange('b')}
          className={cn(
            'flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all text-left',
            value === 'b'
              ? 'border-primary bg-primary/8 text-primary'
              : 'border-border bg-card text-muted-foreground hover:border-border/80 hover:text-foreground'
          )}
        >
          <span className="inline-flex items-center gap-2">
            <span className={cn(
              'w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all',
              value === 'b' ? 'border-primary bg-primary' : 'border-muted-foreground/40'
            )} />
            {optionB}
          </span>
        </button>
      </div>
      {hint && <p className="text-xs text-muted-foreground italic">{hint}</p>}
      {value === 'b' && children && (
        <div className="mt-3 p-4 bg-muted/50 rounded-xl border border-border">
          {children}
        </div>
      )}
    </div>
  )
}

interface NumberInputProps {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
  hint?: string
}

export function NumberInput({ label, value, onChange, min, max, step = 1, unit, hint }: NumberInputProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm text-foreground">{label}</Label>
      <div className="flex items-center gap-3">
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          className="w-36 bg-background"
        />
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

interface YesNoProps {
  label: string
  value: boolean
  onChange: (v: boolean) => void
  hint?: string
}

export function YesNo({ label, value, onChange, hint }: YesNoProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-foreground">{label}</Label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={cn(
            'px-5 py-2.5 rounded-xl border-2 text-sm font-medium transition-all',
            value
              ? 'border-primary bg-primary/8 text-primary'
              : 'border-border bg-card text-muted-foreground hover:border-border/80 hover:text-foreground'
          )}
        >
          Ja
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={cn(
            'px-5 py-2.5 rounded-xl border-2 text-sm font-medium transition-all',
            !value
              ? 'border-primary bg-primary/8 text-primary'
              : 'border-border bg-card text-muted-foreground hover:border-border/80 hover:text-foreground'
          )}
        >
          Nee
        </button>
      </div>
      {hint && <p className="text-xs text-muted-foreground italic">{hint}</p>}
    </div>
  )
}
