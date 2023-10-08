const { Client } = require('pg')

export default async function handler(req, res) { 
  const client = new Client(process.env.pg_data)
  await client.connect();
  const { rows } = await client.query(`
    SELECT key
    FROM "clients" 
    where "nikname" = $1
  `,[req.query.nikname])

  await client.end() 

  if (rows.length > 0) {
    res.status(200).send(rows[0].key)
  } else {
    res.status(500).json([])
  }
}