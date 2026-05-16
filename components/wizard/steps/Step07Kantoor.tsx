'use client'

import { useStore } from '@/lib/store'
import { PolicyChoice, NumberInput, YesNo } from '../shared/PolicyChoice'
import { getKantoor } from '@/lib/calculations'

export function Step07Kantoor() {
  const state = useStore()
  const { kantoor, setKantoor } = state
  const calc = getKantoor(state)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Ruimten – Kantoorruimte</h2>
        <p className="text-sm text-muted-foreground">Minimaal één van de drie ruimtesoorten is verplicht.</p>
      </div>

      {/* Pauze-/teamruimte */}
      <section className="space-y-4 pb-5 border-b border-border">
        <YesNo
          label="Pauze- of teamruimte aanwezig?"
          value={kantoor.pauzeTeam.aanwezig}
          onChange={(v) => setKantoor({ pauzeTeam: { ...kantoor.pauzeTeam, aanwezig: v } })}
        />
        {kantoor.pauzeTeam.aanwezig && (
          <PolicyChoice
            label="m² pauze-/teamruimte"
            optionA="Standaard (9 m²)"
            optionB="Eigen beleid"
            value={kantoor.pauzeTeam.policy === 'standaard' ? 'a' : 'b'}
            onChange={(v) => setKantoor({ pauzeTeam: { ...kantoor.pauzeTeam, policy: v === 'a' ? 'standaard' : 'eigen' } })}
          >
            <NumberInput
              label="m²"
              value={kantoor.pauzeTeam.m2}
              onChange={(v) => setKantoor({ pauzeTeam: { ...kantoor.pauzeTeam, m2: Math.max(9, Math.floor(v)) } })}
              min={9} step={1} unit="m²" hint="Minimaal 9 m²"
            />
          </PolicyChoice>
        )}
      </section>

      {/* Werkruimte */}
      <section className="space-y-4 pb-5 border-b border-border">
        <YesNo
          label="Werkruimte aanwezig?"
          value={kantoor.werk.aanwezig}
          onChange={(v) => setKantoor({ werk: { ...kantoor.werk, aanwezig: v } })}
        />
        {kantoor.werk.aanwezig && (
          <PolicyChoice
            label="m² werkruimte"
            optionA="Standaard (9 m²)"
            optionB="Eigen beleid"
            value={kantoor.werk.policy === 'standaard' ? 'a' : 'b'}
            onChange={(v) => setKantoor({ werk: { ...kantoor.werk, policy: v === 'a' ? 'standaard' : 'eigen' } })}
            hint="Houd eventueel rekening met kastruimte"
          >
            <NumberInput
              label="m²"
              value={kantoor.werk.m2}
              onChange={(v) => setKantoor({ werk: { ...kantoor.werk, m2: Math.max(9, Math.floor(v)) } })}
              min={9} step={1} unit="m²" hint="Minimaal 9 m²"
            />
          </PolicyChoice>
        )}
      </section>

      {/* Spreekruimte */}
      <section className="space-y-4">
        <YesNo
          label="Spreekruimte aanwezig?"
          value={kantoor.spreek.aanwezig}
          onChange={(v) => setKantoor({ spreek: { ...kantoor.spreek, aanwezig: v } })}
        />
        {kantoor.spreek.aanwezig && (
          <div className="space-y-4 pl-3 border-l-2 border-primary/25">
            <YesNo
              label="Maximaal 4 personen tegelijk?"
              value={kantoor.spreek.maxVierpersonen}
              onChange={(v) => setKantoor({ spreek: { ...kantoor.spreek, maxVierpersonen: v } })}
            />
            {!kantoor.spreek.maxVierpersonen && (
              <NumberInput
                label="Hoeveel extra personen?"
                value={kantoor.spreek.extraPersonen}
                onChange={(v) => setKantoor({ spreek: { ...kantoor.spreek, extraPersonen: Math.max(1, Math.floor(v)) } })}
                min={1} step={1}
                hint="Elke extra persoon = 1 m² extra"
              />
            )}
            <PolicyChoice
              label="m² spreekruimte (basis)"
              optionA="Standaard (12 m²)"
              optionB="Eigen beleid"
              value={kantoor.spreek.policy === 'standaard' ? 'a' : 'b'}
              onChange={(v) => setKantoor({ spreek: { ...kantoor.spreek, policy: v === 'a' ? 'standaard' : 'eigen' } })}
            >
              <NumberInput
                label="m² (basis)"
                value={kantoor.spreek.m2}
                onChange={(v) => setKantoor({ spreek: { ...kantoor.spreek, m2: Math.max(12, Math.floor(v)) } })}
                min={12} step={1} unit="m²" hint="Minimaal 12 m²"
              />
            </PolicyChoice>
            {!kantoor.spreek.maxVierpersonen && (
              <p className="text-xs text-muted-foreground">Totale spreekruimte: {calc.spreek.toFixed(0)} m² (basis + {kantoor.spreek.extraPersonen} extra m²)</p>
            )}
          </div>
        )}
      </section>

      <div className="bg-primary/8 border border-primary/25 rounded-xl p-4 text-sm">
        <div className="space-y-1 text-muted-foreground">
          {kantoor.pauzeTeam.aanwezig && <div className="flex justify-between"><span>Pauze-/teamruimte</span><span>{calc.pauzeTeam.toFixed(2)} m²</span></div>}
          {kantoor.werk.aanwezig && <div className="flex justify-between"><span>Werkruimte</span><span>{calc.werk.toFixed(2)} m²</span></div>}
          {kantoor.spreek.aanwezig && <div className="flex justify-between"><span>Spreekruimte</span><span>{calc.spreek.toFixed(2)} m²</span></div>}
          <div className="flex justify-between font-bold text-primary border-t border-primary/25 pt-2 mt-2">
            <span>Totaal kantoorruimte</span><span>{calc.totaal.toFixed(2)} m²</span>
          </div>
        </div>
      </div>
    </div>
  )
}
