const { Client } = require('pg')

export default async function handler(req, res) {

  
  const client = new Client(process.env.pg_data)

  await client.connect()
  
  const { rows:result } = await client.query(`
    select id, review
    from  "images"       
    where nikname =  $1   and  service = $2
  `,[req.query.nikname, 'sertificat']);

  

  await client.end();
  if (result.length > 0) {
    res.status(200).json(result)
  } else {
    res.status(500).json([])
  }
}