const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL);

async function updateUser() {
  const result = await sql`
    UPDATE users 
    SET role = 'ADMIN' 
    WHERE email = 'thakuraaryan2006@gmail.com'
    RETURNING id, email, role
  `;
  console.log(JSON.stringify(result, null, 2));
}

updateUser().finally(() => process.exit());
