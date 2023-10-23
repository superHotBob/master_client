const { Client } = require('pg')

export default async function handler(req, res) {    
  let month = req.query.month
  const client = new Client(process.env.pg_data)
  await client.connect();
  const { rows } = await client.query(`
    select ${month} from  "schedule"       
    where "nikname" = $1 and "year" = $2
    `, [req.query.nikname,req.query.year]);  
  
  if ( rows.length > 0) {
    await client.end();
    res.status(200).json(rows[0][month]);
  } else {
    await client.end();
    res.status(200).json([])
  };
}