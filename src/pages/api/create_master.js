// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const { Client } = require('pg')

export default async function handler(req, res) {
  
  const client = new Client(process.env.pg_data)
  await client.connect();
 
  const master = {
    nikname: req.body.nikname,
    name: req.body.name,
    text: req.body.text,
    phone: req.body.phone,
    id: req.body.id,
    currency: 'BYN',
    color: req.body.color
  }

  const { rows } = await client.query(`
    SELECT *
    FROM "clients" 
    WHERE "nikname" = $1
  `,[req.body.nikname]);

  

  master['name'] = rows[0].name
  master['text'] = rows[0].text
  master['id'] = rows[0].id
  master['phone'] = rows[0].phone
 
 
  const { rows: new_master } = await client.query(
    `INSERT INTO "masters" ("phone", "nikname","name","text")  
    VALUES ($1,$2,$3,$4)
    returning *`
    , [master.phone,req.body.nikname,master.name,master.text]    
  ); 
  

  if (rows.length > 0) { 
    
    await client.query(`
      UPDATE "clients" 
      SET "status" = $2 
      WHERE "nikname" = $1
    `,[master.nikname,"master"]
    )    
    await client.query(
      `INSERT INTO "services" ("nikname")  
      VALUES ($1)`, [req.body.nikname]
    ) 
    await client.query(
      `INSERT INTO "schedule" ("nikname")  
      VALUES ($1)`, [req.body.nikname]
    ) 
    await client.end();
    res.status(200).send(new_master)
  } else {
    res.status(400).end('Error')
  }
}