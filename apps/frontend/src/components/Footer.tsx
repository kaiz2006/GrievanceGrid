import { ShieldCheck, Twitter, Instagram, Linkedin, Github } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "Integrations", "Changelog"],
  Resources: ["Documentation", "Tutorials", "Blog", "Support"],
  Company: ["About", "Careers", "Contact", "Partners"],
};

const Footer = () => {
  return (
    <footer className="relative pt-24 pb-48 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="glass-card p-12 md:p-20 rounded-[3rem] border-white/5 bg-card/40 backdrop-blur-2xl">
          <div className="grid md:grid-cols-12 gap-16 mb-20">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <span className="text-2xl font-display font-bold text-foreground tracking-tight">GrievanceGrid</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-10">
                GrievanceGrid empowers public administrators to transform citizen complaints 
                into actionable insights — making resolution faster, transparent, and more accountable.
              </p>
              <div className="flex items-center gap-6 text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category}>
                  <h4 className="text-sm font-display font-bold text-foreground mb-8 tracking-wide">
                    {category}
                  </h4>
                  <ul className="space-y-4">
                    {links.map((link) => (
                      <li key={link}>
                        <a 
                          href="#" 
                          className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1 inline-block"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-xs text-muted-foreground/60 font-medium">
              © 2025 GrievanceGrid. All rights reserved.
            </p>
            <div className="flex items-center gap-8">
              <a href="#" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors underline-offset-4 hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors underline-offset-4 hover:underline">
                Terms of Service
              </a>
              <a href="#" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors underline-offset-4 hover:underline">
                Cookies Settings
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-[15vw] font-black text-white/5 select-none pointer-events-none tracking-tight opacity-90">
        GrievanceGrid
      </div>
    </footer>
  );
};

export default Footer;
