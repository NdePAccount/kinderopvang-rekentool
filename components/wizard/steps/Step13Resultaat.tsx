'use client'

import { useStore } from '@/lib/store'
import { calcKdv, calcBso, buildStandardState } from '@/lib/calculations/rent'
import { Button } from '@/components/ui/button'

function fmtMoney(v: number): string {
  return '€ ' + Math.round(v).toLocaleString('nl-NL')
}

function fmtM2(v: number): string {
  return v.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' m²'
}

function diffVal(a: number, b: number): { verschil: string; verschilPositive: boolean } {
  const d = a - b
  return { verschil: (d >= 0 ? '+' : '') + fmtMoney(d), verschilPositive: d >= 0 }
}

function diffM2(a: number, b: number): { verschil: string; verschilPositive: boolean } {
  const d = a - b
  return { verschil: (d >= 0 ? '+' : '-') + fmtM2(Math.abs(d)), verschilPositive: d >= 0 }
}

function numNl(v: number, decimals = 2): string {
  return v.toLocaleString('nl-NL', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

interface RowProps {
  label: string
  eigen: string
  standaard: string
  verschil: string
  verschilPositive: boolean
  bold?: boolean
  invertColor?: boolean
}

interface CsvRow {
  label: string
  eigen: number
  standaard: number
  eenheid: string
  sectie?: string
}

function Row({ label, eigen, standaard, verschil, verschilPositive, bold, invertColor }: RowProps) {
  const isHigherCost = invertColor ? !verschilPositive : verschilPositive
  return (
    <tr className={bold ? 'bg-primary/8 font-semibold' : 'hover:bg-muted/50'}>
      <td className={`py-2 px-3 text-sm ${bold ? 'text-primary' : 'text-muted-foreground'}`}>{label}</td>
      <td className="py-2 px-3 text-sm text-right tabular-nums">{eigen}</td>
      <td className="py-2 px-3 text-sm text-right tabular-nums text-muted-foreground">{standaard}</td>
      <td className={`py-2 px-3 text-sm text-right tabular-nums ${isHigherCost ? 'text-red-600' : 'text-green-700'}`}>{verschil}</td>
    </tr>
  )
}

function SectionHeader({ label }: { label: string }) {
  return (
    <tr className="bg-muted">
      <td colSpan={4} className="py-2 px-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">{label}</td>
    </tr>
  )
}

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50 border-b border-border">
            <th className="py-3 px-3 text-left text-xs font-semibold text-muted-foreground uppercase">Variabele</th>
            <th className="py-3 px-3 text-right text-xs font-semibold text-primary uppercase">Eigen beleid</th>
            <th className="py-3 px-3 text-right text-xs font-semibold text-muted-foreground uppercase">Standaard</th>
            <th className="py-3 px-3 text-right text-xs font-semibold text-muted-foreground uppercase">Verschil</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">{children}</tbody>
      </table>
    </div>
  )
}

function SimpleTableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50 border-b border-border">
            <th className="py-3 px-3 text-left text-xs font-semibold text-muted-foreground uppercase">Variabele</th>
            <th className="py-3 px-3 text-right text-xs font-semibold text-primary uppercase">Waarde</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">{children}</tbody>
      </table>
    </div>
  )
}

function SimpleRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <tr className={bold ? 'bg-primary/8 font-semibold' : 'hover:bg-muted/50'}>
      <td className={`py-2 px-3 text-sm ${bold ? 'text-primary' : 'text-muted-foreground'}`}>{label}</td>
      <td className="py-2 px-3 text-sm text-right tabular-nums text-green-700">{value}</td>
    </tr>
  )
}

