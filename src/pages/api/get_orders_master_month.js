const { Client } = require('pg')

export default async function handler(req, res) {
 
  const client = new Client(process.env.pg_data)

  await client.connect();
  const mon = '%' + req.query.month + '%'   
  const { rows } = await client.query(`
    select date_order
    from "orders"
    where master = $1 and date_order like $2
  `,[req.query.nikname,mon]);
  await client.end();
  if (rows.length>0) {
    res.status(200).json(rows)
  } else {
    res.status(500).json([])
  }

}