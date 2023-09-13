const { Client } = require('pg')

export default async function handler(req, res) {
 
  const client = new Client(process.env.pg_data)

  await client.connect();

  const { rows } = await client.query(`
    select
    COUNT(*) 
    from "orders"
    where "master" = $1 and read = false
  `,[req.query.nikname]);

  let count = rows[0].count


  client.end() 
  res.status(200).send(count)
  

}