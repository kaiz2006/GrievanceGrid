const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL);

async function fixEnums() {
  console.log('Adding values to enums...');
  
  const enums = [
    { type: 'auth_type', value: 'GOOGLE_OAUTH' },
    { type: 'auth_type', value: 'JWT' },
    { type: 'user_role', value: 'DEPT_HEAD' },
    { type: 'user_role', value: 'CREW' },
    { type: 'user_role', value: 'AUDITOR' }
  ];

  for (const item of enums) {
    try {
      // Check if value exists first to avoid errors
      const result = await sql`
        SELECT 
          n.nspname AS enum_schema,  
          t.typname AS enum_name,  
          e.enumlabel AS enum_value
        FROM pg_type t 
        JOIN pg_enum e ON t.oid = e.enumtypid  
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = ${item.type} AND e.enumlabel = ${item.value}
      `;
      
      if (result.length === 0) {
        await sql.unsafe(`ALTER TYPE ${item.type} ADD VALUE '${item.value}'`);
        console.log(`Successfully added ${item.value} to ${item.type}`);
      } else {
        console.log(`${item.value} already exists in ${item.type}`);
      }
    } catch (e) {
      console.error(`Error adding ${item.value} to ${item.type}:`, e.message);
    }
  }
}

fixEnums()
  .then(() => {
    console.log('Done.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
