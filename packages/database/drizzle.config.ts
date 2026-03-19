import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "postgresql://grievances:grievances@localhost:5432/grievances",
  },
  tablesFilter: ["public.*"],
} satisfies Config;
