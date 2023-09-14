const { Client } = require('pg')

export default async function handler(req, res) {  
  
  const date = Date.now()
  const client = new Client(process.env.pg_data)
  await client.connect();
  const { rows } = await client.query(`
      SELECT MAX("rating") from images
      where "nikname" = $1`,[req.body.nikname]
  ); 
  let my_rat = rows[0]['max'] ? +rows[0]['max'] + 1 : 1
  
  const { rows:id } = await client.query(
    `INSERT INTO "images" ("nikname","service","city","img_date","master_name", "rating")  
      VALUES ($1,$2,$3,$4,$5,$6)
      returning id
    `, [req.body.nikname,req.body.service,req.body.city,date,req.body.master_name,my_rat ]
    
  ); 

  

  client.end();
 
  res.send(id[0]['id'])



  
  
}