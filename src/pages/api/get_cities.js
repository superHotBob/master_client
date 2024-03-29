const { Client } = require('pg')


export default async function handler(req, res) { 
  const client = new Client(process.env.pg_data)
  await client.connect();
  const { rows } = await client.query( `
    SELECT city, country, state  
    FROM city 
    WHERE  LOWER (city)  like $1 and state like $2
    ORDER by city `,[req.query.city + '%', req.query.mystate + '%'])  
  await client.end()  
  return res.json(rows)  
}