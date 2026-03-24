const logos = [
  "Streamline", "NexGen", "CloudBase", "DataFlow", "Synthetix", "Orbiter", "Quantum"
];

const LogoMarquee = () => {
  return (
    <section className="py-16 border-y border-border/30">
      <p className="text-center text-xs tracking-[0.3em] uppercase text-muted-foreground mb-10">
        Trusted by the World's Largest Companies
      </p>
      <div className="overflow-hidden">
        <div className="flex marquee whitespace-nowrap">
          {[...logos, ...logos].map((logo, i) => (
            <div
              key={i}
              className="flex-shrink-0 mx-12 text-2xl font-display font-bold text-muted-foreground/30"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoMarquee;
