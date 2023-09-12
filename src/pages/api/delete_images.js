const { Client } = require('pg')

export default async function handler(req, res) {

  
  const client = new Client(process.env.pg_data)  
  await client.connect()

  const { rows } = await client.query(`  
      delete from "images"
      where id = $1 
    `,[req.query.id]
  );
  if (rows.length) {
    res.status(200).json(rows)
  } else {
    res.json([])
  }

}