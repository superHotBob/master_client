const { Client } = require('pg')

export default async function handler(req, res) {  
  const client = new Client(process.env.pg_data)

  await client.connect();
  const { rows } = await client.query(`
        select * 
        from "events" 
        where "master_nikname" = $1   and "date_event" >= $2              
      `,[req.query.nikname,Date.now()])

  await client.end();    
  if (rows.length > 0) {
    res.status(200).json(rows)
  } else {
    res.status(200).json([])
  }
}