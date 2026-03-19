import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Create PostgreSQL connection pool
const connectionString = process.env.DATABASE_URL || "postgresql://grievances:grievances@localhost:5432/grievances";

console.log("[Database] Connecting to:", connectionString.replace(/password[^@]*/, "password:***"));

const pool = new Pool({
  connectionString: connectionString,
  // Ensure password is properly parsed
  ssl: false,
});

// Create Drizzle ORM instance
export const db = drizzle(pool, { schema });

// Export schema types
export * from "./schema";

// Export Drizzle functions
export { eq, and, or, like, inArray, between } from "drizzle-orm";
