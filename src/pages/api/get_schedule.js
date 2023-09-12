const { Client } = require('pg')


export default async function handler(req, res) {

  
  let month = req.query.month
  const client = new Client(process.env.pg_data)
  await client.connect();
 

  const { rows } = await client.query(
    `select ${month} 
    from  "schedule"       
    where "nikname" = $1 
    `, [req.query.nikname]
  );

  
  if ( rows[0][month].length) {
    client.end();
    res.status(200).json(rows[0][month])
  } else {
  const { rows } = await client.query(`
      select ${month}
      from "schedule"       
      where "nikname" =  $1             
      `,[req.query.nikname]);

  client.end();
  res.status(200).json(rows[0][month])
  }

}