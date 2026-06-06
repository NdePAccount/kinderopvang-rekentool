import type { WizardState } from './types'
import { getTotaalGroepen, getTotaalKindplaatsen } from './calculations'

export function validateStep(step: number, s: WizardState): string | null {
  switch (step) {
    case 1: // Opvangvorm
      if (!s.opvangvorm) return 'Selecteer een opvangvorm.'
      return null

    case 2: { // Groepen
      const groepen = getTotaalGroepen(s)
      if (groepen === 0) return 'Voer minimaal één groep in.'
      return null
    }

    case 3: { // Speelruimte
      if (s.speelruimte.policy === 'eigen' && s.speelruimte.m2PerKindplaats < 3.5)
        return 'Minimale speelruimte is 3,5 m² per kindplaats.'
      return null
    }

    case 4: { // Slaapruimte (KDV only)
      if (s.opvangvorm !== 'KDV') return null
      const keys = ['g0_4', 'g0_2', 'g2_4'] as const
      for (const key of keys) {
        const g = s.slaapruimte[key]
        if (g.aantalPolicy === 'eigen' && g.aantalPerGroep < 1)
          return 'Minimaal 1 slaapruimte per groep.'
      }
      return null
    }

    case 5: { // Sanitair
      if (s.sanitair.personeelstoiletten < 1) return 'Minimaal 1 personeelstoilet vereist.'
      if (s.sanitair.miva < 1) return 'Minimaal 1 MIVA toilet vereist.'
      if (s.sanitair.kindtoilet.aantalPolicy === 'eigen') {
        const groepen = getTotaalGroepen(s)
        if (s.opvangvorm === 'KDV' && s.sanitair.kindtoilet.aantalPerGroep < 2)
          return 'Minimaal 2 kindtoiletten per groep.'
        if (s.opvangvorm === 'BSO' && s.sanitair.kindtoilet.aantalTotaal < 1)
          return 'Minimaal 1 kindtoilet vereist.'
        groepen // suppress unused warning
      }
      if (s.sanitair.kindtoilet.m2Policy === 'eigen' && s.sanitair.kindtoilet.m2PerToilet < 1.2)
        return 'Minimale oppervlakte per kindtoilet is 1,2 m².'
      if (s.opvangvorm === 'BSO') {
        if (s.sanitair.verschoonruimte.policy === 'eigen' && s.sanitair.verschoonruimte.m2Fixed < 0)
          return 'Oppervlakte verschoonruimte mag niet negatief zijn.'
        if (s.sanitair.wasdroog.m2Policy === 'eigen' && s.sanitair.wasdroog.m2PerRuimte < 0)
          return 'Oppervlakte was- en droogruimte mag niet negatief zijn.'
      }
      return null
    }

    case 6: { // Keuken
      if (s.keuken.aantalPolicy === 'eigen' && s.keuken.aantal < 1)
        return 'Minimaal 1 keuken vereist.'
      if (s.keuken.m2Policy === 'eigen' && s.keuken.m2PerKeuken < 1.08)
        return 'Minimale keukenoppervlakte is 1,08 m².'
      if (s.opvangvorm === 'KDV') {
        if (s.keuken.pantry.m2Policy === 'eigen' && s.keuken.pantry.m2PerPantry < 1.1)
          return 'Minimale pantryoppervlakte is 1,1 m².'
      }
      return null
    }

    case 7: { // Kantoor
      const { pauzeTeam, werk, spreek } = s.kantoor
      if (!pauzeTeam.aanwezig && !werk.aanwezig && !spreek.aanwezig)
        return 'Minimaal één kantoorruimte vereist.'
      if (pauzeTeam.aanwezig && pauzeTeam.policy === 'eigen' && pauzeTeam.m2 < 9)
        return 'Minimale pauze-/teamruimte is 9 m².'
      if (werk.aanwezig && werk.policy === 'eigen' && werk.m2 < 9)
        return 'Minimale werkruimte is 9 m².'
      if (spreek.aanwezig && spreek.policy === 'eigen' && spreek.m2 < 12)
        return 'Minimale spreekruimte is 12 m².'
      return null
    }

    case 8: { // Overig
      if (s.opvangvorm === 'KDV') {
        const groepen = getTotaalGroepen(s)
        if (s.overig.buggy.aantalPolicy === 'eigen' && s.overig.buggy.aantal < groepen * 4)
          return `Minimaal ${groepen * 4} buggy's/kinderwagens vereist (${groepen} groepen × 4).`
        if (s.overig.buggy.m2Policy === 'eigen' && s.overig.buggy.m2PerBuggy < 0.8)
          return 'Minimale oppervlakte per buggy is 0,8 m².'
      }
      if (s.overig.berg.m2Policy === 'eigen' && s.overig.berg.m2PerRuimte < 4)
        return 'Minimale bergruimte is 4 m².'
      if (s.overig.schoonmaak.bouwlagen < 1)
        return 'Minimaal 1 bouwlaag vereist.'
      if (s.overig.schoonmaak.m2Policy === 'eigen' && s.overig.schoonmaak.m2PerRuimte < 2)
        return 'Minimale schoonmaakruimte is 2 m².'
      if (s.overig.opslag.aanwezig && s.overig.opslag.m2 <= 0)
        return 'Voer een oppervlakte in voor de aanvullende opslagruimte.'
      return null
    }

    case 9: { // Ondersteunende ruimten
      if (s.ondersteunend.techPolicy === 'eigen' && s.ondersteunend.techPct < 10)
        return 'Minimale toeslag is 10%.'
      return null
    }

    case 10: // Gedeelde ruimten (BSO) - always passable
      return null

    case 11: { // Kosten
      if (s.kosten.known && s.kosten.kostenPerM2BVO < 3000)
        return 'Minimale investeringskosten zijn €3.000 per m² BVO.'
      return null
    }

    case 12: { // Huursom
      if (s.huursom.rentePolicy === 'eigen' && s.huursom.rente <= 0)
        return 'Rente moet groter zijn dan 0%.'
      if (s.huursom.exploitatiePolicy === 'eigen' && s.huursom.exploitatiekosten <= 0)
        return 'Exploitatiekosten moeten groter zijn dan 0.'
      return null
    }

    case 13: { // Rendement
      const r = s.rendement
      if (r.bezettingsgraadPolicy === 'eigen' && (r.bezettingsgraad <= 0 || r.bezettingsgraad > 100))
        return 'Bezettingsgraad moet tussen 0% en 100% liggen.'
      if (r.uurtariefPolicy === 'eigen' && r.uurtarief <= 0)
        return 'Uurtarief moet groter zijn dan 0.'
      if (r.opvangurenPolicy === 'eigen' && r.opvanguren <= 0)
        return 'Opvanguren per maand moeten groter zijn dan 0.'
      if (r.huisvestingspctPolicy === 'eigen' && (r.huisvestingspct <= 0 || r.huisvestingspct > 100))
        return 'Huisvestingspercentage moet tussen 0% en 100% liggen.'
      return null
    }

    default:
      return null
  }
}
