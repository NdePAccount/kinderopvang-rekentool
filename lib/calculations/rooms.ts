import type { WizardState } from '../types'

export function getTotaalGroepen(s: WizardState): number {
  if (s.opvangvorm === 'KDV') {
    return s.groups.kdv.g0_4 + s.groups.kdv.g0_2 + s.groups.kdv.g2_4
  }
  return s.groups.bso.g4_12 + s.groups.bso.g4_6 + s.groups.bso.g7_12
}

export function getTotaalKindplaatsen(s: WizardState): number {
  if (s.opvangvorm === 'KDV') {
    return (s.groups.kdv.g0_4 + s.groups.kdv.g0_2 + s.groups.kdv.g2_4) * 16
  }
  return (s.groups.bso.g4_12 + s.groups.bso.g4_6 + s.groups.bso.g7_12) * 30
}

export function getSpeelruimte(s: WizardState): number {
  const kindplaatsen = getTotaalKindplaatsen(s)
  const m2 = s.speelruimte.policy === 'wettelijk' ? 3.5 : s.speelruimte.m2PerKindplaats
  return kindplaatsen * m2
}

function calcGroepSlaap(groepen: number, g: { aantalPolicy: string; aantalPerGroep: number; m2Policy: string; m2PerRuimte: number }): number {
  if (groepen === 0) return 0
  const aantal = g.aantalPolicy === 'standaard' ? 2 : g.aantalPerGroep
  const m2 = g.m2Policy === 'standaard' ? 9 : g.m2PerRuimte
  return groepen * aantal * m2
}

export function getSlaapruimte(s: WizardState): number {
  const { g0_4, g0_2, g2_4 } = s.groups.kdv
  return (
    calcGroepSlaap(g0_4, s.slaapruimte.g0_4) +
    calcGroepSlaap(g0_2, s.slaapruimte.g0_2) +
    calcGroepSlaap(g2_4, s.slaapruimte.g2_4)
  )
}

export function getSanitair(s: WizardState): {
  personeel: number; miva: number; kind: number
  toiletTotaal: number; verschoon: number; wasdroog: number; totaal: number
} {
  const groepen = getTotaalGroepen(s)
  const kindplaatsen = getTotaalKindplaatsen(s)

  const personeel = s.sanitair.personeelstoiletten * 1.08
  const miva = s.sanitair.miva * 3.83

  // Kindtoiletten: KDV = groepen×2, BSO = ceil(kindplaatsen/15)
  let aantalKindtoilet: number
  if (s.sanitair.kindtoilet.aantalPolicy === 'standaard') {
    aantalKindtoilet = s.opvangvorm === 'KDV'
      ? groepen * 2
      : Math.ceil(kindplaatsen / 15)
  } else {
    aantalKindtoilet = s.opvangvorm === 'KDV'
      ? groepen * s.sanitair.kindtoilet.aantalPerGroep
      : s.sanitair.kindtoilet.aantalTotaal
  }
  const m2Kindtoilet = s.sanitair.kindtoilet.m2Policy === 'standaard' ? 1.2 : s.sanitair.kindtoilet.m2PerToilet
  const kind = aantalKindtoilet * m2Kindtoilet

  const toiletTotaal = personeel + miva + kind

  // Verschoonruimte: KDV = groepen × m2, BSO = fixed 1 ruimte
  let verschoon: number
  if (s.opvangvorm === 'KDV') {
    const m2 = s.sanitair.verschoonruimte.policy === 'standaard' ? 3 : s.sanitair.verschoonruimte.m2PerGroep
    verschoon = groepen * m2
  } else {
    verschoon = s.sanitair.verschoonruimte.policy === 'standaard' ? 3 : s.sanitair.verschoonruimte.m2Fixed
  }

  // Was- en droogruimte: KDV = N rooms × m2, BSO = fixed 1 room
  let wasdroog: number
  if (s.opvangvorm === 'KDV') {
    const aantal = s.sanitair.wasdroog.aantalPolicy === 'standaard' ? 1 : s.sanitair.wasdroog.aantal
    const m2 = s.sanitair.wasdroog.m2Policy === 'standaard' ? 4 : s.sanitair.wasdroog.m2PerRuimte
    wasdroog = aantal * m2
  } else {
    wasdroog = s.sanitair.wasdroog.m2Policy === 'standaard' ? 4 : s.sanitair.wasdroog.m2PerRuimte
  }

  return { personeel, miva, kind, toiletTotaal, verschoon, wasdroog, totaal: toiletTotaal + verschoon + wasdroog }
}

