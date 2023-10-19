const { Client } = require('pg')

export default async function handler(req, res) {

  
  const client = new Client(process.env.pg_data)  
  await client.connect();

  const { rows }= await client.query(`
        update "clients"
        set "confid" = $1    
        where "nikname" =  $2 
        returning nikname,confid,name,text,status,saved_image      
      `,[req.query.confid,req.query.nikname]);

  await client.end();    
  if (rows.length > 0) {
    res.status(200).json(rows[0])
  } else {
    res.status(500).json({message:'Error'})
  }
}