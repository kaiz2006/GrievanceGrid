const stats = [
  { value: "10K+", label: "Complaints Resolved" },
  { value: "<30s", label: "Auto-Assign Time" },
  { value: "90%+", label: "SLA Compliance" },
];

export default function HeroSection() {
  return (
    <>
      {/* ── Fixed video layer — stays pinned behind everything ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.82 }}
        >
          <source src="/Background.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for text readability */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.42)" }} />
      </div>

      {/* ── Hero section — scrolls normally over the fixed video ── */}
      <section
        className="relative flex flex-col items-center justify-center"
        style={{ minHeight: "100vh", zIndex: 10, paddingTop: 64 }}
      >
        {/* Content block */}
        <div
          className="w-full max-w-7xl mx-auto flex flex-col items-center text-center px-6"
        >

          {/* Title */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] tracking-tight mb-6 max-w-5xl text-white drop-shadow-lg">
            Transforming Public Service.<br />
            One Grievance at a Time.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mb-16 leading-relaxed font-light drop-shadow-md">
            An intelligent command center that captures, routes, and resolves
            citizen complaints with real-time transparency and AI-powered
            automation.
          </p>

          {/* Removed CTA from here, moved to Navbar */}


          {/* Stat tabs */}
          <div className="w-full max-w-5xl mt-12 pb-24">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-7">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="stat-card-glow flex-1 w-full"
                  style={{ animationDelay: `${i * 0.8}s` }}
                >
                  <div className="stat-card-inner flex flex-col items-center px-6 py-7 hover:bg-black/50 transition-colors duration-300">
                    <div className="text-4xl sm:text-5xl font-serif text-white mb-2 drop-shadow-md">
                      {stat.value}
                    </div>
                    <div className="text-sm sm:text-base text-white/70 font-medium tracking-wide uppercase">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
