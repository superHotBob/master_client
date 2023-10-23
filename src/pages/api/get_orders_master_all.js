const { Client } = require('pg')

export default async function handler(req, res) {
 
  const client = new Client(process.env.pg_data)

  await client.connect();

  const { rows } = await client.query(`
    select *
    from "orders"
    where "master" = $1 
    order by "id" desc
  `,[req.query.nikname])

   await client.end() 
    res.status(200).json(rows)
}