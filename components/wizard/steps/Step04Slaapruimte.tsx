'use client'

import { useStore } from '@/lib/store'
import { PolicyChoice, NumberInput } from '../shared/PolicyChoice'
import { getTotaalGroepen, getSlaapruimte } from '@/lib/calculations'

export function Step04Slaapruimte() {
  const state = useStore()
  const { slaapruimte, setSlaapruimte } = state
  const groepen = getTotaalGroepen(state)

  const aantalPerGroep = slaapruimte.aantalPolicy === 'standaard' ? 2 : slaapruimte.aantalPerGroep
  const totaalSlaapruimten = groepen * aantalPerGroep
  const m2PerRuimte = slaapruimte.m2Policy === 'standaard' ? 9 : slaapruimte.m2PerRuimte
  const stapelbedden = Math.floor(m2PerRuimte / 2)
  const slaapplekkenPerRuimte = stapelbedden * 2
  const slaapplekkenPerGroep = aantalPerGroep * slaapplekkenPerRuimte
  const voldoende = slaapplekkenPerGroep >= 16
  const totaalM2 = getSlaapruimte(state)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Ruimten – Slaapruimte(n)</h2>
        <p className="text-sm text-muted-foreground">Per groep moeten minimaal 16 slaapplekken beschikbaar zijn.</p>
      </div>

      <PolicyChoice
        label="Aantal slaapruimten per groep"
        optionA="Standaard (2 per groep)"
        optionB="Eigen beleid"
        value={slaapruimte.aantalPolicy === 'standaard' ? 'a' : 'b'}
        onChange={(v) => setSlaapruimte({ aantalPolicy: v === 'a' ? 'standaard' : 'eigen' })}
      >
        <NumberInput
          label="Slaapruimten per groep"
          value={slaapruimte.aantalPerGroep}
          onChange={(v) => setSlaapruimte({ aantalPerGroep: Math.max(1, Math.floor(v)) })}
          min={1}
          step={1}
          hint="Minimaal 1 slaapruimte per groep"
        />
      </PolicyChoice>

      <div className="text-sm text-muted-foreground">Totaal: {totaalSlaapruimten} slaapruimten ({groepen} groepen × {aantalPerGroep})</div>

      <PolicyChoice
        label="Oppervlakte per slaapruimte"
        optionA="Standaard (9 m²)"
        optionB="Eigen beleid (slider)"
        value={slaapruimte.m2Policy === 'standaard' ? 'a' : 'b'}
        onChange={(v) => setSlaapruimte({ m2Policy: v === 'a' ? 'standaard' : 'eigen', m2PerRuimte: v === 'a' ? 9 : 9 })}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={2} max={16} step={0.1}
              value={slaapruimte.m2PerRuimte}
              onChange={(e) => setSlaapruimte({ m2PerRuimte: parseFloat(e.target.value) })}
              className="flex-1 accent-primary"
            />
            <span className="text-sm font-bold w-16 tabular-nums">{slaapruimte.m2PerRuimte.toFixed(1)} m²</span>
          </div>
          <div className="text-xs text-muted-foreground flex justify-between"><span>2 m²</span><span>16 m²</span></div>
          <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
            <div className="flex justify-between"><span className="text-muted-foreground">Stapelbedden per slaapruimte</span><span className="font-medium">{stapelbedden}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Slaapplekken per slaapruimte</span><span className="font-medium">{slaapplekkenPerRuimte}</span></div>
          </div>
        </div>
      </PolicyChoice>

      {/* Validation indicator */}
      <div className={`rounded-xl p-4 text-sm ${voldoende ? 'bg-green-500/8 border border-green-500/25 text-green-700' : 'bg-destructive/8 border border-destructive/25 text-destructive'}`}>
        {voldoende
          ? `✓ Deze combinatie levert ${slaapplekkenPerGroep} van de 16 benodigde slaapplekken per groep op.`
          : `✗ Deze combinatie levert onvoldoende slaapplekken op (${slaapplekkenPerGroep}/16 per groep).`
        }
      </div>

      <div className="bg-primary/8 border border-primary/25 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-primary">Totale oppervlakte slaapruimte(n)</span>
          <span className="text-lg font-bold text-primary">{totaalM2.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²</span>
        </div>
        <p className="text-xs text-primary/70 mt-1">{totaalSlaapruimten} slaapruimten × {m2PerRuimte.toFixed(1)} m²</p>
      </div>
    </div>
  )
}
