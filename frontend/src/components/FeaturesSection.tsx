"use client";

import TiltedCard from "./TiltedCard";

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Smart Routing",
    description: "AI-powered keyword categorization instantly routes complaints to the right department with priority tagging.",
    color: "text-accent-light",
    bgColor: "bg-accent/10",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    title: "Real-Time Tracking",
    description: "Citizens track their complaint lifecycle in real-time with live status updates and notifications.",
    color: "text-new-status",
    bgColor: "bg-new-status/10",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "SLA Engine",
    description: "Configurable SLA timers with auto-escalation rules ensure every grievance is resolved on time.",
    color: "text-critical",
    bgColor: "bg-critical/10",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Geo-Mapping",
    description: "Heatmap-based complaint visualization pinpoints crisis zones for targeted resource deployment.",
    color: "text-pending",
    bgColor: "bg-pending/10",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Command Center",
    description: "A mission-control dashboard with live KPIs, department analytics, and escalation alerts.",
    color: "text-resolved",
    bgColor: "bg-resolved/10",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Smart Assignment",
    description: "Workload-aware officer assignment with AI-suggested routing and drag-and-drop task management.",
    color: "text-accent-glow",
    bgColor: "bg-accent-glow/10",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="section-padding relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="features-title mb-16 ">
          <div className="text-center">
            <span className="inline-block text-sm font-semibold text-accent-light tracking-wider uppercase mb-4">
              Platform Features
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-10">
              Built for Intelligent Governance
            </h2>
          </div>
          <div className="flex justify-center">
  <p className="mt-10 text-lg text-text-secondary max-w-2xl text-center">
    Every feature designed to make public service faster, smarter, and more transparent.
  </p>
</div>
        </div>

        {/* Grid */}
        <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <TiltedCard
              key={i}
              containerHeight="auto"
              containerWidth="100%"
              imageWidth="100%"
              imageHeight="100%"
              scaleOnHover={1.05}
              rotateAmplitude={10}
              showMobileWarning={false}
              showTooltip={false}
            >
              <div
                className="feature-card p-6 md:p-8 rounded-2xl group cursor-pointer transition-all duration-300 hover:-translate-y-2 flex flex-col space-y-4"
                style={{
                  background: 'rgba(30, 41, 59, 0.8)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {/* Icon Container */}
                <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center ${feature.color} transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                  {feature.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-white">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Hover underline */}
                <div className="mt-4 h-0.5 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r from-transparent via-accent-light to-transparent rounded-full" />
              </div>
            </TiltedCard>
          ))}
        </div>
      </div>
    </section>
  );
}
