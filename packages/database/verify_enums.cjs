const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL);

async function verifyEnums() {
  const result = await sql`
    SELECT n.nspname, t.typname, e.enumlabel 
    FROM pg_type t 
    JOIN pg_enum e ON t.oid = e.enumtypid 
    JOIN pg_namespace n ON n.oid = t.typnamespace 
    WHERE t.typname IN ('auth_type', 'user_role')
    ORDER BY n.nspname, t.typname, e.enumlabel
  `;
  console.log(JSON.stringify(result, null, 2));
}

verifyEnums().finally(() => process.exit());
