const { Client } = require('pg')

export default async function handler(req, res) {
 
  const client = new Client(process.env.pg_data)

  await client.connect();

  const { rows } = await client.query(`
    select *
    from "orders"
    where "master" = $1 and "order_month" = $2 and "year" = $3
  `,[req.query.nikname,req.query.month,req.query.year])

  await client.end()

  if (rows.length>0) {
    res.status(200).json(rows)
  } else {
    res.status(200).json([])
  }

}