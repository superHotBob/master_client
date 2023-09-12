import postgres from "postgres"
const { Client } = require('pg')

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)

  const client = new Client({
    user: 'client',
    host: '5.35.5.23',
    database: 'postgres',
    password: 'client123',
    port: 5432,
  })

  await client.connect();

  if (req.query.abonent === 'администратор') {
    const result = await sql`
      update adminchat 
      set read = 'true'    
      where sendler_nikname =  ${req.query.abonent} and recipient_nikname = ${req.query.nikname}             
    `

    await client.query(`
      UPDATE "adminchat"
      SET "read" = $1 
      where "sendler_nikname" =  $2 and recipient_nikname = $3
      `, [true, req.query.abonent, req.query.nikname]
    );  
    res.send('Ok')
  } else {
     await sql`
      update chat 
      set read = 'true'    
      where sendler_nikname =  ${req.query.abonent} and recipient_nikname = ${req.query.nikname}             
    `
    await client.query(`
      UPDATE "chat"
      SET "read" = $1 
      where "sendler_nikname" =  $2 and recipient_nikname = $3
      `, [true, req.query.abonent, req.query.nikname]
    );  
    
    res.send('Ok')
  }
}