const { Client } = require('pg')

export default async function handler(req, res) {

  const client = new Client(process.env.pg_data)

  await client.connect();
  const { rows } = await client.query(`
    select id,master,master_name,date_order,neworder,order_month,price,read,review,myorder
    from "orders"
    where "client" = $1 
    order by id desc 
  `,[req.query.nikname]);

   await client.end();

  if (rows.length > 0) {
    res.status(200).json(rows)
  } else {
    res.status(500).json([])
  }

}