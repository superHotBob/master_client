const { Client } = require('pg')

export default async function handler(req, res) { 
  const client = new Client({
    user: 'client',
    host: '5.35.5.23',
    database: 'postgres',
    password: 'client123',
    port: 5432,
  })
  await client.connect();
  const { rows } = await client.query('SELECT * FROM "city"')  
  res.status(200).json(rows) 
}