function downloadCsv(csvRows: CsvRow[], opvangvorm: string) {
  const header = ['Sectie', 'Variabele', 'Eenheid', 'Eigen beleid', 'Standaard', 'Verschil'].join(';')
  const lines = csvRows.map(r => {
    const d = r.eigen - r.standaard
    return [
      r.sectie ?? '',
      r.label,
      r.eenheid,
      numNl(r.eigen),
      numNl(r.standaard),
      numNl(d),
    ].join(';')
  })
  const content = '﻿' + [header, ...lines].join('\r\n')
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `resultaat-${opvangvorm.toLowerCase()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function Step13Resultaat() {
  const state = useStore()
  const stdState = buildStandardState(state)
  const { setStep, reset } = state

  if (state.opvangvorm === 'KDV') {
    const e = calcKdv(state)
    const s = calcKdv(stdState)

    const rows: RowProps[] = [
      { label: 'Totaal nuttig vloeroppervlak (FNO)', eigen: fmtM2(e.fno), standaard: fmtM2(s.fno), ...diffM2(e.fno, s.fno) },
      { label: 'VVO', eigen: fmtM2(e.vvo), standaard: fmtM2(s.vvo), ...diffM2(e.vvo, s.vvo) },
      { label: 'BVO', eigen: fmtM2(e.bvo), standaard: fmtM2(s.bvo), ...diffM2(e.bvo, s.bvo) },
      { label: 'Totale investeringskosten', eigen: fmtMoney(e.totaleKosten), standaard: fmtMoney(s.totaleKosten), ...diffVal(e.totaleKosten, s.totaleKosten) },
      { label: 'Jaarlijkse kapitaallast', eigen: fmtMoney(e.kapitaallast), standaard: fmtMoney(s.kapitaallast), ...diffVal(e.kapitaallast, s.kapitaallast) },
      { label: 'Exploitatielasten', eigen: fmtMoney(e.exploitatielasten), standaard: fmtMoney(s.exploitatielasten), ...diffVal(e.exploitatielasten, s.exploitatielasten) },
      { label: 'Totale jaarlijkse huursom', eigen: fmtMoney(e.totaleHuursom), standaard: fmtMoney(s.totaleHuursom), ...diffVal(e.totaleHuursom, s.totaleHuursom), bold: true },
      { label: 'Huur per m² VVO per jaar', eigen: fmtMoney(e.huurPerM2VVO), standaard: fmtMoney(s.huurPerM2VVO), ...diffVal(e.huurPerM2VVO, s.huurPerM2VVO), bold: true },
      { label: 'Jaarlijkse kosten per kindplaats', eigen: fmtMoney(e.kostenPerKindplaats), standaard: fmtMoney(s.kostenPerKindplaats), ...diffVal(e.kostenPerKindplaats, s.kostenPerKindplaats), bold: true },
    ]

    const csvRows: CsvRow[] = [
      { label: 'Totaal nuttig vloeroppervlak (FNO)', eigen: e.fno, standaard: s.fno, eenheid: 'm²' },
      { label: 'VVO', eigen: e.vvo, standaard: s.vvo, eenheid: 'm²' },
      { label: 'BVO', eigen: e.bvo, standaard: s.bvo, eenheid: 'm²' },
      { label: 'Totale investeringskosten', eigen: e.totaleKosten, standaard: s.totaleKosten, eenheid: '€' },
      { label: 'Jaarlijkse kapitaallast', eigen: e.kapitaallast, standaard: s.kapitaallast, eenheid: '€/jaar' },
      { label: 'Exploitatielasten', eigen: e.exploitatielasten, standaard: s.exploitatielasten, eenheid: '€/jaar' },
      { label: 'Totale jaarlijkse huursom', eigen: e.totaleHuursom, standaard: s.totaleHuursom, eenheid: '€/jaar' },
      { label: 'Huur per m² VVO per jaar', eigen: e.huurPerM2VVO, standaard: s.huurPerM2VVO, eenheid: '€/m²/jaar' },
      { label: 'Jaarlijkse kosten per kindplaats', eigen: e.kostenPerKindplaats, standaard: s.kostenPerKindplaats, eenheid: '€/kindplaats/jaar' },
    ]

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Resultaat &ndash; KDV</h2>
          <p className="text-sm text-muted-foreground">Vergelijking van uw keuzes met de standaardwaardes.</p>
        </div>
        <TableWrapper>
          {rows.map((r, i) => <Row key={i} {...r} />)}
        </TableWrapper>
        <p className="text-xs text-muted-foreground/60">Verschil = Eigen beleid &minus; Standaard. Rood = hogere kosten, groen = lagere kosten.</p>
        <div className="flex gap-3 pt-2">
          <Button className="flex-1" onClick={() => downloadCsv(csvRows, 'KDV')}>Download als CSV</Button>
          <Button variant="outline" onClick={() => setStep(1)}>Opnieuw beginnen</Button>
          <Button variant="outline" onClick={() => reset()}>Volledig opnieuw starten</Button>
        </div>
      </div>
    )
  }

  // BSO
  const e = calcBso(state)
  const s = calcBso(stdState)

  const csvRows: CsvRow[] = [
    { sectie: 'Zonder ruimtedeling', label: 'Volledig VVO', eigen: e.volledigVVO, standaard: e.volledigVVO, eenheid: 'm²' },
    { sectie: 'Zonder ruimtedeling', label: 'Volledig BVO', eigen: e.volledigBVO, standaard: e.volledigBVO, eenheid: 'm²' },
    { sectie: 'Zonder ruimtedeling', label: 'Totale investeringskosten', eigen: e.volledigKosten, standaard: e.volledigKosten, eenheid: '€' },
    { sectie: 'Zonder ruimtedeling', label: 'Jaarlijkse kapitaallast', eigen: e.volledigKapitaallast, standaard: e.volledigKapitaallast, eenheid: '€/jaar' },
    { sectie: 'Zonder ruimtedeling', label: 'Exploitatielasten', eigen: e.volledigExploitatie, standaard: e.volledigExploitatie, eenheid: '€/jaar' },
    { sectie: 'Zonder ruimtedeling', label: 'Huursom zonder delen', eigen: e.volledigHuursom, standaard: e.volledigHuursom, eenheid: '€/jaar' },
    { sectie: 'Zonder ruimtedeling', label: 'Huur per m² VVO per jaar', eigen: e.volledigHuurPerM2VVO, standaard: e.volledigHuurPerM2VVO, eenheid: '€/m²/jaar' },
    { sectie: 'Voordeel ruimtedeling', label: 'Gedeeld FNO', eigen: e.gedeeldFNO, standaard: 0, eenheid: 'm²' },
    { sectie: 'Voordeel ruimtedeling', label: 'Besparing kapitaallast', eigen: e.besparingKapitaallast, standaard: 0, eenheid: '€/jaar' },
    { sectie: 'Voordeel ruimtedeling', label: 'Exploitatie doorberekend aan partner', eigen: e.exploitatieGedeeld, standaard: 0, eenheid: '€/jaar' },
    { sectie: 'Voordeel ruimtedeling', label: 'Totaal voordeel', eigen: e.besparingTotaal, standaard: 0, eenheid: '€/jaar' },
    { sectie: 'Voordeel ruimtedeling', label: 'Kostendekkende huur gedeeld', eigen: e.kostendekkendHuurGedeeld, standaard: 0, eenheid: '€/m²/jaar' },
    { sectie: 'Netto kosten', label: 'Ongedeeld VVO', eigen: e.ongedeeldVVO, standaard: e.ongedeeldVVO, eenheid: 'm²' },
    { sectie: 'Netto kosten', label: 'Ongedeeld BVO', eigen: e.ongedeeldBVO, standaard: e.ongedeeldBVO, eenheid: 'm²' },
    { sectie: 'Netto kosten', label: 'Kapitaallast (ongedeeld)', eigen: e.kapitaallast, standaard: e.kapitaallast, eenheid: '€/jaar' },
    { sectie: 'Netto kosten', label: 'Exploitatielasten (ongedeeld)', eigen: e.exploitatieOngedeeld, standaard: e.exploitatieOngedeeld, eenheid: '€/jaar' },
    { sectie: 'Netto kosten', label: 'Netto jaarlijkse huursom', eigen: e.totaleHuursom, standaard: e.totaleHuursom, eenheid: '€/jaar' },
    { sectie: 'Netto kosten', label: 'Huur per m² VVO per jaar', eigen: e.huurPerM2VVO, standaard: e.huurPerM2VVO, eenheid: '€/m²/jaar' },
    { sectie: 'Netto kosten', label: 'Kosten per kindplaats per jaar', eigen: e.kostenPerKindplaats, standaard: e.kostenPerKindplaats, eenheid: '€/kindplaats/jaar' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Resultaat &ndash; BSO</h2>
        <p className="text-sm text-muted-foreground">Vergelijking van uw keuzes met de standaardwaardes.</p>
      </div>

      {e.gedeeldFNO > 0 && (
        <>
          {/* Card 1: without sharing */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide px-1">1. Kosten zonder ruimtedeling</p>
            <TableWrapper>
              <Row label="Totaal VVO" eigen={fmtM2(e.volledigVVO)} standaard={fmtM2(s.volledigVVO)} {...diffM2(e.volledigVVO, s.volledigVVO)} />
              <Row label="Totaal BVO" eigen={fmtM2(e.volledigBVO)} standaard={fmtM2(s.volledigBVO)} {...diffM2(e.volledigBVO, s.volledigBVO)} />
              <Row label="Totale investeringskosten" eigen={fmtMoney(e.volledigKosten)} standaard={fmtMoney(s.volledigKosten)} {...diffVal(e.volledigKosten, s.volledigKosten)} />
              <Row label="Jaarlijkse kapitaallast" eigen={fmtMoney(e.volledigKapitaallast)} standaard={fmtMoney(s.volledigKapitaallast)} {...diffVal(e.volledigKapitaallast, s.volledigKapitaallast)} />
              <Row label="Exploitatielasten per jaar" eigen={fmtMoney(e.volledigExploitatie)} standaard={fmtMoney(s.volledigExploitatie)} {...diffVal(e.volledigExploitatie, s.volledigExploitatie)} />
              <Row label="Jaarlijkse huursom (bruto)" eigen={fmtMoney(e.volledigHuursom)} standaard={fmtMoney(s.volledigHuursom)} {...diffVal(e.volledigHuursom, s.volledigHuursom)} bold />
              <Row label="Huur per m² VVO per jaar" eigen={fmtMoney(e.volledigHuurPerM2VVO)} standaard={fmtMoney(s.volledigHuurPerM2VVO)} {...diffVal(e.volledigHuurPerM2VVO, s.volledigHuurPerM2VVO)} bold />
            </TableWrapper>
          </div>

          {/* Card 2: saving from sharing — no standaard/verschil columns */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide px-1">2. Voordeel door ruimtedeling</p>
            <SimpleTableWrapper>
              <SimpleRow label="Gedeeld oppervlak (FNO)" value={fmtM2(e.gedeeldFNO)} />
              <SimpleRow label="Gedeeld BVO" value={fmtM2(e.gedeeldBVO)} />
              <SimpleRow label="Besparing kapitaallast" value={fmtMoney(e.besparingKapitaallast)} />
              <SimpleRow label="Exploitatie doorberekend aan partner" value={fmtMoney(e.exploitatieGedeeld)} />
              <SimpleRow label="Totaal voordeel per jaar" value={fmtMoney(e.besparingTotaal)} bold />
              <SimpleRow label="Kostendekkende huur gedeeld (per m² VVO/jaar)" value={fmtMoney(e.kostendekkendHuurGedeeld)} />
            </SimpleTableWrapper>
          </div>
        </>
      )}

      {/* Card 3: net costs */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide px-1">{e.gedeeldFNO > 0 ? '3. Netto kosten project' : 'Kosten project'}</p>
        <TableWrapper>
          <Row label={e.gedeeldFNO > 0 ? 'Ongedeeld VVO' : 'Totaal VVO'} eigen={fmtM2(e.ongedeeldVVO)} standaard={fmtM2(s.ongedeeldVVO)} {...diffM2(e.ongedeeldVVO, s.ongedeeldVVO)} />
          <Row label={e.gedeeldFNO > 0 ? 'Ongedeeld BVO' : 'Totaal BVO'} eigen={fmtM2(e.ongedeeldBVO)} standaard={fmtM2(s.ongedeeldBVO)} {...diffM2(e.ongedeeldBVO, s.ongedeeldBVO)} />
          <Row label="Totale investeringskosten" eigen={fmtMoney(e.totaleKosten)} standaard={fmtMoney(s.totaleKosten)} {...diffVal(e.totaleKosten, s.totaleKosten)} />
          <Row label="Jaarlijkse kapitaallast" eigen={fmtMoney(e.kapitaallast)} standaard={fmtMoney(s.kapitaallast)} {...diffVal(e.kapitaallast, s.kapitaallast)} />
          <Row label="Exploitatielasten per jaar" eigen={fmtMoney(e.exploitatieOngedeeld)} standaard={fmtMoney(s.exploitatieOngedeeld)} {...diffVal(e.exploitatieOngedeeld, s.exploitatieOngedeeld)} />
          <Row label={e.gedeeldFNO > 0 ? 'Netto jaarlijkse huursom' : 'Jaarlijkse huursom'} eigen={fmtMoney(e.totaleHuursom)} standaard={fmtMoney(s.totaleHuursom)} {...diffVal(e.totaleHuursom, s.totaleHuursom)} bold />
          <Row label="Huur per m² VVO per jaar" eigen={fmtMoney(e.huurPerM2VVO)} standaard={fmtMoney(s.huurPerM2VVO)} {...diffVal(e.huurPerM2VVO, s.huurPerM2VVO)} bold />
          <Row label="Jaarlijkse kosten per kindplaats" eigen={fmtMoney(e.kostenPerKindplaats)} standaard={fmtMoney(s.kostenPerKindplaats)} {...diffVal(e.kostenPerKindplaats, s.kostenPerKindplaats)} bold />
        </TableWrapper>
      </div>

      <p className="text-xs text-muted-foreground/60">Verschil = Eigen beleid &minus; Standaard. Rood = hogere kosten, groen = lagere kosten.</p>
      <div className="flex gap-3 pt-1">
        <Button className="flex-1" onClick={() => downloadCsv(csvRows, 'BSO')}>Download als CSV</Button>
        <Button variant="outline" onClick={() => setStep(1)}>Opnieuw beginnen</Button>
        <Button variant="outline" onClick={() => reset()}>Volledig opnieuw starten</Button>
      </div>
    </div>
  )
}
