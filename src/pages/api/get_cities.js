const { Client } = require('pg')


export default async function handler(req, res) { 
  const client = new Client(process.env.pg_data)
  await client.connect();
  const { rows } = await client.query('SELECT * FROM "city"')  
  await client.end()  
 
  return res.json(rows) 
  
}