export function getKeuken(s: WizardState): { keuken: number; pantry: number; totaal: number } {
  const groepen = getTotaalGroepen(s)
  const aantalKeuken = s.keuken.aantalPolicy === 'standaard' ? 1 : s.keuken.aantal
  const m2Keuken = s.keuken.m2Policy === 'standaard' ? 1.08 : s.keuken.m2PerKeuken
  const keuken = aantalKeuken * m2Keuken

  let pantry = 0
  if (s.opvangvorm === 'KDV') {
    const aantalPantry = s.keuken.pantry.aantalPolicy === 'standaard' ? groepen * 1 : s.keuken.pantry.aantal
    const m2Pantry = s.keuken.pantry.m2Policy === 'standaard' ? 1.1 : s.keuken.pantry.m2PerPantry
    pantry = aantalPantry * m2Pantry
  }

  return { keuken, pantry, totaal: keuken + pantry }
}

export function getKantoor(s: WizardState): {
  pauzeTeam: number; werk: number; spreek: number; totaal: number
} {
  const pauzeTeam = s.kantoor.pauzeTeam.aanwezig
    ? (s.kantoor.pauzeTeam.policy === 'standaard' ? 9 : s.kantoor.pauzeTeam.m2)
    : 0

  const werk = s.kantoor.werk.aanwezig
    ? (s.kantoor.werk.policy === 'standaard' ? 9 : s.kantoor.werk.m2)
    : 0

  let spreek = 0
  if (s.kantoor.spreek.aanwezig) {
    const base = s.kantoor.spreek.policy === 'standaard' ? 12 : s.kantoor.spreek.m2
    const extra = s.kantoor.spreek.maxVierpersonen ? 0 : s.kantoor.spreek.extraPersonen
    spreek = base + extra
  }

  return { pauzeTeam, werk, spreek, totaal: pauzeTeam + werk + spreek }
}

export function getOverig(s: WizardState): {
  buggy: number; berg: number; opslag: number; schoonmaak: number; totaal: number
} {
  const groepen = getTotaalGroepen(s)

  let buggy = 0
  if (s.opvangvorm === 'KDV') {
    const aantalBuggy = s.overig.buggy.aantalPolicy === 'standaard' ? groepen * 4 : s.overig.buggy.aantal
    const m2Buggy = s.overig.buggy.m2Policy === 'standaard' ? 0.8 : s.overig.buggy.m2PerBuggy
    buggy = aantalBuggy * m2Buggy
  }

  const m2Berg = s.overig.berg.m2Policy === 'standaard' ? 4 : s.overig.berg.m2PerRuimte
  const berg = groepen * m2Berg

  const opslag = s.overig.opslag.aanwezig ? s.overig.opslag.m2 : 0

  const m2Schoon = s.overig.schoonmaak.m2Policy === 'standaard' ? 2 : s.overig.schoonmaak.m2PerRuimte
  const schoonmaak = s.overig.schoonmaak.bouwlagen * m2Schoon

  return { buggy, berg, opslag, schoonmaak, totaal: buggy + berg + opslag + schoonmaak }
}

export function getFNO(s: WizardState): number {
  const speel = getSpeelruimte(s)
  const slaap = s.opvangvorm === 'KDV' ? getSlaapruimte(s) : 0
  const { totaal: sanitair } = getSanitair(s)
  const { totaal: keuken } = getKeuken(s)
  const { totaal: kantoor } = getKantoor(s)
  const { totaal: overig } = getOverig(s)
  return speel + slaap + sanitair + keuken + kantoor + overig
}
