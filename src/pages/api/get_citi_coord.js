const { Client } = require('pg')


export default async function handler(req, res) { 
  const client = new Client(process.env.pg_data)
  await client.connect()
  const { rows } = await client.query(`SELECT lat,lon FROM "city" where city = $1`,[req.query.city])  
  await client.end()  
  let coord = JSON.stringify(rows[0])
  res.setHeader('Set-Cookie', `city=${coord}; Expires=Wed, 21 Oct 2025 07:28:00 GMT; Path=/`)  
  return res.json(rows)  
}