const { Client } = require('pg')

export default async function handler(req, res) { 
  const client = new Client(process.env.pg_data)
  await client.connect();
  const { rows } = await pgclient.query(`
    UPDATE "clients"
    SET "saved_image" = $1 
    WHERE "nikname" = $2
    returning "id" 
  `, [req.body.image, req.body.nikname]
  );
  
  await client.end(); 

  if (rows.length > 0) {
    res.status(200).json(rows[0].image)
  } else {
    res.status(500).json({message:'Error'})
  }
}