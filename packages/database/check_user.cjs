const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL);

async function checkUser() {
  const result = await sql`
    SELECT id, email, name, role, auth_type 
    FROM users 
    WHERE email = 'thakuraaryan2006@gmail.com'
  `;
  console.log(JSON.stringify(result, null, 2));
}

checkUser().finally(() => process.exit());
