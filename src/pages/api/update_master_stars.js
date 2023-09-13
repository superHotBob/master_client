const { Client } = require('pg')

export default async function handler(req, res) {
  const client = new Client(process.env.pg_data)

  const { rows } = await client.query(`
        update "users"
        set "stars" = $1    
        where "nikname" =  $2  
        returning *      
      `,[stars,req.query.nikname])
      client.end()
  if (rows.length > 0) {
    res.status(200).json(rows[0])
  } else {
    res.status(500).json({message:'Error'})
  }
}