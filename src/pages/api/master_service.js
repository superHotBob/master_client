const { Client } = require('pg')

export default async function handler(req, res) {
  const client = new Client(process.env.pg_data)

  await client.connect();
  
  const { rows } = await client.query(
    `SELECT маникюр, брови,массаж,педикюр,стрижка,ресницы,депиляция,прически,макияж,барбер,чистка,окрашивание
     FROM "services"
    WHERE "nikname" = $1
    
  `,[req.query.nikname]);

 
 
  if (rows.length  > 0) {
    await client.end();  
    res.status(200).json(rows) 
  } else {
    await client.end();  
    res.status(200).json([])
  }  
}