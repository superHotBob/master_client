const { Client } = require('pg')

export default async function handler(req, res) {

  
  const client = new Client(process.env.pg_data)  
  await client.connect();

  const { rows }= await client.query(`
        update "images"
        set "rating" = $1    
        where id =  $2 
        returning *      
      `,[req.query.rating,req.query.id]);

  await client.end();    
  if (rows.length > 0) {
    res.status(200).json(rows[0])
  } else {
    res.status(500).json({message:'Error'})
  }
}