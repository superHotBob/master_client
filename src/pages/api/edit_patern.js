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
  await client.query(
   `UPDATE "schedule" 
    SET "patern" = $1
    where "nikname" = $2
    `,[req.body.patern,req.body.nikname]);
  
     
  
  const result = await sql`
        update schedule 
        set patern = ${req.body.patern}    
        where nikname =  ${req.body.nikname}  
        returning *      
      `
  if (result.length > 0) {
    res.status(200).json(result[0])
  } else {
    res.status(500).json({message:'Error'})
  }
}