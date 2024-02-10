const { Client } = require('pg')
export default async function handler(req, res) {
  const d = new Date()
  const curr_date = Date.now(d) 
  const client = new Client(process.env.pg_data)  
  await client.connect();
  const { rows } = await client.query(
   `select date_event, 
    event_text,
    master_nikname,
    id,       
    name,
    stars,
    address,
    services
  
    from  "events" 
    INNER JOIN "masters" ON master_nikname = nikname
    where +date_event > $1  and state = $2
    `,[curr_date,req.query.state]);

    await client.end();

    if (rows.length > 0) {
      res.status(200).json(rows)
    } else {
      res.status(200).json([])
    }
}

