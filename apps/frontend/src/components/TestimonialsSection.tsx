import { Moon, Quote } from "lucide-react";

const testimonials = [
  { quote: "Before this, we were juggling spreadsheets and manual updates. Now everything's automated.", name: "Emma Foster", role: "Marketing Manager, BrightWave" },
  { quote: "Truly impressive. The AI assistant is fast, accurate, and blends into our daily ops without friction.", name: "Liam Harrison", role: "Project Manager, CloudCore" },
  { quote: "Routine tasks are now fully automated, and we can focus on strategic work that really moves the needle.", name: "Noah Mitchell", role: "AI Engineer, SmartOps" },
  { quote: "Their predictive analytics helped us forecast trends more accurately than our previous tools.", name: "Sophia Collins", role: "UX/UI Lead, DesignHive" },
  { quote: "The AI assistant is fast, accurate, and blends into our daily ops without friction.", name: "Ethan Parker", role: "Head of Product, FlowWorks" },
  { quote: "Their predictive analytics helped us forecast trends more accurately than our previous tools.", name: "Olivia Bennet", role: "CMO at GreenTech" },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-badge mx-auto mb-6">
            <Moon className="w-4 h-4 text-primary" />
            <span>Testimonials</span>
          </div>
          <h2 className="section-heading mb-4">Real People. Real Results</h2>
          <p className="section-subtext">
            Find quick answers to the most common support questions
          </p>
        </div>
      </div>

      {/* Scrolling rows */}
      <div className="space-y-6">
        <div className="overflow-hidden">
          <div className="flex marquee gap-6">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="flex-shrink-0 w-[400px] glass-card p-6">
                <Quote className="w-5 h-5 text-primary/40 mb-4" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="flex marquee-reverse gap-6">
            {[...testimonials.slice(3), ...testimonials.slice(3)].map((t, i) => (
              <div key={i} className="flex-shrink-0 w-[400px] glass-card p-6">
                <Quote className="w-5 h-5 text-primary/40 mb-4" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
