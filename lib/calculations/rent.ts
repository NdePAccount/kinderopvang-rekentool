import type { WizardState } from '../types'
import { getFNO, getSpeelruimte, getSanitair, getKeuken, getKantoor, getOverig, getTotaalKindplaatsen } from './rooms'

export function annuity(principal: number, ratePercent: number, years: number): number {
  const r = ratePercent / 100
  return principal * (r * Math.pow(1 + r, years)) / (Math.pow(1 + r, years) - 1)
}

export function getTechFactor(s: WizardState): number {
  return 1 + (s.ondersteunend.techPolicy === 'standaard' ? 15 : s.ondersteunend.techPct) / 100
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
  const rente = s.huursom.rente
  const exploitatiekosten = s.huursom.exploitatiekosten
  const kostenPerM2BVO = s.kosten.kostenPerM2BVO

  const fno = getFNO(s)
  const vvo = fno * 1.15
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
  const rente = s.huursom.rente
  const exploitatiekosten = s.huursom.exploitatiekosten
  const kostenPerM2BVO = s.kosten.kostenPerM2BVO

  const fno = getFNO(s)
  const gedeeldFNO = getGedeeldM2(s)
  const ongedeeldFNO = fno - gedeeldFNO

  const gedeeldVVO = gedeeldFNO * 1.15
  const ongedeeldVVO = ongedeeldFNO * 1.15

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
  const volledigVVO = fno * 1.15
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
    ondersteunend: { techPolicy: 'standaard', techPct: 15 },
    gedeeld: {},  // BSO standard has no shared spaces
    kosten: { known: false, kostenPerM2BVO: isKdv ? 4158 : 3829 },
    huursom: { rentePolicy: 'standaard', rente: 3.5, exploitatiePolicy: 'basisscenario', exploitatiekosten: isKdv ? 113 : 95 },
  } as WizardState
}
