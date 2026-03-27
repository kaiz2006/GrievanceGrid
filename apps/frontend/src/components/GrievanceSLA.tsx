import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';

interface GrievanceSLAProps {
  createdAt: string;
  slaDurationHours?: number;
}

const GrievanceSLA = ({ createdAt, slaDurationHours = 24 }: GrievanceSLAProps) => {
  const [timeComponents, setTimeComponents] = useState({ h: '00', m: '00', s: '00' });
  const [progress, setProgress] = useState(0);
  const [isBreached, setIsBreached] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      try {
        if (!createdAt) {
          setTimeComponents({ h: '--', m: '--', s: '--' });
          setProgress(0);
          setIsBreached(false);
          return;
        }

        const created = new Date(createdAt).getTime();
        if (isNaN(created)) {
          console.warn('GrievanceSLA: Invalid date string', createdAt);
          setTimeComponents({ h: '--', m: '--', s: '--' });
          setProgress(0);
          setIsBreached(false);
          return;
        }

        const totalSLA = slaDurationHours * 60 * 60 * 1000;
        const deadline = created + totalSLA;
        const now = new Date().getTime();
        const difference = deadline - now;

        if (difference <= 0) {
          setTimeComponents({ h: '00', m: '00', s: '00' });
          setProgress(100);
          setIsBreached(true);
          return;
        }

        // Calculate HH:MM:SS
        const hours = Math.max(0, Math.floor((difference / (1000 * 60 * 60))));
        const minutes = Math.max(0, Math.floor((difference / (1000 * 60)) % 60));
        const seconds = Math.max(0, Math.floor((difference / 1000) % 60));

        setTimeComponents({
          h: String(hours).padStart(2, '0').slice(0, 2),
          m: String(minutes).padStart(2, '0').slice(0, 2),
          s: String(seconds).padStart(2, '0').slice(0, 2),
        });

        // Percentage: (Elapsed / Total) * 100
        const elapsed = now - created;
        const p = Math.min(Math.max(0, (elapsed / totalSLA) * 100), 100);
        setProgress(p);
        setIsBreached(false);
      } catch (error) {
        console.error('Error calculating SLA time:', error);
        setTimeComponents({ h: '--', m: '--', s: '--' });
        setProgress(0);
        setIsBreached(false);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [createdAt, slaDurationHours]);

  const Digit = ({ value }: { value: string }) => (
    <div className="relative overflow-hidden h-14 w-[0.75em] flex items-center justify-center bg-white/[0.03] rounded-lg border border-white/5 mx-[1px]">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="absolute font-black"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );

  const Colon = () => (
    <div className="flex flex-col gap-2 mx-1 opacity-20">
      <div className="w-1.5 h-1.5 rounded-full bg-current" />
      <div className="w-1.5 h-1.5 rounded-full bg-current" />
    </div>
  );

  return (
    <div className="p-6 rounded-[2rem] bg-black/40 border border-white/5 shadow-2xl space-y-6 relative overflow-hidden group">
      {/* Subtle scanline effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent pointer-events-none animate-scanline" />

      <div className="flex items-center justify-between relative z-10">
        <h4 className="text-[10px] font-black uppercase text-blue-500 tracking-[0.25em]">
          SLA Operational Status
        </h4>
        <Clock
          className={`w-4 h-4 ${isBreached ? 'text-red-500 animate-pulse' : 'text-blue-500'}`}
        />
      </div>

      <div className="text-center relative z-10">
        <div className={`text-5xl ${isBreached ? 'text-red-500/80' : 'text-white'} font-mono flex items-center justify-center`}>
          <div className="flex">
            <Digit value={timeComponents.h[0]} />
            <Digit value={timeComponents.h[1]} />
          </div>
          <Colon />
          <div className="flex">
            <Digit value={timeComponents.m[0]} />
            <Digit value={timeComponents.m[1]} />
          </div>
          <Colon />
          <div className="flex">
            <Digit value={timeComponents.s[0]} />
            <Digit value={timeComponents.s[1]} />
          </div>
        </div>
        <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest mt-2">
          {isBreached ? 'SLA Breached - Escalated' : 'Time Remaining for Deployment'}
        </p>
      </div>

      <div className="space-y-3 relative z-10">
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
          <span className="text-muted-foreground group-hover:text-blue-400 transition-colors">
            Grid Progress
          </span>
          <span className={isBreached ? 'text-red-500' : 'text-blue-500 font-mono'}>
            {progress > 0 ? `${Math.round(progress)}%` : '--%'}
          </span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
          {progress > 0 && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={`h-full relative ${isBreached ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]'}`}
              transition={{ duration: 0.1, ease: 'linear' }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </motion.div>
          )}
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground/40 leading-relaxed italic border-t border-white/5 pt-4">
        Resolution guaranteed within {slaDurationHours} hours as per City Council SLA Protocol V2.1.
      </p>
    </div>
  );
};

export default GrievanceSLA;
