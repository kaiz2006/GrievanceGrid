import { Moon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Why is a strong brand identity or website important?",
    a: "A robust brand identity and website serve as the face of your business, shaping how it is perceived by potential customers. They not only convey professionalism but also establish trust and credibility, vital factors in today's competitive market.",
  },
  {
    q: "Can I use Task AI with my existing tools?",
    a: "Yes! Tash AI integrates seamlessly with your existing tools, allowing you to automate workflows, synchronize data, and boost team productivity effortlessly across every project and task.",
  },
  {
    q: "Is Tash AI suitable for individuals or only teams?",
    a: "Tash AI is designed for both individuals and teams. It scales to meet personal productivity needs while supporting collaborative workflows for businesses of all sizes efficiently.",
  },
  {
    q: "Do I need to be tech-savvy to use Tash AI?",
    a: "No, you don't need to be tech-savvy. Tash AI offers an intuitive, user-friendly interface, guiding you through automation and productivity features effortlessly.",
  },
  {
    q: "What happens after the free trial?",
    a: "After the free trial, you can choose a paid plan that fits your needs, unlocking full features, integrations, and ongoing support for seamless productivity and enhanced team collaboration.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <div className="section-badge mx-auto mb-6">
            <Moon className="w-4 h-4 text-primary" />
            <span>Common Questions</span>
          </div>
          <h2 className="section-heading mb-4">Got questions? We've got answers.</h2>
          <p className="section-subtext">
            Find quick answers to the most common support questions
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
