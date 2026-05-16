import type { Opvangvorm } from './types'

export interface StepDef {
  index: number
  label: string
  shortLabel: string
}

export function getSteps(opvangvorm: Opvangvorm | null): StepDef[] {
  const steps: StepDef[] = [
    { index: 0, label: 'Welkom', shortLabel: 'Start' },
    { index: 1, label: 'Opvangvorm', shortLabel: 'Opvangvorm' },
    { index: 2, label: 'Groepen maken', shortLabel: 'Groepen' },
    { index: 3, label: 'Speelruimte', shortLabel: 'Speelruimte' },
  ]

  if (opvangvorm === 'KDV' || opvangvorm === null) {
    steps.push({ index: 4, label: 'Slaapruimte', shortLabel: 'Slaapruimte' })
  }

  steps.push(
    { index: 5, label: 'Sanitair', shortLabel: 'Sanitair' },
    { index: 6, label: 'Keuken', shortLabel: 'Keuken' },
    { index: 7, label: 'Kantoorruimte', shortLabel: 'Kantoor' },
    { index: 8, label: 'Overige ruimten', shortLabel: 'Overig' },
    { index: 9, label: 'Ondersteunende ruimten', shortLabel: 'Ondersteuning' },
  )

  if (opvangvorm === 'BSO') {
    steps.push({ index: 10, label: 'Gedeelde ruimten', shortLabel: 'Gedeeld' })
  }

  steps.push(
    { index: 11, label: 'Kosten (€/m² BVO)', shortLabel: 'Kosten' },
    { index: 12, label: 'Huursom', shortLabel: 'Huursom' },
    { index: 13, label: 'Resultaat', shortLabel: 'Resultaat' },
  )

  return steps
}

export function getNextStep(current: number, opvangvorm: Opvangvorm | null): number {
  // Skip step 4 (Slaapruimte) for BSO
  if (current === 3 && opvangvorm === 'BSO') return 5
  // Skip step 10 (Gedeelde ruimten) for KDV
  if (current === 9 && opvangvorm === 'KDV') return 11
  return current + 1
}

export function getPrevStep(current: number, opvangvorm: Opvangvorm | null): number {
  if (current === 5 && opvangvorm === 'BSO') return 3
  if (current === 11 && opvangvorm === 'KDV') return 9
  return current - 1
}
