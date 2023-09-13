const { Client } = require('pg')

export default async function handler(req, res) {
  const client = new Client(process.env.pg_data)

  await client.connect();
  const {rows: result } = await client.query(`
        update "clients" 
        set "client_password" = $1    
        where phone =  $2  
        returning phone      
      `,[req.body.password,req.body.tel]);
  client.end();   
  if (result.length > 0) {
    res.status(200).json(result[0])
  } else {
    res.status(500).json({message:'Error'})
  }
}