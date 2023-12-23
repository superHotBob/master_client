const { Client } = require('pg')

export default async function handler(req, res) {

  const client = new Client(process.env.pg_data)

  await client.connect();

  const { rows } = await client.query(`
    select address_full , currency
    from  "masters"      
    where "nikname" =  $1              
  `, [req.query.nikname]);

  await client.end() 

  if (rows.length > 0) {
    res.status(200).json(rows[0])
  } else {
    res.status(500).json([])
  }

}