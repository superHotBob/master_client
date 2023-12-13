const { Client } = require('pg')


export default async function handler(req, res) { 
  const client = new Client(process.env.pg_data)
  await client.connect();
  const { my_city } = req.query.city
  const { rows } = await client.query(`
    SELECT city,country,state 
    FROM city 
    where city LIKE $1  
    order by city 
    `,[my_city]) 

  await client.end()  
  return res.json(rows)  
}