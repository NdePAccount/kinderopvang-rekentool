import { create } from 'zustand'
import type { WizardState, SpeelruimteState, SlaapruimteState, SlaapruimteGroepState, SanitairState, KeukenState, KantoorState, OverigState, OndersteunendState, GedeeldRuimte, KostenState, HuursomState, Opvangvorm } from './types'

const initialState: Omit<WizardState, 'setStep' | 'setOpvangvorm' | 'setGroups' | 'setSpeelruimte' | 'setSlaapruimteGroep' | 'setSanitair' | 'setKeuken' | 'setKantoor' | 'setOverig' | 'setOndersteunend' | 'setGedeeld' | 'setKosten' | 'setHuursom' | 'reset'> = {
  step: 0,
  opvangvorm: null,
  groups: {
    kdv: { g0_4: 0, g0_2: 0, g2_4: 0 },
    bso: { g4_12: 0, g4_6: 0, g7_12: 0 },
  },
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
    pantry: { aantalPolicy: 'standaard', aantal: 1, m2Policy: 'standaard', m2PerPantry: 1.1 },
  },
  kantoor: {
    pauzeTeam: { aanwezig: true, policy: 'standaard', m2: 9 },
    werk: { aanwezig: false, policy: 'standaard', m2: 9 },
    spreek: { aanwezig: false, policy: 'standaard', m2: 12, maxVierpersonen: true, extraPersonen: 1 },
  },
  overig: {
    buggy: { aantalPolicy: 'standaard', aantal: 4, m2Policy: 'standaard', m2PerBuggy: 0.8 },
    berg: { m2Policy: 'standaard', m2PerRuimte: 4 },
    opslag: { aanwezig: false, m2: 0 },
    schoonmaak: { bouwlagen: 1, m2Policy: 'standaard', m2PerRuimte: 2 },
  },
  ondersteunend: { techPolicy: 'standaard', techPct: 15 },
  gedeeld: {},
  kosten: { known: false, kostenPerM2BVO: 4158 },
  huursom: { rentePolicy: 'standaard', rente: 3.5, exploitatiePolicy: 'basisscenario', exploitatiekosten: 113 },
}

export const useStore = create<WizardState>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setOpvangvorm: (opvangvorm: Opvangvorm) => set((s) => ({
    opvangvorm,
    kosten: { ...s.kosten, kostenPerM2BVO: opvangvorm === 'BSO' ? 3829 : 4158 },
    huursom: { ...s.huursom, exploitatiekosten: opvangvorm === 'BSO' ? 95 : 113 },
  })),
  setGroups: (groups) => set((s) => ({ groups: { ...s.groups, ...groups } })),
  setSpeelruimte: (v: Partial<SpeelruimteState>) => set((s) => ({ speelruimte: { ...s.speelruimte, ...v } })),
  setSlaapruimteGroep: (key: keyof SlaapruimteState, v: Partial<SlaapruimteGroepState>) => set((s) => ({
    slaapruimte: { ...s.slaapruimte, [key]: { ...s.slaapruimte[key], ...v } },
  })),
  setSanitair: (v: Partial<SanitairState>) => set((s) => ({ sanitair: { ...s.sanitair, ...v } })),
  setKeuken: (v: Partial<KeukenState>) => set((s) => ({ keuken: { ...s.keuken, ...v } })),
  setKantoor: (v: Partial<KantoorState>) => set((s) => ({ kantoor: { ...s.kantoor, ...v } })),
  setOverig: (v: Partial<OverigState>) => set((s) => ({ overig: { ...s.overig, ...v } })),
  setOndersteunend: (v: Partial<OndersteunendState>) => set((s) => ({ ondersteunend: { ...s.ondersteunend, ...v } })),
  setGedeeld: (key, v: Partial<GedeeldRuimte>) => set((s) => ({
    gedeeld: { ...s.gedeeld, [key]: { ...s.gedeeld[key], ...v } as GedeeldRuimte },
  })),
  setKosten: (v: Partial<KostenState>) => set((s) => ({ kosten: { ...s.kosten, ...v } })),
  setHuursom: (v: Partial<HuursomState>) => set((s) => ({ huursom: { ...s.huursom, ...v } })),
  reset: () => set({ ...initialState }),
}))
