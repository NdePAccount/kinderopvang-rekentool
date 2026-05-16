'use client'

import { useStore } from '@/lib/store'
import { PolicyChoice, NumberInput, YesNo } from '../shared/PolicyChoice'
import { getOverig, getTotaalGroepen } from '@/lib/calculations'

export function Step08Overig() {
  const state = useStore()
  const { overig, setOverig, opvangvorm } = state
  const groepen = getTotaalGroepen(state)
  const calc = getOverig(state)
  const isKdv = opvangvorm === 'KDV'

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Ruimten – Overige ruimten</h2>
        <p className="text-sm text-muted-foreground">Opslagruimten, schoonmaak{isKdv ? ' en buggyruimte' : ''}.</p>
      </div>

      {isKdv && (
        <section className="space-y-4 pb-5 border-b border-border">
          <h3 className="font-semibold text-foreground">Buggyruimte</h3>
          <PolicyChoice
            label="Aantal buggy's en kinderwagens"
            optionA={`Standaard (${groepen * 4} = ${groepen} groepen × 4)`}
            optionB="Eigen beleid"
            value={overig.buggy.aantalPolicy === 'standaard' ? 'a' : 'b'}
            onChange={(v) => setOverig({ buggy: { ...overig.buggy, aantalPolicy: v === 'a' ? 'standaard' : 'eigen', aantal: v === 'a' ? groepen * 4 : overig.buggy.aantal } })}
            hint="Richtlijn: 4 per groep"
          >
            <NumberInput
              label="Totaal aantal buggy's/kinderwagens"
              value={overig.buggy.aantal}
              onChange={(v) => setOverig({ buggy: { ...overig.buggy, aantal: Math.max(groepen * 4, Math.floor(v)) } })}
              min={groepen * 4} step={1}
              hint={`Minimaal ${groepen * 4} (${groepen} groepen × 4)`}
            />
          </PolicyChoice>
          <PolicyChoice
            label="m² per buggy/kinderwagen"
            optionA="Standaard (0,8 m²)"
            optionB="Eigen beleid"
            value={overig.buggy.m2Policy === 'standaard' ? 'a' : 'b'}
            onChange={(v) => setOverig({ buggy: { ...overig.buggy, m2Policy: v === 'a' ? 'standaard' : 'eigen' } })}
          >
            <NumberInput
              label="m² per buggy"
              value={overig.buggy.m2PerBuggy}
              onChange={(v) => setOverig({ buggy: { ...overig.buggy, m2PerBuggy: v } })}
              min={0.8} step={0.1} unit="m²" hint="Minimaal 0,8 m²"
            />
          </PolicyChoice>
        </section>
      )}

      <section className="space-y-4 pb-5 border-b border-border">
        <h3 className="font-semibold text-foreground">Algemene bergruimte</h3>
        <p className="text-sm text-muted-foreground">{groepen} bergruimte{groepen !== 1 ? 'n' : ''} (1 per groep)</p>
        <PolicyChoice
          label="m² per bergruimte"
          optionA="Standaard (4 m²)"
          optionB="Eigen beleid"
          value={overig.berg.m2Policy === 'standaard' ? 'a' : 'b'}
          onChange={(v) => setOverig({ berg: { ...overig.berg, m2Policy: v === 'a' ? 'standaard' : 'eigen' } })}
        >
          <NumberInput
            label="m² per bergruimte"
            value={overig.berg.m2PerRuimte}
            onChange={(v) => setOverig({ berg: { ...overig.berg, m2PerRuimte: v } })}
            min={4} step={0.5} unit="m²" hint="Minimaal 4 m²"
          />
        </PolicyChoice>
      </section>

      <section className="space-y-4 pb-5 border-b border-border">
        <h3 className="font-semibold text-foreground">Aanvullende opslagruimte</h3>
        <YesNo
          label="Aanvullende opslagruimte nodig?"
          value={overig.opslag.aanwezig}
          onChange={(v) => setOverig({ opslag: { ...overig.opslag, aanwezig: v } })}
        />
        {overig.opslag.aanwezig && (
          <NumberInput
            label="Totaal m² aanvullende opslagruimte"
            value={overig.opslag.m2}
            onChange={(v) => setOverig({ opslag: { ...overig.opslag, m2: v } })}
            min={0.1} step={1} unit="m²" hint="Groter dan 0 m²"
          />
        )}
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold text-foreground">Schoonmaakruimte(n)</h3>
        <NumberInput
          label="Aantal bouwlagen"
          value={overig.schoonmaak.bouwlagen}
          onChange={(v) => setOverig({ schoonmaak: { ...overig.schoonmaak, bouwlagen: Math.max(1, Math.floor(v)) } })}
          min={1} step={1}
          hint="Elke verdieping krijgt een schoonmaakruimte"
        />
        <PolicyChoice
          label="m² per schoonmaakruimte"
          optionA="Standaard (2 m²)"
          optionB="Eigen beleid"
          value={overig.schoonmaak.m2Policy === 'standaard' ? 'a' : 'b'}
          onChange={(v) => setOverig({ schoonmaak: { ...overig.schoonmaak, m2Policy: v === 'a' ? 'standaard' : 'eigen' } })}
        >
          <NumberInput
            label="m² per schoonmaakruimte"
            value={overig.schoonmaak.m2PerRuimte}
            onChange={(v) => setOverig({ schoonmaak: { ...overig.schoonmaak, m2PerRuimte: v } })}
            min={2} step={0.5} unit="m²" hint="Minimaal 2 m²"
          />
        </PolicyChoice>
      </section>

      <div className="bg-primary/8 border border-primary/25 rounded-xl p-4 text-sm">
        <div className="space-y-1 text-muted-foreground">
          {isKdv && <div className="flex justify-between"><span>Buggyruimte</span><span>{calc.buggy.toFixed(2)} m²</span></div>}
          <div className="flex justify-between"><span>Algemene bergruimte</span><span>{calc.berg.toFixed(2)} m²</span></div>
          {overig.opslag.aanwezig && <div className="flex justify-between"><span>Aanvullende opslagruimte</span><span>{calc.opslag.toFixed(2)} m²</span></div>}
          <div className="flex justify-between"><span>Schoonmaakruimte(n)</span><span>{calc.schoonmaak.toFixed(2)} m²</span></div>
          <div className="flex justify-between font-bold text-primary border-t border-primary/25 pt-2 mt-2">
            <span>Totaal overige ruimten</span><span>{calc.totaal.toFixed(2)} m²</span>
          </div>
        </div>
      </div>
    </div>
  )
}
