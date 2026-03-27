import * as dotenv from "dotenv";
import { db } from "./index";

dotenv.config({ path: ".env.local" });

async function testConnection() {
  console.log("Testing database connection...");
  
  try {
    const result = await db.execute`SELECT 1 as test`;
    console.log("✅ Database connection successful!");
    console.log("Result:", result);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

testConnection().then(() => {
  process.exit(0);
});
