import { ShieldCheck, Quote } from "lucide-react";

const testimonials = [
  { quote: "GrievanceGrid transformed how we handle water supply issues. Resolution time dropped by 40%.", name: "David K.", role: "Commissioner, Public Works" },
  { quote: "The geo-analytics dashboard allowed us to pinpoint sanitation gaps that we didn't even know existed.", name: "Anita S.", role: "City Council Member" },
  { quote: "I finally feel like my complaints are being heard. The SMS updates are a game-changer for transparency.", name: "Rajesh M.", role: "Citizen" },
  { quote: "Seamless integration with our legacy ERP. The automated routing is flawless.", name: "Sarah J.", role: "IT Director, State Services" },
  { quote: "Accountability is at an all-time high. We can now track every officer's response rate in real time.", name: "Mayor Robert L.", role: "Administrative Lead" },
  { quote: "The public dashboard has significantly improved trust between the city and its residents.", name: "Elena V.", role: "Public Relations Officer" },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-badge mx-auto mb-6">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Success Stories</span>
          </div>
          <h2 className="section-heading mb-4">Driving Change in Public Service</h2>
          <p className="section-subtext">
            See how cities are using GrievanceGrid to solve real-world citizen issues.
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
