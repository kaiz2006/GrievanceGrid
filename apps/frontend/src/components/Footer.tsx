import { Moon } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "Integration", "Changelog"],
  Company: ["About us", "Blog", "Careers", "Contact"],
  Resources: ["Documentation", "Help Center", "Community", "API"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

const Footer = () => {
  return (
    <footer className="border-t border-border/30 py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Moon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-lg font-display font-bold text-foreground">Infranex.</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Smarter task management powered by AI.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-display font-semibold text-foreground mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Infranex. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Twitter</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">LinkedIn</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
