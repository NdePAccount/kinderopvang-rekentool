'use client'

import { useStore } from '@/lib/store'
import { PolicyChoice, NumberInput } from '../shared/PolicyChoice'
import { getSlaapruimte } from '@/lib/calculations'
import type { SlaapruimteGroepState } from '@/lib/types'

const GROEP_LABELS: Record<string, string> = {
  g0_4: '0–4 jaar',
  g0_2: '0–2 jaar',
  g2_4: '2–4 jaar',
}

function SlaapruimteGroepBlock({
  groepKey,
  label,
  aantalGroepen,
  groep,
  onChange,
}: {
  groepKey: string
  label: string
  aantalGroepen: number
  groep: SlaapruimteGroepState
  onChange: (v: Partial<SlaapruimteGroepState>) => void
}) {
  const aantalPerGroep = groep.aantalPolicy === 'standaard' ? 2 : groep.aantalPerGroep
  const totaalRuimten = aantalGroepen * aantalPerGroep
  const m2PerRuimte = groep.m2Policy === 'standaard' ? 9 : groep.m2PerRuimte
  const stapelbedden = Math.floor(m2PerRuimte / 2)
  const slaapplekken = stapelbedden * 2
  const totaalM2 = totaalRuimten * m2PerRuimte

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="bg-muted/50 px-4 py-2.5 border-b border-border">
        <p className="text-sm font-semibold text-foreground">Groep {label}</p>
        <p className="text-xs text-muted-foreground">{aantalGroepen} {aantalGroepen === 1 ? 'groep' : 'groepen'}</p>
      </div>
      <div className="p-4 space-y-4">
        <PolicyChoice
          label="Aantal slaapruimten per groep"
          optionA="Standaard (2 per groep)"
          optionB="Eigen beleid"
          value={groep.aantalPolicy === 'standaard' ? 'a' : 'b'}
          onChange={(v) => onChange({ aantalPolicy: v === 'a' ? 'standaard' : 'eigen' })}
        >
          <NumberInput
            label="Slaapruimten per groep"
            value={groep.aantalPerGroep}
            onChange={(v) => onChange({ aantalPerGroep: Math.max(1, Math.floor(v)) })}
            min={1} step={1}
            hint="Minimaal 1 slaapruimte per groep"
          />
        </PolicyChoice>

        <div className="text-xs text-muted-foreground">
          Totaal: {totaalRuimten} slaapruimten ({aantalGroepen} groepen × {aantalPerGroep})
        </div>

        <PolicyChoice
          label="Oppervlakte per slaapruimte"
          optionA="Standaard (9 m²)"
          optionB="Eigen beleid (slider)"
          value={groep.m2Policy === 'standaard' ? 'a' : 'b'}
          onChange={(v) => onChange({ m2Policy: v === 'a' ? 'standaard' : 'eigen', m2PerRuimte: v === 'a' ? 9 : groep.m2PerRuimte })}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <input
                type="range" min={2} max={16} step={0.1}
                value={groep.m2PerRuimte}
                onChange={(e) => onChange({ m2PerRuimte: parseFloat(e.target.value) })}
                className="flex-1 accent-primary"
              />
              <span className="text-sm font-bold w-16 tabular-nums">{groep.m2PerRuimte.toFixed(1)} m²</span>
            </div>
            <div className="text-xs text-muted-foreground flex justify-between"><span>2 m²</span><span>16 m²</span></div>
            <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
              <div className="flex justify-between"><span className="text-muted-foreground">Stapelbedden per slaapruimte</span><span className="font-medium">{stapelbedden}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Slaapplekken per slaapruimte</span><span className="font-medium">{slaapplekken}</span></div>
            </div>
          </div>
        </PolicyChoice>

        <div className="bg-primary/8 border border-primary/25 rounded-lg px-3 py-2 flex justify-between text-sm">
          <span className="text-primary font-medium">Oppervlakte slaapruimte(n) groep {label}</span>
          <span className="font-bold text-primary tabular-nums">{totaalM2.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²</span>
        </div>
      </div>
    </div>
  )
}

export function Step04Slaapruimte() {
  const state = useStore()
  const { slaapruimte, setSlaapruimteGroep, groups } = state
  const totaalM2 = getSlaapruimte(state)

  const aanwezigeGroepen = [
    { key: 'g0_4' as const, aantalGroepen: groups.kdv.g0_4 },
    { key: 'g0_2' as const, aantalGroepen: groups.kdv.g0_2 },
    { key: 'g2_4' as const, aantalGroepen: groups.kdv.g2_4 },
  ].filter(({ aantalGroepen }) => aantalGroepen > 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Ruimten – Slaapruimte(n)</h2>
        <p className="text-sm text-muted-foreground">Stel per leeftijdsgroep het aantal slaapruimten en de oppervlakte in.</p>
      </div>

      <div className="space-y-4">
        {aanwezigeGroepen.map(({ key, aantalGroepen }) => (
          <SlaapruimteGroepBlock
            key={key}
            groepKey={key}
            label={GROEP_LABELS[key]}
            aantalGroepen={aantalGroepen}
            groep={slaapruimte[key]}
            onChange={(v) => setSlaapruimteGroep(key, v)}
          />
        ))}
      </div>

      <div className="bg-primary/8 border border-primary/25 rounded-xl p-4 flex justify-between items-center">
        <span className="text-sm font-medium text-primary">Totale oppervlakte slaapruimte(n)</span>
        <span className="text-lg font-bold text-primary tabular-nums">{totaalM2.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²</span>
      </div>
    </div>
  )
}
