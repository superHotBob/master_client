const { Client } = require('pg')
export default async function handler(req, res) {
  let new_date = Date.parse(req.body.event_date)
  const client = new Client(process.env.pg_data)  
  await client.connect();
  await client.query(
    `INSERT INTO "events" ("master_nikname", "date_event","event_text")  
    VALUES ($1, $2, $3)`, [req.body.nikname, new_date,req.body.text]);  
  await client.end()  
  res.status(200).json([])
}