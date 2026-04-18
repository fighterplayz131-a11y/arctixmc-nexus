import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useStore } from "@/lib/store-context";
import { HelpCircle } from "lucide-react";

export function SupportFAQ() {
  const { settings } = useStore();
  const faqs = settings.faqs ?? [];
  if (!faqs.length) return null;
  return (
    <div className="rounded-xl bg-card/60 border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="h-5 w-5 text-primary" />
        <h2 className="font-display text-lg font-bold text-foreground">Frequently Asked Questions</h2>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`f-${i}`} className="border-border">
            <AccordionTrigger className="text-left text-sm font-medium hover:text-primary">{f.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export function TicketStatusTracker({ status }: { status: string }) {
  const steps = [
    { key: "open", label: "Submitted" },
    { key: "in_progress", label: "In Progress" },
    { key: "closed", label: "Resolved" },
  ];
  const currentIdx = Math.max(0, steps.findIndex((s) => s.key === status));
  return (
    <div className="flex items-center gap-2 my-4" aria-label="Ticket status">
      {steps.map((s, i) => {
        const done = i <= currentIdx;
        return (
          <div key={s.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-colors ${
                done ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border"
              }`}>{i + 1}</div>
              <div className={`text-[10px] mt-1 uppercase tracking-wider ${done ? "text-primary" : "text-muted-foreground"}`}>{s.label}</div>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 flex-1 -mt-4 transition-colors ${i < currentIdx ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
