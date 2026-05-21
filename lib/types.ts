export type Opvangvorm = 'KDV' | 'BSO'
export type Policy = 'standaard' | 'eigen'
export type GedeeldOptie = 'geheel' | 'deel' | 'niks'

export interface KdvGroups {
  g0_4: number
  g0_2: number
  g2_4: number
}

export interface BsoGroups {
  g4_12: number
  g4_6: number
  g7_12: number
}

export interface SpeelruimteState {
  policy: 'wettelijk' | 'eigen'
  m2PerKindplaats: number
}

export interface SlaapruimteGroepState {
  aantalPolicy: Policy
  aantalPerGroep: number
  m2Policy: Policy
  m2PerRuimte: number
}

export interface SlaapruimteState {
  g0_4: SlaapruimteGroepState
  g0_2: SlaapruimteGroepState
  g2_4: SlaapruimteGroepState
}

export interface KindtoiletState {
  aantalPolicy: Policy
  aantalPerGroep: number  // KDV
  aantalTotaal: number    // BSO eigen beleid
  m2Policy: Policy
  m2PerToilet: number
}

export interface SanitairState {
  personeelstoiletten: number
  miva: number
  kindtoilet: KindtoiletState
  verschoonruimte: { policy: Policy; m2PerGroep: number; m2Fixed: number }
  wasdroog: { aantalPolicy: Policy; aantal: number; m2Policy: Policy; m2PerRuimte: number }
}

export interface PantryState {
  aantalPolicy: Policy
  aantal: number
  m2Policy: Policy
  m2PerPantry: number
}

export interface KeukenState {
  aantalPolicy: Policy
  aantal: number
  m2Policy: Policy
  m2PerKeuken: number
  pantry: PantryState
}

export interface KantoorRuimteItem {
  aanwezig: boolean
  policy: Policy
  m2: number
}

export interface SpreekruimteState extends KantoorRuimteItem {
  maxVierpersonen: boolean
  extraPersonen: number
}

export interface KantoorState {
  pauzeTeam: KantoorRuimteItem
  werk: KantoorRuimteItem
  spreek: SpreekruimteState
}

export interface BuggyState {
  aantalPolicy: Policy
  aantal: number
  m2Policy: Policy
  m2PerBuggy: number
}

export interface OverigState {
  buggy: BuggyState
  berg: { m2Policy: Policy; m2PerRuimte: number }
  opslag: { aanwezig: boolean; m2: number }
  schoonmaak: { bouwlagen: number; m2Policy: Policy; m2PerRuimte: number }
}

export interface OndersteunendState {
  verkeersPolicy: Policy
  verkeerspct: number
  techPolicy: Policy
  techPct: number
}

export interface RendementState {
  bezettingsgraadPolicy: Policy
  bezettingsgraad: number
  uurtariefPolicy: Policy
  uurtarief: number
  opvangurenPolicy: Policy
  opvanguren: number
  huisvestingspctPolicy: Policy
  huisvestingspct: number
}

export interface GedeeldRuimte {
  gedeeld: boolean
  optie: 'geheel' | 'deel'
  m2: number
  // For toiletruimten sub-split
  toiletSplit?: {
    personeel: { gedeeld: boolean; aantal: number }
    kind: { gedeeld: boolean; aantal: number }
    miva: { gedeeld: boolean; aantal: number }
  }
}

export interface KostenState {
  known: boolean
  kostenPerM2BVO: number
}

export interface HuursomState {
  rentePolicy: Policy
  rente: number
  exploitatiePolicy: 'basisscenario' | 'eigen'
  exploitatiekosten: number
}

export interface WizardState {
  step: number
  opvangvorm: Opvangvorm | null
  groups: { kdv: KdvGroups; bso: BsoGroups }
  speelruimte: SpeelruimteState
  slaapruimte: SlaapruimteState
  sanitair: SanitairState
  keuken: KeukenState
  kantoor: KantoorState
  overig: OverigState
  ondersteunend: OndersteunendState
  gedeeld: Record<string, GedeeldRuimte>
  kosten: KostenState
  huursom: HuursomState
  rendement: RendementState
  setStep: (step: number) => void
  setOpvangvorm: (v: Opvangvorm) => void
  setGroups: (groups: Partial<WizardState['groups']>) => void
  setSpeelruimte: (v: Partial<SpeelruimteState>) => void
  setSlaapruimteGroep: (key: keyof SlaapruimteState, v: Partial<SlaapruimteGroepState>) => void
  setSanitair: (v: Partial<SanitairState>) => void
  setKeuken: (v: Partial<KeukenState>) => void
  setKantoor: (v: Partial<KantoorState>) => void
  setOverig: (v: Partial<OverigState>) => void
  setOndersteunend: (v: Partial<OndersteunendState>) => void
  setGedeeld: (key: string, v: Partial<GedeeldRuimte>) => void
  setKosten: (v: Partial<KostenState>) => void
  setHuursom: (v: Partial<HuursomState>) => void
  setRendement: (v: Partial<RendementState>) => void
  reset: () => void
}
