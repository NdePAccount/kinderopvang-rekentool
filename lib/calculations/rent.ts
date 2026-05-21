import type { WizardState } from '../types'
import { getFNO, getSpeelruimte, getSanitair, getKeuken, getKantoor, getOverig, getTotaalKindplaatsen } from './rooms'

export function annuity(principal: number, ratePercent: number, years: number): number {
  const r = ratePercent / 100
  return principal * (r * Math.pow(1 + r, years)) / (Math.pow(1 + r, years) - 1)
}

export function getTechFactor(s: WizardState): number {
  return 1 + (s.ondersteunend.techPolicy === 'standaard' ? 15 : s.ondersteunend.techPct) / 100
}

export function getVerkeersruimteFactor(s: WizardState): number {
  return 1 + (s.ondersteunend.verkeersPolicy === 'standaard' ? 15 : s.ondersteunend.verkeerspct) / 100
}

export interface KdvResults {
  fno: number; vvo: number; bvo: number
  totaleKosten: number; kapitaallast: number; exploitatielasten: number
  totaleHuursom: number; huurPerM2VVO: number; kostenPerKindplaats: number
}

export interface BsoResults {
  fno: number
  gedeeldFNO: number; ongedeeldFNO: number
  gedeeldVVO: number; ongedeeldVVO: number
  gedeeldBVO: number; ongedeeldBVO: number
  exploitatieGedeeld: number; exploitatieOngedeeld: number
  totaleKosten: number; kapitaallast: number
  totaleHuursom: number; huurPerM2VVO: number
  kostendekkendHuurGedeeld: number; kostenPerKindplaats: number
  // "without sharing" baseline
  volledigVVO: number; volledigBVO: number
  volledigKosten: number; volledigKapitaallast: number; volledigExploitatie: number
  volledigHuursom: number; volledigHuurPerM2VVO: number
  // saving breakdown
  besparingKapitaallast: number; besparingTotaal: number
}

export function calcKdv(s: WizardState): KdvResults {
  const techFactor = getTechFactor(s)
  const verkeers = getVerkeersruimteFactor(s)
  const rente = s.huursom.rente
  const exploitatiekosten = s.huursom.exploitatiekosten
  const kostenPerM2BVO = s.kosten.kostenPerM2BVO

  const fno = getFNO(s)
  const vvo = fno * verkeers
  const bvo = vvo * techFactor
  const totaleKosten = bvo * kostenPerM2BVO
  const kapitaallast = annuity(totaleKosten, rente, 40)
  const exploitatielasten = exploitatiekosten * bvo
  const totaleHuursom = kapitaallast + exploitatielasten
  const huurPerM2VVO = vvo > 0 ? totaleHuursom / vvo : 0
  const kindplaatsen = getTotaalKindplaatsen(s)
  const kostenPerKindplaats = kindplaatsen > 0 ? totaleHuursom / kindplaatsen : 0

  return { fno, vvo, bvo, totaleKosten, kapitaallast, exploitatielasten, totaleHuursom, huurPerM2VVO, kostenPerKindplaats }
}

export function getGedeeldM2(s: WizardState): number {
  return Object.values(s.gedeeld).reduce((sum, r) => {
    if (!r.gedeeld) return sum
    return sum + r.m2
  }, 0)
}

