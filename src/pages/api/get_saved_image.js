const { Client } = require('pg')

export default async function handler(req, res) {
  const client = new Client(process.env.pg_data)

  await client.connect();

  const { rows:result } = await client.query(`
        select saved_image 
        from  "clients"       
        where "nikname" =  $1             
      `,[req.query.nikname]);
      
  await client.end();    
  if (result.length > 0) {
    res.status(200).json(result[0].saved_image)
  } else {
    res.status(500).json([])
  }
}