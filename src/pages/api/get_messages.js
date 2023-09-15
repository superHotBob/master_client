const { Client } = require('pg')

export default async function handler(req, res) {  
  const client = new Client(process.env.pg_data)

  await client.connect();

  const { rows: admin} = await client.query(`
    SELECT * FROM (
      SELECT distinct on ("chat")  *         
      from  "adminchat"       
      WHERE "recipient_nikname" = $1 
      or "sendler_nikname" =  $1     
      order by "chat", "ms_date" desc
    ) "chat"
    `,[req.query.nikname]
  );

  const { rows: client_mess} = await client.query(`
    SELECT * FROM (
      SELECT distinct on ("chat")  *         
      from  "chat"       
      WHERE "recipient_nikname" = $1 or "sendler_nikname" =  $1
      or "sendler_nikname" =  $1     
      order by "chat", "ms_date" desc
    ) "chat"
    `,[req.query.nikname]
  );
    
  const result = {
    admin: admin,
    client: client_mess,
    // subscribe: subscribe
  } 

  await client.end(); 
  res.status(200).json(result)

}