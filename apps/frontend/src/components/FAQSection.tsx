import { ShieldCheck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How does automated routing ensure accountability?",
    a: "Every grievance is tagged with a unique ID and instantly assigned to the relevant department based on AI-classified category and location. Timestamps and audit trails ensure every hand-off is logged and monitorable.",
  },
  {
    q: "Is citizen data protected and secure?",
    a: "Yes. GrievanceGrid uses state-of-the-art encryption and complies with international data privacy standards for government data, ensuring all personal information remains confidential.",
  },
  {
    q: "Can it integrate with our existing municipal portals?",
    a: "Absolutely. Our robust API allows for seamless integration with existing website forms, mobile apps, and legacy database systems.",
  },
  {
    q: "How are citizens updated on their grievance status?",
    a: "Citizens receive automated notifications via SMS and email at every milestone—from intake to department assignment and final resolution.",
  },
  {
    q: "Does the system support geo-tagging for complaints?",
    a: "Yes. Citizens can pinpoint exact locations on a map for issues like road repairs or sanitation, allowing for precise routing and geo-analytics.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60 brightness-[0.4]"
        >
          <source src="/bg7.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-3xl">
        <div className="text-center mb-16">
          <div className="section-badge mx-auto mb-6">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Infrastructure FAQ</span>
          </div>
          <h2 className="section-heading mb-4">Common Questions</h2>
          <p className="section-subtext">
            Everything you need to know about the GrievanceGrid platform.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="glass-card px-6 border-border/50 rounded-2xl overflow-hidden"
            >
              <AccordionTrigger className="text-sm font-display font-semibold text-foreground hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