export function calcBso(s: WizardState): BsoResults {
  const techFactor = getTechFactor(s)
  const verkeers = getVerkeersruimteFactor(s)
  const rente = s.huursom.rente
  const exploitatiekosten = s.huursom.exploitatiekosten
  const kostenPerM2BVO = s.kosten.kostenPerM2BVO

  const fno = getFNO(s)
  const gedeeldFNO = getGedeeldM2(s)
  const ongedeeldFNO = fno - gedeeldFNO

  const gedeeldVVO = gedeeldFNO * verkeers
  const ongedeeldVVO = ongedeeldFNO * verkeers

  const gedeeldBVO = gedeeldVVO * techFactor
  const ongedeeldBVO = ongedeeldVVO * techFactor

  const exploitatieGedeeld = exploitatiekosten * gedeeldBVO
  const exploitatieOngedeeld = exploitatiekosten * ongedeeldBVO

  const totaleKosten = ongedeeldBVO * kostenPerM2BVO
  const kapitaallast = annuity(totaleKosten, rente, 40)
  const totaleHuursom = kapitaallast + exploitatieOngedeeld
  const huurPerM2VVO = ongedeeldVVO > 0 ? totaleHuursom / ongedeeldVVO : 0
  const kostendekkendHuurGedeeld = gedeeldVVO > 0 ? exploitatieGedeeld / gedeeldVVO : 0

  const kindplaatsen = getTotaalKindplaatsen(s)
  const kostenPerKindplaats = kindplaatsen > 0 ? totaleHuursom / kindplaatsen : 0

  // "without sharing" baseline — full FNO treated as unshared
  const volledigVVO = fno * verkeers
  const volledigBVO = volledigVVO * techFactor
  const volledigKosten = volledigBVO * kostenPerM2BVO
  const volledigKapitaallast = annuity(volledigKosten, rente, 40)
  const volledigExploitatie = exploitatiekosten * volledigBVO
  const volledigHuursom = volledigKapitaallast + volledigExploitatie
  const volledigHuurPerM2VVO = volledigVVO > 0 ? volledigHuursom / volledigVVO : 0

  const besparingKapitaallast = volledigKapitaallast - kapitaallast
  // saving = capital not spent on shared space + exploitatie passed on to partner
  const besparingTotaal = besparingKapitaallast + exploitatieGedeeld

  return {
    fno, gedeeldFNO, ongedeeldFNO, gedeeldVVO, ongedeeldVVO, gedeeldBVO, ongedeeldBVO,
    exploitatieGedeeld, exploitatieOngedeeld, totaleKosten, kapitaallast,
    totaleHuursom, huurPerM2VVO, kostendekkendHuurGedeeld, kostenPerKindplaats,
    volledigVVO, volledigBVO, volledigKosten, volledigKapitaallast, volledigExploitatie,
    volledigHuursom, volledigHuurPerM2VVO, besparingKapitaallast, besparingTotaal,
  }
}

export interface RendementResults {
  kindplaatsen: number
  bezettingsgraad: number
  aanwezigeKinderen: number
  tarief: number
  uren: number
  totaleBaten: number
  geschatteLasten: number
  exploitatieresultaat: number
  rendementPct: number
  resultaatPerKind: number
  kostendekkendUurtarief: number
  verschilUurtarief: number
  isWinstgevend: boolean
}

export function calcRendement(s: WizardState): RendementResults {
  const isKdv = s.opvangvorm === 'KDV'
  const r = s.rendement
  const stdBezettingsgraad = isKdv ? 88 : 86
  const stdTarief = isKdv ? 11.23 : 9.98
  const stdUren = isKdv ? 91.1 : 42.7

  const bezettingsgraad = r.bezettingsgraadPolicy === 'standaard' ? stdBezettingsgraad : r.bezettingsgraad
  const tarief = r.uurtariefPolicy === 'standaard' ? stdTarief : r.uurtarief
  const uren = r.opvangurenPolicy === 'standaard' ? stdUren : r.opvanguren
  const pct = r.huisvestingspctPolicy === 'standaard' ? 9.47 : r.huisvestingspct

  const huursom = isKdv ? calcKdv(s).totaleHuursom : calcBso(s).totaleHuursom
  const kindplaatsen = getTotaalKindplaatsen(s)
  const aanwezigeKinderen = kindplaatsen * bezettingsgraad / 100
  const uren_jaar = uren * 12
  const totaleBaten = aanwezigeKinderen * tarief * uren_jaar * 1.0493
  const geschatteLasten = huursom * (100 / pct)
  const exploitatieresultaat = totaleBaten - geschatteLasten
  const rendementPct = totaleBaten > 0 ? (exploitatieresultaat / totaleBaten) * 100 : 0
  const resultaatPerKind = kindplaatsen > 0 ? exploitatieresultaat / kindplaatsen : 0
  const kostendekkendUurtarief = aanwezigeKinderen > 0 && uren_jaar > 0
    ? geschatteLasten / (aanwezigeKinderen * uren_jaar * 1.0493)
    : 0
  const verschilUurtarief = tarief - kostendekkendUurtarief
  const isWinstgevend = exploitatieresultaat >= 0

  return {
    kindplaatsen, bezettingsgraad, aanwezigeKinderen, tarief, uren,
    totaleBaten, geschatteLasten, exploitatieresultaat, rendementPct,
    resultaatPerKind, kostendekkendUurtarief, verschilUurtarief, isWinstgevend,
  }
}

