'use client'

import { useStore } from '@/lib/store'
import { NumberInput } from '../shared/PolicyChoice'
import { getTotaalGroepen, getTotaalKindplaatsen } from '@/lib/calculations'

const KDV_TYPES = [
  { key: 'g0_4' as const, label: 'Groepen 0–4 jaar', cap: 16 },
  { key: 'g0_2' as const, label: 'Groepen 0–2 jaar', cap: 16 },
  { key: 'g2_4' as const, label: 'Groepen 2–4 jaar', cap: 16 },
]

const BSO_TYPES = [
  { key: 'g4_12' as const, label: 'Groepen 4–12 jaar', cap: 30 },
  { key: 'g4_6' as const, label: 'Groepen 4–6 jaar', cap: 30 },
  { key: 'g7_12' as const, label: 'Groepen 7–12 jaar', cap: 30 },
]

export function Step02GroepenMaken() {
  const state = useStore()
  const { opvangvorm, groups, setGroups } = state
  const totaalGroepen = getTotaalGroepen(state)
  const totaalKindplaatsen = getTotaalKindplaatsen(state)

  if (opvangvorm === 'KDV') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Groepen maken – KDV</h2>
          <p className="text-sm text-muted-foreground">Voer het aantal groepen per type in. Minimaal één groep is verplicht.</p>
        </div>
        <div className="space-y-4">
          {KDV_TYPES.map(({ key, label, cap }) => (
            <NumberInput
              key={key}
              label={label}
              value={groups.kdv[key]}
              onChange={(v) => setGroups({ kdv: { ...groups.kdv, [key]: Math.max(0, Math.floor(v)) } })}
              min={0}
              step={1}
              hint={`${cap} kindplaatsen per groep`}
            />
          ))}
        </div>
        <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Totaal aantal groepen</span><span className="font-bold">{totaalGroepen}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Totaal aantal kindplaatsen</span><span className="font-bold">{totaalKindplaatsen}</span></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Groepen maken – BSO</h2>
        <p className="text-sm text-muted-foreground">Voer het aantal groepen per type in. Minimaal één groep is verplicht.</p>
      </div>
      <div className="space-y-4">
        {BSO_TYPES.map(({ key, label, cap }) => (
          <NumberInput
            key={key}
            label={label}
            value={groups.bso[key]}
            onChange={(v) => setGroups({ bso: { ...groups.bso, [key]: Math.max(0, Math.floor(v)) } })}
            min={0}
            step={1}
            hint={`${cap} kindplaatsen per groep`}
          />
        ))}
      </div>
      <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Totaal aantal groepen</span><span className="font-bold">{totaalGroepen}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Totaal aantal kindplaatsen</span><span className="font-bold">{totaalKindplaatsen}</span></div>
      </div>
    </div>
  )
}
