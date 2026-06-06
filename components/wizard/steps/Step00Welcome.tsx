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
          en huisvestingskosten in verschillende scenario&apos;s inzichtelijk maakt.
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

      <div className="bg-muted/40 border border-border rounded-xl p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-foreground">Invoergegevens vooraf verzamelen?</p>
          <p className="text-xs text-muted-foreground mt-0.5">Download het invultemplate om alle benodigde gegevens op te halen.</p>
        </div>
        <a href="/template-invoergegevens.pdf" download className="shrink-0">
          <Button variant="outline" size="sm">Download template</Button>
        </a>
      </div>

      <div className="bg-muted/40 border border-border rounded-xl p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-foreground">Welke standaardwaarden worden gehanteerd?</p>
          <p className="text-xs text-muted-foreground mt-0.5">Download een overzicht van alle standaardwaarden, normen en bronnen die de tool gebruikt.</p>
        </div>
        <a href="/overzicht-standaardwaarden.pdf" download className="shrink-0">
          <Button variant="outline" size="sm">Download toelichting</Button>
        </a>
      </div>

      <Button size="lg" className="w-full text-base py-6" onClick={() => setStep(1)}>
        Start stappenplan →
      </Button>
    </div>
  )
}
