'use client'

import { useStore } from '@/lib/store'
import { YesNo, NumberInput } from '../shared/PolicyChoice'
import { getFNO, getTechFactor, getVerkeersruimteFactor } from '@/lib/calculations'

export function Step11Kosten() {
  const state = useStore()
  const { kosten, setKosten, opvangvorm } = state
  const fno = getFNO(state)
  const verkeers = getVerkeersruimteFactor(state)
  const techFactor = getTechFactor(state)
  const bvo = fno * verkeers * techFactor
  const std = opvangvorm === 'BSO' ? 3984 : 4326
  const effectief = kosten.known ? kosten.kostenPerM2BVO : std
  const totaleKosten = bvo * effectief

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Kosten (€/m² BVO)</h2>
        <p className="text-sm text-muted-foreground">Bepaal de totale investeringskosten per m² BVO.</p>
      </div>

      <YesNo
        label="Zijn de totale investeringskosten per m² BVO bekend?"
        value={kosten.known}
        onChange={(v) => setKosten({ known: v, kostenPerM2BVO: v ? kosten.kostenPerM2BVO : std })}
      />

      {kosten.known ? (
        <NumberInput
          label="Totale investeringskosten per m² BVO"
          value={kosten.kostenPerM2BVO}
          onChange={(v) => setKosten({ kostenPerM2BVO: v })}
          min={3000} step={10} unit="€/m²"
          hint={`Minimaal €3.000 — gemiddelde referentiewaarde: ca. €${std.toLocaleString('nl-NL')}/m²`}
        />
      ) : (
        <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground">
          Standaard referentiewaarde: <strong>€{std.toLocaleString('nl-NL')}/m² BVO</strong>
        </div>
      )}

      <div className="bg-primary/8 border border-primary/25 rounded-xl p-4 text-sm space-y-2">
        <div className="flex justify-between text-muted-foreground"><span>BVO</span><span>{bvo.toFixed(2)} m²</span></div>
        <div className="flex justify-between text-muted-foreground"><span>Kosten per m² BVO</span><span>€{effectief.toLocaleString('nl-NL')}</span></div>
        <div className="flex justify-between font-bold text-primary border-t border-primary/25 pt-2">
          <span>Totale investeringskosten</span>
          <span>€{totaleKosten.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}</span>
        </div>
      </div>
    </div>
  )
}
