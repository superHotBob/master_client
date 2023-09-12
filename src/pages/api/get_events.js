import postgres from "postgres"
const { Client } = require('pg')
export default async function handler(req, res) {
  const d = new Date()
  const curr_date = Date.now(d) 
  const client = new Client({
    user: 'client',
    host: '5.35.5.23',
    database: 'postgres',
    password: 'client123',
    port: 5432,
  })  
  await client.connect();
  const { rows } = await client.query(
   `select date_event, 
    event_text,
    master_nikname,
    event_id,       
    name,
    stars,
    address,
    services
  
    from  events 
    INNER JOIN users ON master_nikname = nikname
    where +date_event > ${curr_date}  and city = ${req.query.city}
    `)      
    if (rows.length > 0) {
      res.status(200).json(rows)
    } else {
      res.status(200).json([])
    }
}

// export default async function handler(req, res) {
//   const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)
//   const d = new Date()
//   const curr_date = Date.now(d) 
//   const result = await sql`
//         select 
//         date_event, 
//         event_text,
//         master_nikname,
//         event_id,       
//         name,
//         stars,
//         address,
//         services
      
//         from  events 
//         INNER JOIN users ON master_nikname = nikname
//         where +date_event > ${curr_date}  and city = ${req.query.city}              
//       `
//   if (result.length > 0) {
//     res.status(200).json(result)
//   } else {
//     res.status(200).json([])
//   }
// }