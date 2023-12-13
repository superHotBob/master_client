const { Client } = require('pg')


export default async function handler(req, res) { 
  const client = new Client(process.env.pg_data)
  await client.connect();
  const { rows } = await client.query( `
    SELECT state,country, lat, lon  
    FROM states 
    WHERE  LOWER (state)  like $1 
    ORDER by state `,[req.query.state + '%'])  
  await client.end()  
  return res.json(rows)  
}