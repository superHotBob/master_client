const { Client } = require('pg')

export default async function handler(req, res) {
  const client = new Client(process.env.pg_data)

  await client.connect();

  const {rows: result } = await client.query(`
    select address,locations,name,tema,text,status, stars,currency
      from "masters"
    where "nikname" = $1 
  `,[req.query.nikname]);
  
  await client.end();
  if (result.length >0 ) {
    res.status(200).json(result[0]) 
  } else {
    res.status(500).send([])
  }
  
}