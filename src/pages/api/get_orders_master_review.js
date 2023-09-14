const { Client } = require('pg')

export default async function handler(req, res) {

  
  const client = new Client(process.env.pg_data)

  await client.connect();

  const { rows } = await client.query(`
    select *
    from "orders"
    where "master" = $1 and "review" is not NULL
  `,[req.query.nikname])

  client.end()
  
  if (rows.length) {
    res.status(200).json(rows)
  } else {
    res.status(200).json([])
  }

}