const { Client } = require('pg')

export default async function handler(req, res) {

  const client = new Client(process.env.pg_data)

  await client.connect();

  const { rows } = await client.query(`
    delete from  "orders"        
    where "id" = $1
    returning *
  `, [req.body.id])

  await client.query(`
    update "clients" 
    set "rating" = rating - 1
    where "nikname" = $1
  `, [req.body.nikname])

  await client.query(`
    update "masters" 
    set "rating" = rating - 1
    where nikname = $1
  `, [req.body.nikname])

  client.end()

  if (rows.length > 0) {
    res.end('Заказ удален')
  } else {
    res.end(null)
  }

}