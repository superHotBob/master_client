const { Client } = require('pg')

export default async function handler(req, res) {  
  const client = new Client(process.env.pg_data)

  const {nikname, status} = req.query

  await client.connect();

  const { rows: admin} = await client.query(`
    SELECT * FROM (
      SELECT distinct on ("chat")  *         
      from  "adminchat"       
      WHERE "recipient_nikname" = $1 or "sendler_nikname" =  $1
      order by "chat", "ms_date" desc
    ) "chat"
    `,[nikname]
  );

  const { rows: client_mess} = await client.query(`
    SELECT * FROM (
      SELECT distinct on ("chat")  *         
      from  "chat"       
      WHERE "recipient_nikname" = $1 or "sendler_nikname" =  $1
      or "sendler_nikname" =  $1     
      order by "chat", "ms_date" desc
    ) "chat"
    `,[nikname]
  );

  

  const { rows: admin_sub} = await client.query(`
    SELECT * FROM (
      SELECT distinct on ("chat")  *         
      FROM  "adminchat"       
      WHERE  ("recipient" = $1 or "recipient" = $2) and "ms_date" - $3 > 0   
      order by "chat", "ms_date" desc
    ) "chat"
    `,["all",status,+admin[0].ms_date]
  );

  
  const result = {
    admin: admin_sub.length > 0 ? admin_sub: admin,
    client: client_mess,    
  } 

  await client.end(); 
  res.status(200).json(result)

}