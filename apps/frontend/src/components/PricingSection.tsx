import { motion } from "framer-motion";
import { Moon, ArrowRight, Check, X } from "lucide-react";

const plans = [
  {
    name: "Starter",
    badge: "Popular",
    price: "$999",
    desc: "Perfect for small businesses getting started with digital marketing.",
    features: [
      { text: "1 Campaign", included: true },
      { text: "Monthly Reports", included: true },
      { text: "Email Support", included: false },
      { text: "Priority Support", included: false },
      { text: "4x Revisions", included: false },
    ],
    highlighted: false,
  },
  {
    name: "Growth",
    badge: "Most Popular",
    price: "$2,999",
    desc: "For brands ready to scale fast with full-service marketing.",
    features: [
      { text: "1 Campaign", included: true },
      { text: "Monthly Reports", included: true },
      { text: "Email Support", included: true },
      { text: "Priority Support", included: false },
      { text: "4x Revisions", included: false },
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    badge: "Customized Solutions",
    price: "$3,200",
    desc: "Perfect for small businesses getting started with digital marketing.",
    features: [
      { text: "1 Campaign", included: true },
      { text: "Monthly Reports", included: true },
      { text: "Email Support", included: true },
      { text: "Priority Support", included: true },
      { text: "4x Revisions", included: true },
    ],
    highlighted: false,
  },
];

const PricingSection = () => {
  return (
    <section className="py-24 relative" id="pricing">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-badge mx-auto mb-6">
            <Moon className="w-4 h-4 text-primary" />
            <span>Pricing Plan</span>
          </div>
          <h2 className="section-heading mb-4">Flexible Plans For Every Stage</h2>
          <p className="section-subtext">
            Live dashboards and custom reports that surface the insights you need—instantly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className={`glass-card p-8 flex flex-col ${
                plan.highlighted ? "border-primary/50 ring-1 ring-primary/20" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-display font-semibold text-foreground">{plan.name}</span>
                <span className="text-[10px] px-3 py-1 rounded-full bg-muted text-muted-foreground tracking-wider uppercase">
                  {plan.badge}
                </span>
              </div>
              <div className="text-4xl font-display font-bold text-foreground mb-2">{plan.price}</div>
              <p className="text-sm text-muted-foreground mb-8">{plan.desc}</p>

              <div className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-3">
                    {f.included ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground/40" />
                    )}
                    <span className={`text-sm ${f.included ? "text-foreground" : "text-muted-foreground/40"}`}>
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href="#"
                className={`${plan.highlighted ? "cta-button-primary" : "cta-button"} justify-center text-xs group`}
              >
                GET STARTED
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
