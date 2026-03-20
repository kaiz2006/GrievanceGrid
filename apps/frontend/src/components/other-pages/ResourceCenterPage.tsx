import { motion } from "framer-motion";
import { BookOpen, FileText, Video, MessageCircle, HelpCircle, Download } from "lucide-react";

const resources = [
  { title: "Administrator Guide", icon: BookOpen, type: "Documentation" },
  { title: "Citizen Engagement API", icon: FileText, type: "Technical" },
  { title: "Case Resolution Training", icon: Video, type: "Video" },
  { title: "SLA Best Practices", icon: Download, type: "PDF" },
  { title: "Admin Community", icon: MessageCircle, type: "Forum" },
  { title: "Support FAQ", icon: HelpCircle, type: "Help" },
];

const ResourceCenterPage = () => {
  return (
    <div className="pt-8 lg:pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Resource Center</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Everything you need to master the GrievanceGrid ecosystem.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, i) => (
          <motion.div
            key={resource.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-blue-600/[0.05] hover:border-blue-600/20 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                <resource.icon className="w-6 h-6 text-muted-foreground group-hover:text-blue-500 transition-colors" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 group-hover:text-blue-500/60">
                {resource.type}
              </span>
            </div>
            <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors mb-2">{resource.title}</h3>
            <p className="text-sm text-muted-foreground/60 leading-relaxed">
              Updated 2 days ago
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ResourceCenterPage;
