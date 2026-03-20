import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Check, X } from "lucide-react";

const plans = [
  {
    name: "Starter",
    target: "Small Towns & Districts",
    price: "$499/mo",
    annually: "or $399/mo annually",
    features: [
      "Core AI Grievance Routing",
      "Basic Analytics Dashboard",
      "1,000 Requests/Month",
      "Email Support",
      "2 User Seats",
    ],
    button: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Professional",
    badge: "Most Popular",
    target: "Mid-sized Cities & Counties",
    price: "$1,299/mo",
    annually: "or $1,038/mo annually",
    features: [
      "Advanced Geospatial Intelligence",
      "Real-time Triage Automation",
      "10,000 Requests/Month",
      "Two-Factor Authentication (2FA)",
      "Priority Email & Chat Support",
      "10 User Seats",
      "Custom Reporting",
    ],
    button: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    target: "Large Metropolitan Areas & States",
    price: "Custom",
    annually: "",
    features: [
      "Full API Access & Integration",
      "Dedicated Account Management",
      "On-premise Deployment Options",
      "Unlimited Requests",
      "Advanced Security & Compliance",
      "24/7 Phone Support",
      "Unlimited User Seats",
      "Custom AI Model Training",
    ],
    button: "Contact Sales",
    highlighted: false,
  },
];

const PricingSection = () => {
  return (
    <section className="py-24 relative overflow-hidden" id="pricing">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60 brightness-[0.4]"
        >
          <source src="/bg5.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="section-badge mx-auto mb-6">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Implementation Plans</span>
          </div>
          <h2 className="section-heading mb-4">Scalable Solutions for Government</h2>
          <p className="section-subtext">
            Choose the plan that fits your administrative scope and resolution goals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className={`glass-card p-10 flex flex-col relative transition-all duration-500 hover:translate-y-[-8px] ${
                plan.highlighted 
                  ? "border-white/50 ring-[3px] ring-white/10 shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)] bg-gradient-to-b from-white/[0.05] to-transparent z-10 scale-105" 
                  : "hover:border-primary/20"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white text-black text-[10px] font-bold tracking-tighter uppercase shadow-lg shadow-white/10">
                  {plan.badge}
                </div>
              )}
              <div className="text-center mb-10">
                <h3 className="text-2xl font-display font-bold text-foreground mb-1">{plan.name}</h3>
                <p className="text-[11px] text-muted-foreground mb-8 uppercase tracking-widest">{plan.target}</p>
                <div className="flex flex-col items-center">
                  <div className={`text-5xl font-display font-bold mb-1 ${plan.highlighted ? "text-white" : "text-foreground"}`}>
                    {plan.price}
                  </div>
                  {plan.annually && (
                    <p className="text-[10px] text-muted-foreground font-medium bg-muted/50 px-3 py-1 rounded-full border border-border/50">
                      {plan.annually}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-10 flex-1 border-t border-border/50 pt-10">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Check className={`w-4 h-4 shrink-0 ${plan.highlighted ? "text-white" : "text-primary"}`} />
                    <span className="text-xs text-foreground/80 font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href="/contact"
                className={`${
                  plan.highlighted 
                    ? "bg-white hover:bg-white/90 text-black shadow-xl shadow-white/10" 
                    : "cta-button"
                } inline-flex items-center justify-center gap-3 font-bold px-8 py-5 rounded-2xl transition-all duration-300 text-xs tracking-wider uppercase group w-full h-14`}
              >
                {plan.button}
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
