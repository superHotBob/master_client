import postgres from "postgres"
const { Client } = require('pg')


export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)
  const client = new Client(process.env.pg_data)

  await client.connect();

 

  if (req.query.abonent === 'администратор' || req.query.nikname === 'администратор') {   
    const {rows: admin } = await client.query(`
      select * from  "adminchat"       
      where ("sendler_nikname"  =  $1 and "recipient_nikname" = $2 ) or 
      ("sendler_nikname"  =  $2  and  "recipient_nikname" = $1) 
      `,[req.query.nikname,'администратор']
    ); 
    
    const { rows: date_reg } = await client.query(`
      select registration 
      from "clients"
      where "nikname" = $1      
    `,[req.query.nikname]);
   
    // const dd = date_reg[0]['registration']
    // let d = new Date(dd)
    console.log(admin)
    console.log(Date.parse(date_reg[0]?.registration))
    const subscribe = await client.query(`
        select * 
        from  "adminchat"
        where "chat" = 0 and ("recipient" = $1 or "recipient" = $2 ) and "ms_date" > $3
         
    `,[req.query.status,'all',Date.parse(date_reg[0]?.registration)]); 

    const admin_subscribe = admin.concat(subscribe)
   
    if (subscribe.length > 0) {    
      res.status(200).json(admin_subscribe)
    } else {
      res.status(200).json(admin)
    }
  } else {
    const {rows: result } = await client.query(`
      select * 
      from  "chat"
      where ("sendler_nikname" = $1 and "recipient_nikname" =  $2  ) or (
      "recipient_nikname" = $1 and "sendler_nikname" =  $2)                      
    `,[req.query.abonent,req.query.nikname]);

    if (result.length > 0) {
      res.status(200).json(result)
    } else {
      res.status(500).json([])
    }
  }

}