// Build a "standard" state for comparison column
export function buildStandardState(s: WizardState): WizardState {
  const isKdv = s.opvangvorm === 'KDV'
  const groepen = isKdv
    ? s.groups.kdv.g0_4 + s.groups.kdv.g0_2 + s.groups.kdv.g2_4
    : s.groups.bso.g4_12 + s.groups.bso.g4_6 + s.groups.bso.g7_12

  return {
    ...s,
    speelruimte: { policy: 'wettelijk', m2PerKindplaats: 3.5 },
    slaapruimte: {
      g0_4: { aantalPolicy: 'standaard', aantalPerGroep: 2, m2Policy: 'standaard', m2PerRuimte: 9 },
      g0_2: { aantalPolicy: 'standaard', aantalPerGroep: 2, m2Policy: 'standaard', m2PerRuimte: 9 },
      g2_4: { aantalPolicy: 'standaard', aantalPerGroep: 2, m2Policy: 'standaard', m2PerRuimte: 9 },
    },
    sanitair: {
      personeelstoiletten: 2,
      miva: 1,
      kindtoilet: { aantalPolicy: 'standaard', aantalPerGroep: 2, aantalTotaal: 1, m2Policy: 'standaard', m2PerToilet: 1.2 },
      verschoonruimte: { policy: 'standaard', m2PerGroep: 3, m2Fixed: 3 },
      wasdroog: { aantalPolicy: 'standaard', aantal: 1, m2Policy: 'standaard', m2PerRuimte: 4 },
    },
    keuken: {
      aantalPolicy: 'standaard', aantal: 1, m2Policy: 'standaard', m2PerKeuken: 1.08,
      pantry: { aantalPolicy: 'standaard', aantal: groepen, m2Policy: 'standaard', m2PerPantry: 1.1 },
    },
    kantoor: {
      pauzeTeam: { aanwezig: true, policy: 'standaard', m2: 9 },
      werk: { aanwezig: false, policy: 'standaard', m2: 9 },
      spreek: { aanwezig: false, policy: 'standaard', m2: 12, maxVierpersonen: true, extraPersonen: 1 },
    },
    overig: {
      buggy: { aantalPolicy: 'standaard', aantal: groepen * 4, m2Policy: 'standaard', m2PerBuggy: 0.8 },
      berg: { m2Policy: 'standaard', m2PerRuimte: 4 },
      opslag: { aanwezig: false, m2: 0 },
      schoonmaak: { bouwlagen: s.overig.schoonmaak.bouwlagen, m2Policy: 'standaard', m2PerRuimte: 2 },
    },
    ondersteunend: { verkeersPolicy: 'standaard', verkeerspct: 15, techPolicy: 'standaard', techPct: 15 },
    gedeeld: {},  // BSO standard has no shared spaces
    kosten: { known: false, kostenPerM2BVO: isKdv ? 4326 : 3984 },
    huursom: { rentePolicy: 'standaard', rente: 3.5, exploitatiePolicy: 'basisscenario', exploitatiekosten: isKdv ? 118 : 99 },
    rendement: s.rendement,
  } as WizardState
}
