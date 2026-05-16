'use client'

import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'

export function Step00Welcome() {
  const { setStep } = useStore()

  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Welkom</p>
        <h1 className="text-2xl font-bold text-foreground mb-3 leading-tight">
          Rekentool Huisvestingskosten Kinderopvang
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Welkom bij de rekentool die transparantie in de huisvestingskosten per kindplaats biedt
          en realistische huisvestingskosten in verschillende scenario&apos;s inzichtelijk maakt.
        </p>
      </div>

      <div className="bg-primary/8 border border-primary/20 rounded-xl p-5 text-sm text-foreground leading-relaxed">
        Omschrijf in het volgende stappenplan zo precies mogelijk uw bestaande of gewenste situatie
        voor een zo accuraat mogelijk resultaat.
      </div>

      <div className="bg-muted/60 border border-border rounded-xl p-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Kanttekening</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          De gebruikte waardes zijn gebaseerd op wet- en regelgeving en het Kwaliteitskader Kinderopvang.
          De uitkomsten van deze tool zijn indicatief en kunnen afwijken van de uiteindelijke werkelijkheid.
        </p>
      </div>

      <Button size="lg" className="w-full text-base py-6" onClick={() => setStep(1)}>
        Start stappenplan →
      </Button>
    </div>
  )
}
