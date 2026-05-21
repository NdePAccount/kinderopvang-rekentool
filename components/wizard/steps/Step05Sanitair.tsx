'use client'

import { useStore } from '@/lib/store'
import { PolicyChoice, NumberInput } from '../shared/PolicyChoice'
import { getSanitair, getTotaalGroepen, getTotaalKindplaatsen } from '@/lib/calculations'

export function Step05Sanitair() {
  const state = useStore()
  const { sanitair, setSanitair, opvangvorm } = state
  const groepen = getTotaalGroepen(state)
  const kindplaatsen = getTotaalKindplaatsen(state)
  const calc = getSanitair(state)

  const isKdv = opvangvorm === 'KDV'
  const stdKindtoiletten = isKdv ? groepen * 2 : Math.ceil(kindplaatsen / 15)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Ruimten – Sanitair</h2>
        <p className="text-sm text-muted-foreground">Bepaal de oppervlakte van alle sanitaire ruimten.</p>
      </div>

      {/* Toiletruimten */}
      <section className="space-y-5 pb-5 border-b border-border">
        <h3 className="font-semibold text-foreground">Toiletruimte(n)</h3>

        <NumberInput
          label="Aantal personeelstoiletten"
          value={sanitair.personeelstoiletten}
          onChange={(v) => setSanitair({ personeelstoiletten: Math.max(2, Math.floor(v)) })}
          min={2} step={1}
          hint="Minimaal 2 — richtlijn: 1 per 4 medewerkers"
        />

        <NumberInput
          label="Aantal MIVA toiletten"
          value={sanitair.miva}
          onChange={(v) => setSanitair({ miva: Math.max(1, Math.floor(v)) })}
          min={1} step={1}
          hint="Minimaal 1 MIVA toilet"
        />

        <PolicyChoice
          label="Aantal kindtoiletten"
          optionA={isKdv ? `Standaard (${groepen} groepen × 2 = ${stdKindtoiletten})` : `Standaard (${kindplaatsen} kindplaatsen / 15 = ${stdKindtoiletten})`}
          optionB="Eigen beleid"
          value={sanitair.kindtoilet.aantalPolicy === 'standaard' ? 'a' : 'b'}
          onChange={(v) => setSanitair({ kindtoilet: { ...sanitair.kindtoilet, aantalPolicy: v === 'a' ? 'standaard' : 'eigen' } })}
        >
          {isKdv ? (
            <NumberInput
              label="Kindtoiletten per groep"
              value={sanitair.kindtoilet.aantalPerGroep}
              onChange={(v) => setSanitair({ kindtoilet: { ...sanitair.kindtoilet, aantalPerGroep: Math.max(2, Math.floor(v)) } })}
              min={2} step={1} hint="Minimaal 2 per groep"
            />
          ) : (
            <NumberInput
              label="Totaal aantal kindtoiletten"
              value={sanitair.kindtoilet.aantalTotaal}
              onChange={(v) => setSanitair({ kindtoilet: { ...sanitair.kindtoilet, aantalTotaal: Math.max(1, Math.floor(v)) } })}
              min={1} step={1} hint="Minimaal 1"
            />
          )}
        </PolicyChoice>

        <PolicyChoice
          label="m² per kindtoilet"
          optionA="Standaard (1,2 m²)"
          optionB="Eigen beleid"
          value={sanitair.kindtoilet.m2Policy === 'standaard' ? 'a' : 'b'}
          onChange={(v) => setSanitair({ kindtoilet: { ...sanitair.kindtoilet, m2Policy: v === 'a' ? 'standaard' : 'eigen' } })}
        >
          <NumberInput
            label="m² per kindtoilet"
            value={sanitair.kindtoilet.m2PerToilet}
            onChange={(v) => setSanitair({ kindtoilet: { ...sanitair.kindtoilet, m2PerToilet: v } })}
            min={1.2} step={0.1} unit="m²" hint="Minimaal 1,2 m²"
          />
        </PolicyChoice>

        <div className="bg-muted/50 rounded-lg p-3 text-xs space-y-1 text-muted-foreground">
          <div className="flex justify-between"><span>Personeelstoiletten</span><span>{calc.personeel.toFixed(2)} m²</span></div>
          <div className="flex justify-between"><span>MIVA toiletten</span><span>{calc.miva.toFixed(2)} m²</span></div>
          <div className="flex justify-between"><span>Kindtoiletten</span><span>{calc.kind.toFixed(2)} m²</span></div>
          <div className="flex justify-between font-semibold border-t border-border pt-1 mt-1"><span>Totaal toiletruimten</span><span>{calc.toiletTotaal.toFixed(2)} m²</span></div>
        </div>
      </section>

      {/* Verschoonruimte */}
      <section className="space-y-4 pb-5 border-b border-border">
        <h3 className="font-semibold text-foreground">Verschoonruimte</h3>
        {!isKdv && (
          <p className="text-xs text-muted-foreground italic">Binnen de tool wordt aanbevolen om rekening te houden met ruimte voor een aankleedtafel, zodat incidenteel verschonen of verzorging van kinderen op een veilige en hygiënische manier mogelijk blijft.</p>
        )}
        <PolicyChoice
          label={isKdv ? 'm² verschoonruimte per groep' : 'Oppervlakte verschoonruimte'}
          optionA={isKdv ? 'Standaard (3 m² per groep)' : 'Standaard (3 m²)'}
          optionB="Eigen beleid"
          value={sanitair.verschoonruimte.policy === 'standaard' ? 'a' : 'b'}
          onChange={(v) => setSanitair({ verschoonruimte: { ...sanitair.verschoonruimte, policy: v === 'a' ? 'standaard' : 'eigen' } })}
          hint="Richtlijn: enkele aankleedtafel ca. 3 m², dubbele ca. 4 m²"
        >
          {isKdv ? (
            <NumberInput
              label="m² per groep"
              value={sanitair.verschoonruimte.m2PerGroep}
              onChange={(v) => setSanitair({ verschoonruimte: { ...sanitair.verschoonruimte, m2PerGroep: v } })}
              min={3} step={0.5} unit="m²"
            />
          ) : (
            <NumberInput
              label="Oppervlakte verschoonruimte"
              value={sanitair.verschoonruimte.m2Fixed}
              onChange={(v) => setSanitair({ verschoonruimte: { ...sanitair.verschoonruimte, m2Fixed: Math.max(0, v) } })}
              min={0} step={0.5} unit="m²" hint="Minimaal 0 m²"
            />
          )}
        </PolicyChoice>
      </section>

      {/* Was- en droogruimte */}
      <section className="space-y-4">
        <h3 className="font-semibold text-foreground">Was- en droogruimte</h3>
        {!isKdv && (
          <p className="text-xs text-muted-foreground italic">Binnen de tool wordt aanbevolen om ruimte te reserveren voor wassen en drogen van textiel en schoonmaakmaterialen conform hygiëne-uitgangspunten voor kinderopvang.</p>
        )}

        {isKdv && (
          <PolicyChoice
            label="Aantal was- en droogruimten"
            optionA="Standaard (1)"
            optionB="Eigen beleid"
            value={sanitair.wasdroog.aantalPolicy === 'standaard' ? 'a' : 'b'}
            onChange={(v) => setSanitair({ wasdroog: { ...sanitair.wasdroog, aantalPolicy: v === 'a' ? 'standaard' : 'eigen' } })}
          >
            <NumberInput
              label="Aantal ruimten"
              value={sanitair.wasdroog.aantal}
              onChange={(v) => setSanitair({ wasdroog: { ...sanitair.wasdroog, aantal: Math.max(1, Math.floor(v)) } })}
              min={1} step={1} hint="Minimaal 1"
            />
          </PolicyChoice>
        )}

        <PolicyChoice
          label="m² per was- en droogruimte"
          optionA="Standaard (4 m²)"
          optionB="Eigen beleid"
          value={sanitair.wasdroog.m2Policy === 'standaard' ? 'a' : 'b'}
          onChange={(v) => setSanitair({ wasdroog: { ...sanitair.wasdroog, m2Policy: v === 'a' ? 'standaard' : 'eigen' } })}
        >
          <NumberInput
            label="m² per ruimte"
            value={sanitair.wasdroog.m2PerRuimte}
            onChange={(v) => setSanitair({ wasdroog: { ...sanitair.wasdroog, m2PerRuimte: Math.max(0, v) } })}
            min={0} step={0.5} unit="m²" hint="Minimaal 0 m²"
          />
        </PolicyChoice>
      </section>

      {/* Total summary */}
      <div className="bg-primary/8 border border-primary/25 rounded-xl p-4">
        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex justify-between"><span>Toiletruimten</span><span>{calc.toiletTotaal.toFixed(2)} m²</span></div>
          <div className="flex justify-between"><span>Verschoonruimte</span><span>{calc.verschoon.toFixed(2)} m²</span></div>
          <div className="flex justify-between"><span>Was- en droogruimte</span><span>{calc.wasdroog.toFixed(2)} m²</span></div>
          <div className="flex justify-between font-bold text-primary border-t border-primary/25 pt-2 mt-2">
            <span>Totaal sanitair</span><span>{calc.totaal.toFixed(2)} m²</span>
          </div>
        </div>
      </div>
    </div>
  )
}
