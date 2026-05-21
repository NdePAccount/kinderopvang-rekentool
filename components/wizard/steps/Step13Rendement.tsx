'use client'

import { useStore } from '@/lib/store'
import { PolicyChoice, NumberInput } from '../shared/PolicyChoice'
import { calcRendement } from '@/lib/calculations/rent'

export function Step13Rendement() {
  const state = useStore()
  const { rendement, setRendement, opvangvorm } = state
  const isKdv = opvangvorm === 'KDV'

  const stdBezettingsgraad = isKdv ? 88 : 86
  const stdTarief = isKdv ? 11.23 : 9.98
  const stdUren = isKdv ? 91.1 : 42.7

  const r = calcRendement(state)

  function fmtMoney(v: number) {
    return '€ ' + Math.round(v).toLocaleString('nl-NL')
  }
  function fmtMoneyDec(v: number) {
    return '€ ' + v.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Geschat rendement</h2>
        <p className="text-sm text-muted-foreground">
          Stel exploitatieparameters in voor een indicatieve rendementsberekening.
        </p>
      </div>

      <PolicyChoice
        label="Bezettingsgraad"
        optionA={`Gemiddeld (${stdBezettingsgraad}%)`}
        optionB="Eigen beleid"
        value={rendement.bezettingsgraadPolicy === 'standaard' ? 'a' : 'b'}
        onChange={(v) => setRendement({ bezettingsgraadPolicy: v === 'a' ? 'standaard' : 'eigen' })}
      >
        <NumberInput
          label="Bezettingsgraad"
          value={rendement.bezettingsgraad}
          onChange={(v) => setRendement({ bezettingsgraad: Math.min(100, Math.max(0.1, v)) })}
          min={0.1} max={100} step={0.5} unit="%"
          hint="Tussen 0% en 100%"
        />
      </PolicyChoice>

      <PolicyChoice
        label="Uurtarief (KOT-maximumtarief)"
        optionA={`Gemiddeld (€ ${stdTarief.toLocaleString('nl-NL', { minimumFractionDigits: 2 })})`}
        optionB="Eigen beleid"
        value={rendement.uurtariefPolicy === 'standaard' ? 'a' : 'b'}
        onChange={(v) => setRendement({ uurtariefPolicy: v === 'a' ? 'standaard' : 'eigen' })}
      >
        <NumberInput
          label="Uurtarief"
          value={rendement.uurtarief}
          onChange={(v) => setRendement({ uurtarief: Math.max(0.01, v) })}
          min={0.01} step={0.01} unit="€/uur"
          hint="Groter dan 0"
        />
      </PolicyChoice>

      <PolicyChoice
        label="Opvanguren per maand"
        optionA={`Gemiddeld (${stdUren.toLocaleString('nl-NL')} uur/maand)`}
        optionB="Eigen beleid"
        value={rendement.opvangurenPolicy === 'standaard' ? 'a' : 'b'}
        onChange={(v) => setRendement({ opvangurenPolicy: v === 'a' ? 'standaard' : 'eigen' })}
      >
        <NumberInput
          label="Opvanguren per maand"
          value={rendement.opvanguren}
          onChange={(v) => setRendement({ opvanguren: Math.max(0.1, v) })}
          min={0.1} step={0.1} unit="uur/mnd"
          hint="Groter dan 0"
        />
      </PolicyChoice>

      <PolicyChoice
        label="Huisvestingslasten als % van totale lasten"
        optionA="Gemiddeld (9,47%)"
        optionB="Eigen beleid"
        value={rendement.huisvestingspctPolicy === 'standaard' ? 'a' : 'b'}
        onChange={(v) => setRendement({ huisvestingspctPolicy: v === 'a' ? 'standaard' : 'eigen' })}
        hint="Huisvestingslasten vormen gemiddeld 9,47% van de totale lasten"
      >
        <NumberInput
          label="Huisvestingspercentage"
          value={rendement.huisvestingspct}
          onChange={(v) => setRendement({ huisvestingspct: Math.min(100, Math.max(0.01, v)) })}
          min={0.01} max={100} step={0.1} unit="%"
          hint="Tussen 0% en 100%"
        />
      </PolicyChoice>

      {/* Live rendement preview */}
      <div className="bg-primary/8 border border-primary/25 rounded-xl p-4 text-sm space-y-2">
        <p className="font-semibold text-primary mb-2">Indicatieve rendementsberekening</p>
        <div className="space-y-1.5 text-muted-foreground">
          <div className="flex justify-between">
            <span>Aanwezige kinderen (gem.)</span>
            <span className="font-medium">{r.aanwezigeKinderen.toFixed(1)}</span>
          </div>
          <div className="flex justify-between">
            <span>Totale baten per jaar</span>
            <span className="font-medium">{fmtMoney(r.totaleBaten)}</span>
          </div>
          <div className="flex justify-between">
            <span>Geschatte totale lasten per jaar</span>
            <span className="font-medium">{fmtMoney(r.geschatteLasten)}</span>
          </div>
          <div className={`flex justify-between font-semibold border-t border-primary/25 pt-2 mt-1 ${r.isWinstgevend ? 'text-green-700' : 'text-red-600'}`}>
            <span>Exploitatieresultaat per jaar</span>
            <span>{fmtMoney(r.exploitatieresultaat)}</span>
          </div>
          <div className={`flex justify-between text-xs ${r.isWinstgevend ? 'text-green-700' : 'text-red-600'}`}>
            <span>Rendement</span>
            <span className="font-medium">{r.rendementPct.toLocaleString('nl-NL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</span>
          </div>
        </div>
        <div className="border-t border-primary/25 pt-2 mt-2 space-y-1.5 text-muted-foreground">
          <div className="flex justify-between">
            <span>Kostendekkend uurtarief</span>
            <span className="font-medium">{fmtMoneyDec(r.kostendekkendUurtarief)}</span>
          </div>
          <div className={`flex justify-between text-xs ${r.verschilUurtarief >= 0 ? 'text-green-700' : 'text-red-600'}`}>
            <span>Verschil met huidig tarief</span>
            <span className="font-medium">{r.verschilUurtarief >= 0 ? '+' : ''}{fmtMoneyDec(r.verschilUurtarief)}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground/60">
        De berekening is indicatief en gebaseerd op gemiddelde kengetallen. Uitkomsten kunnen afwijken van de werkelijkheid.
      </p>
    </div>
  )
}
