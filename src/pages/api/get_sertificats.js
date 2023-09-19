const { Client } = require('pg')

export default async function handler(req, res) {

  
  const client = new Client(process.env.pg_data)

  await client.connect()
  
  const { rows } = await client.query(`
    select *
    from  "images"       
    where "nikname" =  $1   and  "service" = $2
  `,[req.query.nikname, 'sertificat']);

  console.log(rows)

  await client.end();
  if (rows.length > 0) {
    res.status(200).json(rows)
  } else {
    res.status(500).json([])
  }
}