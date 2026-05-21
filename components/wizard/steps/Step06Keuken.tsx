'use client'

import { useStore } from '@/lib/store'
import { PolicyChoice, NumberInput } from '../shared/PolicyChoice'
import { getKeuken, getTotaalGroepen } from '@/lib/calculations'

export function Step06Keuken() {
  const state = useStore()
  const { keuken, setKeuken, opvangvorm } = state
  const groepen = getTotaalGroepen(state)
  const calc = getKeuken(state)
  const isKdv = opvangvorm === 'KDV'

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Ruimten – Keuken</h2>
        <p className="text-sm text-muted-foreground">Bepaal de benodigde keukenruimte{isKdv ? " inclusief pantry's" : ''}.</p>
      </div>

      <section className="space-y-4 pb-5 border-b border-border">
        <h3 className="font-semibold text-foreground">Keuken</h3>
        <PolicyChoice
          label="Aantal keukens"
          optionA="Standaard (1)"
          optionB="Eigen beleid"
          value={keuken.aantalPolicy === 'standaard' ? 'a' : 'b'}
          onChange={(v) => setKeuken({ aantalPolicy: v === 'a' ? 'standaard' : 'eigen' })}
        >
          <NumberInput
            label="Aantal keukens"
            value={keuken.aantal}
            onChange={(v) => setKeuken({ aantal: Math.max(1, Math.floor(v)) })}
            min={1} step={1} hint="Minimaal 1"
          />
        </PolicyChoice>
        <PolicyChoice
          label="m² per keuken"
          optionA="Standaard (1,08 m²)"
          optionB="Eigen beleid"
          value={keuken.m2Policy === 'standaard' ? 'a' : 'b'}
          onChange={(v) => setKeuken({ m2Policy: v === 'a' ? 'standaard' : 'eigen' })}
          hint="Indien aparte ruimte: 4 m² / Indien geïntegreerd: 1,08 m²"
        >
          <NumberInput
            label="m² per keuken"
            value={keuken.m2PerKeuken}
            onChange={(v) => setKeuken({ m2PerKeuken: v })}
            min={1.08} step={0.1} unit="m²" hint="Minimaal 1,08 m²"
          />
        </PolicyChoice>
      </section>

      {isKdv && (
        <section className="space-y-4">
          <h3 className="font-semibold text-foreground">Pantry</h3>
          <PolicyChoice
            label="Aantal pantry's"
            optionA={`Standaard (${groepen} = 1 per groep)`}
            optionB="Eigen beleid"
            value={keuken.pantry.aantalPolicy === 'standaard' ? 'a' : 'b'}
            onChange={(v) => setKeuken({ pantry: { ...keuken.pantry, aantalPolicy: v === 'a' ? 'standaard' : 'eigen' } })}
          >
            <NumberInput
              label="Totaal aantal pantry's"
              value={keuken.pantry.aantal}
              onChange={(v) => setKeuken({ pantry: { ...keuken.pantry, aantal: Math.max(0, Math.floor(v)) } })}
              min={0} step={1} hint="Minimaal 0"
            />
          </PolicyChoice>
          <PolicyChoice
            label="m² per pantry"
            optionA="Standaard (1,1 m²)"
            optionB="Eigen beleid"
            value={keuken.pantry.m2Policy === 'standaard' ? 'a' : 'b'}
            onChange={(v) => setKeuken({ pantry: { ...keuken.pantry, m2Policy: v === 'a' ? 'standaard' : 'eigen' } })}
          >
            <NumberInput
              label="m² per pantry"
              value={keuken.pantry.m2PerPantry}
              onChange={(v) => setKeuken({ pantry: { ...keuken.pantry, m2PerPantry: v } })}
              min={1.1} step={0.1} unit="m²" hint="Minimaal 1,1 m²"
            />
          </PolicyChoice>
        </section>
      )}

      <div className="bg-primary/8 border border-primary/25 rounded-xl p-4 text-sm">
        {isKdv && <div className="flex justify-between text-muted-foreground mb-1"><span>Keuken</span><span>{calc.keuken.toFixed(2)} m²</span></div>}
        {isKdv && <div className="flex justify-between text-muted-foreground mb-2"><span>Pantry&apos;s</span><span>{calc.pantry.toFixed(2)} m²</span></div>}
        <div className="flex justify-between font-bold text-primary">
          <span>Totaal keuken</span><span>{calc.totaal.toFixed(2)} m²</span>
        </div>
      </div>
    </div>
  )
}
