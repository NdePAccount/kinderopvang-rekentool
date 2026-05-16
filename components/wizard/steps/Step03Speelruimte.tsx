'use client'

import { useStore } from '@/lib/store'
import { PolicyChoice, NumberInput } from '../shared/PolicyChoice'
import { getTotaalKindplaatsen, getSpeelruimte } from '@/lib/calculations'

export function Step03Speelruimte() {
  const state = useStore()
  const { speelruimte, setSpeelruimte } = state
  const kindplaatsen = getTotaalKindplaatsen(state)
  const totaalM2 = getSpeelruimte(state)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Ruimten – Speelruimte</h2>
        <p className="text-sm text-muted-foreground">Bepaal de benodigde speelruimte op basis van {kindplaatsen} kindplaatsen.</p>
      </div>

      <PolicyChoice
        label="Hoeveel m² speelruimte per kindplaats?"
        optionA="Wettelijk minimum"
        optionB="Eigen beleid"
        value={speelruimte.policy === 'wettelijk' ? 'a' : 'b'}
        onChange={(v) => setSpeelruimte({ policy: v === 'a' ? 'wettelijk' : 'eigen' })}
        hint={speelruimte.policy === 'wettelijk' ? 'Wettelijke norm: 3,5 m² per kindplaats' : undefined}
      >
        <NumberInput
          label="m² per kindplaats"
          value={speelruimte.m2PerKindplaats}
          onChange={(v) => setSpeelruimte({ m2PerKindplaats: v })}
          min={3.5}
          step={0.1}
          unit="m²"
          hint="Minimaal 3,5 m² per kindplaats (wettelijk vereist)"
        />
      </PolicyChoice>

      <div className="bg-primary/8 border border-primary/25 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-primary">Totale oppervlakte speelruimte</span>
          <span className="text-lg font-bold text-primary">{totaalM2.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²</span>
        </div>
        <p className="text-xs text-primary/70 mt-1">{kindplaatsen} kindplaatsen × {speelruimte.policy === 'wettelijk' ? '3,5' : speelruimte.m2PerKindplaats.toLocaleString('nl-NL')} m²</p>
      </div>
    </div>
  )
}
