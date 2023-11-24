const { Client } = require('pg')

export default async function handler(req, res) {  
  const { nikname, service, city, master_name, review} = req.body
  
  const date = Date.now()
  const client = new Client(process.env.pg_data)
  await client.connect();
  const { rows } = await client.query(`
    SELECT MAX("rating"), Count(*) from images
    where "nikname" = $1`,[nikname]
  ); 

  if(rows[0]['count']>100) {
    await client.end();
 
    res.send(0)
    return;
  }
  let my_rat = rows[0]['max'] ? +rows[0]['max'] + 1 : 1

  
  
  
  const { rows:id } = await client.query(`
    INSERT INTO "images" (nikname,service,city,img_date,master_name,rating,review)  
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      returning id
    `, [nikname, service, city, date, master_name, my_rat, review ]
    
  ); 
 
  

  await client.end();
 
  res.send({'id': id[0]['id'] ,'count': rows[0]['count'] })



  
  
}