import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Line,
} from "recharts";

export interface SectorOperationalPoint {
  sector: string;
  incoming: number;
  resolved: number;
  slaRisk: number;
}

interface SectorOperationalChartProps {
  data: SectorOperationalPoint[];
}

const getLoadBand = (slaRisk: number): "critical" | "warning" | "nominal" => {
  if (slaRisk >= 70) return "critical";
  if (slaRisk >= 40) return "warning";
  return "nominal";
};

const labelClassByBand = {
  critical: "text-red-500",
  warning: "text-amber-500",
  nominal: "text-emerald-500",
} as const;

const panelByBand = {
  critical: "border-red-500/15 bg-red-500/[0.07]",
  warning: "border-amber-500/15 bg-amber-500/[0.07]",
  nominal: "border-emerald-500/15 bg-emerald-500/[0.07]",
} as const;

const SectorOperationalChart = ({ data }: SectorOperationalChartProps) => {
  const counters = data.reduce(
    (acc, item) => {
      const band = getLoadBand(item.slaRisk);
      acc[band] += 1;
      return acc;
    },
    { critical: 0, warning: 0, nominal: 0 }
  );

  return (
    <div className="space-y-5">
      <div className="h-[255px] rounded-2xl border border-white/5 bg-black/35 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 14, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="incomingFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.35} />
              </linearGradient>
              <linearGradient id="resolvedFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.85} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.25} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.07)" vertical={false} />

            <XAxis
              dataKey="sector"
              tick={{ fill: "rgba(255,255,255,0.58)", fontSize: 10, fontWeight: 700 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
            />

            <YAxis
              yAxisId="tickets"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={34}
            />

            <YAxis
              yAxisId="risk"
              orientation="right"
              domain={[0, 100]}
              tick={{ fill: "rgba(245,158,11,0.9)", fontSize: 10, fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
              width={34}
            />

            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              contentStyle={{
                background: "rgba(5, 5, 5, 0.96)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "10px",
                fontSize: "12px",
              }}
            />

            <Bar yAxisId="tickets" dataKey="incoming" name="Incoming" radius={[6, 6, 0, 0]} fill="url(#incomingFill)" />
            <Bar yAxisId="tickets" dataKey="resolved" name="Resolved" radius={[6, 6, 0, 0]} fill="url(#resolvedFill)" />
            <Line
              yAxisId="risk"
              type="monotone"
              dataKey="slaRisk"
              name="SLA Risk %"
              stroke="#f59e0b"
              strokeWidth={2.2}
              dot={{ r: 3.5, fill: "#f59e0b", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#fbbf24" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className={`rounded-xl border p-3 text-center ${panelByBand.critical}`}>
          <p className={`text-xl font-black italic ${labelClassByBand.critical}`}>{counters.critical}</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/80">Critical</p>
        </div>
        <div className={`rounded-xl border p-3 text-center ${panelByBand.warning}`}>
          <p className={`text-xl font-black italic ${labelClassByBand.warning}`}>{counters.warning}</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/80">Warning</p>
        </div>
        <div className={`rounded-xl border p-3 text-center ${panelByBand.nominal}`}>
          <p className={`text-xl font-black italic ${labelClassByBand.nominal}`}>{counters.nominal}</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/80">Nominal</p>
        </div>
      </div>
    </div>
  );
};

export default SectorOperationalChart;