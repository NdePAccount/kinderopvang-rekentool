'use client'

import { cn } from '@/lib/utils'

interface SummaryRow {
  label: string
  value: number
  indent?: boolean
  bold?: boolean
}

interface VisualSummaryProps {
  title?: string
  rows: SummaryRow[]
  className?: string
}

export function VisualSummary({ title = 'Overzicht m²', rows, className }: VisualSummaryProps) {
  return (
    <div className={cn('bg-muted/60 border border-border rounded-xl p-4 text-sm', className)}>
      <p className="font-semibold text-foreground mb-3">{title}</p>
      <div className="space-y-1.5">
        {rows.map((row, i) => (
          <div key={i} className={cn(
            'flex justify-between',
            row.indent && 'pl-3',
            row.bold && 'font-semibold border-t border-border pt-1.5 mt-1.5'
          )}>
            <span className="text-muted-foreground">{row.label}</span>
            <span className={cn('tabular-nums', row.bold ? 'text-foreground' : 'text-muted-foreground')}>
              {row.value.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SummaryValue({ label, value, unit = 'm²' }: { label: string; value: number; unit?: string }) {
  return (
    <div className="flex justify-between text-sm py-0.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">
        {value.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {unit}
      </span>
    </div>
  )
}
