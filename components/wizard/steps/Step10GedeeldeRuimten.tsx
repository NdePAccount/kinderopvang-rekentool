'use client'

import { useStore } from '@/lib/store'
import { getSpeelruimte, getSanitair, getKeuken, getKantoor, getOverig, getTechFactor, getGedeeldM2, getFNO } from '@/lib/calculations'
import type { GedeeldRuimte } from '@/lib/types'
import { cn } from '@/lib/utils'

interface RuimteEntry {
  key: string
  label: string
  m2: number
  isToilet?: boolean
}

export function Step10GedeeldeRuimten() {
  const state = useStore()
  const { gedeeld, setGedeeld, kantoor, overig, sanitair } = state

  const calcSanitair = getSanitair(state)
  const calcKeuken = getKeuken(state)
  const calcKantoor = getKantoor(state)
  const calcOverig = getOverig(state)

  const ruimten: RuimteEntry[] = [
    { key: 'speelruimte', label: 'Speelruimte', m2: getSpeelruimte(state) },
    { key: 'toiletruimten', label: 'Toiletruimten', m2: calcSanitair.toiletTotaal, isToilet: true },
    { key: 'verschoonruimte', label: 'Verschoonruimte', m2: calcSanitair.verschoon },
    { key: 'wasdroog', label: 'Was- en droogruimte', m2: calcSanitair.wasdroog },
    { key: 'keuken', label: 'Keuken', m2: calcKeuken.totaal },
    ...(kantoor.pauzeTeam.aanwezig ? [{ key: 'pauzeTeam', label: 'Pauze-/teamruimte', m2: calcKantoor.pauzeTeam }] : []),
    ...(kantoor.werk.aanwezig ? [{ key: 'werk', label: 'Werkruimte', m2: calcKantoor.werk }] : []),
    ...(kantoor.spreek.aanwezig ? [{ key: 'spreek', label: 'Spreekruimte', m2: calcKantoor.spreek }] : []),
    { key: 'berg', label: 'Algemene bergruimte', m2: calcOverig.berg },
    ...(overig.opslag.aanwezig ? [{ key: 'opslag', label: 'Aanvullende opslagruimte', m2: calcOverig.opslag }] : []),
    { key: 'schoonmaak', label: 'Schoonmaakruimte(n)', m2: calcOverig.schoonmaak },
  ]

  const fno = getFNO(state)
  const gedeeldFNO = getGedeeldM2(state)
  const techFactor = getTechFactor(state)
  const gedeeldVVO = gedeeldFNO * 1.15
  const totalVVO = fno * 1.15
  const pctGedeeld = totalVVO > 0 ? (gedeeldVVO / totalVVO) * 100 : 0

  function getEntry(key: string): GedeeldRuimte {
    return gedeeld[key] ?? { gedeeld: false, optie: 'geheel', m2: 0 }
  }

  function setShared(key: string, isGedeeld: boolean, m2Total: number) {
    if (!isGedeeld) {
      setGedeeld(key, { gedeeld: false, optie: 'geheel', m2: 0 })
    } else {
      const current = getEntry(key)
      setGedeeld(key, { gedeeld: true, optie: current.optie || 'geheel', m2: current.optie === 'deel' ? current.m2 : m2Total })
    }
  }

  function setOptie(key: string, optie: 'geheel' | 'deel', m2Total: number) {
    setGedeeld(key, { gedeeld: true, optie, m2: optie === 'geheel' ? m2Total : getEntry(key).m2 })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Gedeelde ruimten (BSO)</h2>
        <p className="text-sm text-muted-foreground">Geef aan welke ruimten gedeeld worden met andere functies (bijv. onderwijs).</p>
      </div>

      <div className="space-y-3">
        {ruimten.map((r) => {
          const entry = getEntry(r.key)
          return (
            <div key={r.key} className="border border-border rounded-xl overflow-hidden">
              {/* Header row: toggle */}
              <div className="flex items-center justify-between p-4 bg-white">
                <div>
                  <p className="text-sm font-medium text-foreground">{r.label}</p>
                  <p className="text-xs text-muted-foreground">{r.m2.toFixed(2)} m²</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShared(r.key, !entry.gedeeld, r.m2)}
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    entry.gedeeld ? 'bg-primary' : 'bg-gray-200'
                  )}
                >
                  <span className={cn('inline-block h-4 w-4 rounded-full bg-white shadow transition-transform', entry.gedeeld ? 'translate-x-6' : 'translate-x-1')} />
                </button>
              </div>

              {/* Detail when shared */}
              {entry.gedeeld && (
                <div className="px-4 pb-4 pt-2 bg-primary/8 border-t border-primary/15 space-y-3">
                  <div className="flex gap-2">
                    {(['geheel', 'deel'] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setOptie(r.key, opt, r.m2)}
                        className={cn(
                          'flex-1 py-1.5 rounded-lg border text-sm font-medium transition-all',
                          entry.optie === opt ? 'border-primary bg-primary/12 text-primary' : 'border-border bg-white text-muted-foreground'
                        )}
                      >
                        {opt === 'geheel' ? 'Geheel' : 'Deel'}
                      </button>
                    ))}
                  </div>
                  {entry.optie === 'deel' && (
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={0} max={r.m2} step={0.1}
                        value={entry.m2}
                        onChange={(e) => {
                          const val = Math.min(r.m2, Math.max(0, parseFloat(e.target.value) || 0))
                          setGedeeld(r.key, { ...entry, m2: val })
                        }}
                        className="w-28 border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                      />
                      <span className="text-sm text-muted-foreground">m² (max {r.m2.toFixed(2)} m²)</span>
                    </div>
                  )}
                  <p className="text-xs text-primary">
                    Gedeeld: {entry.optie === 'geheel' ? r.m2.toFixed(2) : entry.m2.toFixed(2)} m²
                    ({r.m2 > 0 ? ((entry.optie === 'geheel' ? r.m2 : entry.m2) / r.m2 * 100).toFixed(0) : 0}%)
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="bg-primary/8 border border-primary/25 rounded-xl p-4 text-sm space-y-1">
        <div className="flex justify-between text-muted-foreground"><span>Totaal gedeeld FNO</span><span className="font-medium">{gedeeldFNO.toFixed(2)} m²</span></div>
        <div className="flex justify-between text-muted-foreground"><span>Gedeeld VVO (× 1,15)</span><span className="font-medium">{gedeeldVVO.toFixed(2)} m²</span></div>
        <div className="flex justify-between font-bold text-primary border-t border-primary/25 pt-2 mt-2">
          <span>Gedeeld % van gebouw</span><span>{pctGedeeld.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  )
}
