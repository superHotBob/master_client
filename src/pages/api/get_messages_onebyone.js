
const { Client } = require('pg')


export default async function handler(req, res) {
 
  const client = new Client(process.env.pg_data)

  await client.connect();

 

  if (req.query.abonent === 'администратор' || req.query.nikname === 'администратор') {   
    const {rows: admin } = await client.query(`
      select * from  "adminchat"       
      where ("sendler_nikname"  =  $1 and "recipient_nikname" = $2 ) or 
      ("sendler_nikname"  =  $2  and  "recipient_nikname" = $1) 
      `,[req.query.nikname,'администратор']
    ); 

    const no_read_messages = admin.filter(i=>i.read === false).map(i=>i.id)

    for(const i of no_read_messages) {
      await client.query(`
        update "adminchat"
        set "read" = true
        where "id" = $1 and "sendler" = $2
      `,[i,'администратор'])
    }
    
    const { rows: date_reg } = await client.query(`
      select registration 
      from "clients"
      where "nikname" = $1      
    `,[req.query.nikname]);
   
   
   
    const { rows: subscribe } = await client.query(`
        select * 
        from  "adminchat"
        where "chat" = 0 and ("recipient" = $1 or "recipient" = $2 ) and "ms_date" > $3
         
    `,[req.query.status,'all',Date.parse(date_reg[0]?.registration)]); 

    const admin_subscribe = admin.concat(subscribe)
   
    if (subscribe.length > 0) {  
      await client.end()  
      res.status(200).json(admin_subscribe)
    } else {
      await client.end()
      res.status(200).json(admin)
    }
  } else {
    const {rows: result } = await client.query(`
      select * 
      from  "chat"
      where ("sendler_nikname" = $1 and "recipient_nikname" =  $2  ) or (
      "recipient_nikname" = $1 and "sendler_nikname" =  $2)  
      order by "ms_date" DESC                    
    `,[req.query.abonent,req.query.nikname]);

    const no_read_messages = result.filter(i=>i.read === false).map(i=>i.id)

    for(const i of no_read_messages) {
      await client.query(`
        update "chat"
        set "read" = true
        where "id" = $1 and "sendler_nikname" != $2
      `,[i, req.query.nikname])
    }
    

    await client.end()

    if (result.length > 0) {
      res.status(200).json(result)
    } else {
      res.status(500).json([])
    }
  }

}