const { Client } = require('pg')

export default async function handler(req, res) {  
  const client = new Client(process.env.pg_data)

  await client.connect();
  const { rows } = await client.query(`
        select  date_event,event_id, event_text     
        from "events" 
        where master_nikname = $1   and date_event >= $2              
      `,[req.query.nikname,Date.now()])

  await client.end();    
  if (rows.length) {
    res.status(200).json(rows[0])
  } else {
    res.status(200).json({})
  }
}