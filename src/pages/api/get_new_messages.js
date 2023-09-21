const { Client } = require('pg')
export default async function handler(req, res) {  

  const client = new Client(process.env.pg_data)

  await client.connect();
  
  const { rows: client_count } = await client.query(`
        select Count(*)      
        from  "chat"       
        where "recipient_nikname" = $1 and "read" = $2            
      `,[req.query.nikname,false])

  const { rows: admin } = await client.query(`
        select COUNT(*) 
        from  "adminchat"       
        where "recipient_nikname" = $1 and "read" = false           
        `,[req.query.nikname])

  const { rows: admin_all } = await client.query(`
      select MIN(ms_date) 
      from  "adminchat"       
      where "recipient_nikname" = $1          
      `,[req.query.nikname])
  
  const {rows: subscribe } = await client.query(`
      select COUNT(*) 
      from  "adminchat"       
      where "chat" = $1 and "ms_date" > $2 and "read" = $3 and ("recipient" = $4 or "recipient" = $5)              
    `,[0,admin_all[0].min,false,req.query.status,'all']);

  const result = +admin[0].count + +client_count[0].count + +subscribe[0].count
  

  await client.end();
  res.status(200).send(result)
}