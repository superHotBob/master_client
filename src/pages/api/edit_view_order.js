const { Client } = require('pg')

export default async function handler(req, res) {
 
  const client = new Client(process.env.pg_data)

  await client.connect();
  const { rows } = await client.query(`
        update "orders" 
        set "read" = true    
        where "id" =  $1  
        returning *      
      `,[req.query.id])

  client.end()    
  if (rows.length > 0) {
    res.status(200).json({message:'Good'})
  } else {
    res.status(500).json({message:'Error'})
  }
}