const { Client } = require('pg')

export default async function handler(req, res) {
  const client = new Client(process.env.pg_data)

  await client.connect();
 

  const { rows } = await client.query(`
  insert into "orders" (
    master, client, neworder, price, date_order,master_name,client_name,order_month
  ) values ( $1,$2,$3,$4,$5,$6,$7,$8 )  
  `,[req.body.master,req.body.client,req.body.order,
      req.body.price,req.body.date,req.body.master_name,req.body.client_name,req.body.month]) 

  client.end()    
  res.send('Ok')
}