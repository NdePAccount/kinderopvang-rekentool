'use client'

import { useStore } from '@/lib/store'
import { PolicyChoice, NumberInput } from '../shared/PolicyChoice'
import { getFNO, getTechFactor, getVerkeersruimteFactor } from '@/lib/calculations'

export function Step09OndersteundeRuimten() {
  const state = useStore()
  const { ondersteunend, setOndersteunend } = state
  const fno = getFNO(state)
  const verkeers = getVerkeersruimteFactor(state)
  const techFactor = getTechFactor(state)
  const vvo = fno * verkeers
  const bvo = vvo * techFactor

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Ondersteunende ruimten</h2>
        <p className="text-sm text-muted-foreground">Toeslagfactoren voor verkeersruimte en technische installaties.</p>
      </div>

      <PolicyChoice
        label="Toeslag verkeersruimte (FNO → VVO)"
        optionA="Standaard (15%)"
        optionB="Eigen beleid"
        value={ondersteunend.verkeersPolicy === 'standaard' ? 'a' : 'b'}
        onChange={(v) => setOndersteunend({ verkeersPolicy: v === 'a' ? 'standaard' : 'eigen', verkeerspct: v === 'a' ? 15 : ondersteunend.verkeerspct })}
        hint="Wettelijke richtlijn: 15%. Pas alleen aan indien de situatie hiervan afwijkt."
      >
        <NumberInput
          label="Verkeersruimte toeslag"
          value={ondersteunend.verkeerspct}
          onChange={(v) => setOndersteunend({ verkeerspct: v })}
          min={0} step={0.5} unit="%"
        />
      </PolicyChoice>

      <PolicyChoice
        label="Toeslag technische installatieruimten en constructieoppervlakte"
        optionA="Standaard (15%)"
        optionB="Eigen beleid"
        value={ondersteunend.techPolicy === 'standaard' ? 'a' : 'b'}
        onChange={(v) => setOndersteunend({ techPolicy: v === 'a' ? 'standaard' : 'eigen', techPct: v === 'a' ? 15 : ondersteunend.techPct })}
        hint="Rekenen met een toeslag op netto-ruimten van ca. 10–15% (voor installaties en wanden)"
      >
        <NumberInput
          label="Toeslagpercentage"
          value={ondersteunend.techPct}
          onChange={(v) => setOndersteunend({ techPct: v })}
          min={10} step={0.5} unit="%"
          hint="Minimaal 10% (bijv. installaties 2% + wanden 10% = 12%)"
        />
      </PolicyChoice>

      <div className="bg-primary/8 border border-primary/25 rounded-xl p-4 text-sm space-y-2">
        <p className="font-semibold text-primary mb-2">Resulterende oppervlakten</p>
        <div className="space-y-1.5 text-muted-foreground">
          <div className="flex justify-between"><span>FNO (nuttig vloeroppervlak)</span><span className="font-medium">{fno.toFixed(2)} m²</span></div>
          <div className="flex justify-between"><span>VVO (FNO × {verkeers.toFixed(3)})</span><span className="font-medium">{vvo.toFixed(2)} m²</span></div>
          <div className="flex justify-between font-bold text-primary"><span>BVO (VVO × {techFactor.toFixed(3)})</span><span>{bvo.toFixed(2)} m²</span></div>
        </div>
      </div>
    </div>
  )
}
