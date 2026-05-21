'use client'

import { useStore } from '@/lib/store'
import { PolicyChoice, NumberInput } from '../shared/PolicyChoice'
import { getFNO, getTechFactor, getVerkeersruimteFactor } from '@/lib/calculations'
import { annuity } from '@/lib/calculations/rent'

export function Step12Huursom() {
  const state = useStore()
  const { huursom, setHuursom, kosten, opvangvorm } = state
  const fno = getFNO(state)
  const verkeers = getVerkeersruimteFactor(state)
  const techFactor = getTechFactor(state)
  const bvo = fno * verkeers * techFactor
  const std = opvangvorm === 'BSO' ? 3984 : 4326
  const kostenPerM2 = kosten.known ? kosten.kostenPerM2BVO : std
  const totaleKosten = bvo * kostenPerM2
  const rente = huursom.rentePolicy === 'standaard' ? 3.5 : huursom.rente
  const exploitatiekosten = huursom.exploitatiePolicy === 'basisscenario'
    ? (opvangvorm === 'BSO' ? 99 : 118)
    : huursom.exploitatiekosten
  const exploitatielasten = exploitatiekosten * bvo
  const kapitaallast = rente > 0 ? annuity(totaleKosten, rente, 40) : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Huursom – Uitgangspunten</h2>
        <p className="text-sm text-muted-foreground">Stel de parameters in voor de annuïtaire huurberekening.</p>
      </div>

      <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground space-y-1">
        <div className="flex justify-between"><span>Looptijd</span><span className="font-medium">40 jaar (vast)</span></div>
        <div className="flex justify-between"><span>Basisberekening</span><span className="font-medium">Annuïtair (vast)</span></div>
        <div className="flex justify-between"><span>Restwaarde</span><span className="font-medium">€0 (geen restwaarde)</span></div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
        In deze berekening wordt uitgegaan van een restwaarde van nul aan het einde van de looptijd. Dit is een conservatief uitgangspunt: de volledige investering wordt via annuïteiten terugverdiend.
      </div>

      <PolicyChoice
        label="Rente"
        optionA="Standaard (3,5%)"
        optionB="Eigen beleid"
        value={huursom.rentePolicy === 'standaard' ? 'a' : 'b'}
        onChange={(v) => setHuursom({ rentePolicy: v === 'a' ? 'standaard' : 'eigen', rente: v === 'a' ? 3.5 : huursom.rente })}
      >
        <NumberInput
          label="Rentepercentage"
          value={huursom.rente}
          onChange={(v) => setHuursom({ rente: v })}
          min={0.1} step={0.25} unit="%"
          hint="Moet groter zijn dan 0%"
        />
      </PolicyChoice>

      <PolicyChoice
        label="Exploitatiekosten (€/m² BVO per jaar)"
        optionA={`Basisscenario (€${opvangvorm === 'BSO' ? 99 : 118}/m² BVO/jaar)`}
        optionB="Eigen beleid"
        value={huursom.exploitatiePolicy === 'basisscenario' ? 'a' : 'b'}
        onChange={(v) => setHuursom({ exploitatiePolicy: v === 'a' ? 'basisscenario' : 'eigen' })}
      >
        <NumberInput
          label="Exploitatiekosten per m² BVO per jaar"
          value={huursom.exploitatiekosten}
          onChange={(v) => setHuursom({ exploitatiekosten: v })}
          min={1} step={1} unit="€/m²/jaar"
          hint="Groter dan 0"
        />
      </PolicyChoice>

      <div className="bg-primary/8 border border-primary/25 rounded-xl p-4 text-sm space-y-2">
        <p className="font-semibold text-primary mb-1">Live overzicht</p>
        <div className="space-y-1 text-muted-foreground">
          <div className="flex justify-between"><span>Rente</span><span>{rente.toLocaleString('nl-NL', { minimumFractionDigits: 1 })}%</span></div>
          <div className="flex justify-between"><span>Exploitatiekosten</span><span>€{exploitatiekosten}/m² BVO/jaar</span></div>
          <div className="flex justify-between"><span>BVO</span><span>{bvo.toFixed(2)} m²</span></div>
          <div className="flex justify-between"><span>Exploitatielasten per jaar</span><span>€{exploitatielasten.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}</span></div>
          <div className="flex justify-between font-bold text-primary border-t border-primary/25 pt-2 mt-1">
            <span>Jaarlijkse kapitaallast</span><span>€{kapitaallast.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
