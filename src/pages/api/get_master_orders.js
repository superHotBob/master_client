const { Client } = require('pg')

export default async function handler(req, res) {

  
  const client = new Client(process.env.pg_data)

  await client.connect()
  
  const { rows } = await client.query(`
    select date_order 
    from  "orders"       
    where "master" = $1 and "order_month" = $2
  `,[req.query.nikname,req.query.month]);
 

  await client.end();
  if (rows.length > 0) {
    res.status(200).json(rows.map(i=>i.date_order.split(',')))
  } else {
    res.status(200).json([])
  }
}