import { motion } from "framer-motion";
import { Moon, Cpu, LineChart, Link2, Users, HeadphonesIcon, Trophy } from "lucide-react";

const reasons = [
  { icon: Cpu, title: "Intelligent Automation", desc: "Streamline tasks and productivity effortlessly, saving time and reducing human errors." },
  { icon: LineChart, title: "AI-Powered Insights", desc: "Make smarter decisions with data-driven recommendations and actionable, real-time." },
  { icon: Link2, title: "Seamless Integrations", desc: "Connect with your favorite tools and platforms easily, creating a unified, efficient workflow." },
  { icon: Users, title: "User-Centric Design", desc: "Enjoy an intuitive, easy-to-use interface built for efficiency and enhanced team collaboration." },
  { icon: HeadphonesIcon, title: "Reliable Support", desc: "Access dedicated help whenever you need guidance or assistance, ensuring uninterrupted." },
  { icon: Trophy, title: "Proven Results", desc: "Trusted by thousands of users and businesses worldwide for measurable success and growth." },
];

const WhyChooseUs = () => {
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
          <source src="/bg4.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="section-badge mx-auto mb-6">
            <Moon className="w-4 h-4 text-primary" />
            <span>Why Choose Us</span>
          </div>
          <h2 className="section-heading mb-4">Building the future of work</h2>
          <p className="section-subtext">
            Task AI Management was founded by a team of productivity hackers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reasons.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-8 group hover:border-primary/30 transition-colors"
            >
              <div className="feature-icon mb-5">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-display font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
