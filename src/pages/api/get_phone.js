const { Client } = require('pg')

export default async function handler(req, res) {

  const client = new Client(process.env.pg_data)

  await client.connect();

  const { rows } = await client.query(`
    select phone
    from  "clients"      
    where "nikname" =  $1  and "confid" = true             
  `, [req.query.name]);

   await client.end()

  

  if (rows.length > 0) {
    res.status(200).send(rows[0].phone)
  } else {
    res.status(200).send('XXXXXXXXXXX')
  }

}