import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe } from "lucide-react";
import Shuffle from "../Shuffle";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-32 pb-12 px-6 relative">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Left Side: Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-widest mb-6">
                <MessageSquare className="w-3.5 h-3.5" />
                Get in Touch
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
                Let's Build a <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Smarter City</span> Together
              </h1>
              
              <p className="text-lg text-muted-foreground mb-12 max-w-lg leading-relaxed">
                Have questions about our enterprise features, SLA implementation, or general inquiries? Our team is here to help you optimize your city's service grid.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-blue-500">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Email Us</h4>
                    <p className="text-muted-foreground">partnerships@grievancegrid.gov</p>
                    <p className="text-xs text-blue-500 font-bold mt-1 uppercase tracking-widest">Response within 2 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-blue-500">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Call for Support</h4>
                    <p className="text-muted-foreground">+1 (888) GRID-CITY</p>
                    <p className="text-xs text-blue-500 font-bold mt-1 uppercase tracking-widest">Mon - Fri, 9am - 6pm EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-blue-500">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">HQ Location</h4>
                    <p className="text-muted-foreground">1200 Innovation Way, Suite 400<br />New York City, NY 10001</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side: Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-8 md:p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <h3 className="text-2xl font-bold mb-8">Send a Message</h3>
              
              <form className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="john@city.gov"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Interest Area</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium appearance-none">
                    <option className="bg-[#050505]">Enterprise Solutions</option>
                    <option className="bg-[#050505]">SLA Automation</option>
                    <option className="bg-[#050505]">Public Partnership</option>
                    <option className="bg-[#050505]">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Message</label>
                  <textarea 
                    rows={4}
                    placeholder="How can we help you?"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium resize-none"
                  ></textarea>
                </div>

                <button className="w-full py-5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center justify-center gap-3">
                  <Send className="w-5 h-5" />
                  Contact Our Team
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
