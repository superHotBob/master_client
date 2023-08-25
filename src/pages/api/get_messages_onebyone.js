import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)


 

  if (req.query.abonent === 'администратор' || req.query.nikname === 'администратор') {   
    const admin = await sql`
      select * from  adminchat       
      where (sendler_nikname  =  ${req.query.nikname} and recipient_nikname = 'администратор') or 
      (sendler_nikname  = 'администратор'  and recipient_nikname = ${req.query.nikname}) 
      `
    ; 
    
    const date_reg = await sql`
      select registration 
      from clients
      where nikname = ${req.query.nikname}
      
    `
   
    // const dd = date_reg[0]['registration']
    // let d = new Date(dd)
  
    const subscribe = await sql`
        select * 
        from  adminchat
        where chat = 0 and (recipient = ${req.query.status} or recipient = 'all') and ms_date > ${Date.parse(date_reg[0]['registration'])}
         
    `   
    const admin_subscribe = admin.concat(subscribe)
   
    if (subscribe.length > 0) {    
      res.status(200).json(admin_subscribe)
    } else {
      res.status(200).json(admin)
    }
  } else {
    const result = await sql`
      select * 
      from  chat
      where (sendler_nikname = ${req.query.abonent} and recipient_nikname =  ${req.query.nikname}  ) or (
      recipient_nikname = ${req.query.abonent} and sendler_nikname =  ${req.query.nikname})                      
    `
    if (result.length > 0) {
      res.status(200).json(result)
    } else {
      res.status(500).json([])
    }
  }

}