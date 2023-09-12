const { Client } = require('pg')
export default async function handler(req, res) {
  let new_date = Date.parse(req.body.event_date)
  const client = new Client({
    user: 'client',
    host: '5.35.5.23',
    database: 'postgres',
    password: 'client123',
    port: 5432,
  })  
  await client.connect();
  await client.query(
    `INSERT INTO "events" ("master_nikname", "date_event","event_text")  
    VALUES ($1, $2,$3)`, [req.body.nikname, new_date,req.body.text]);  
  res.status(200).json([])
}