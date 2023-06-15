import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)
  
   if( req.body.recipient_nikname === 'администратор') {
    const result = await sql`
    insert into adminchat (recipient,recipient_nikname,sendler,sendler_nikname,ms_text,ms_date,chat) 
    values (
      ${req.body.recipient},
      ${req.body.recipient_nikname},
      ${req.body.sendler},
      ${req.body.sendler_nikname},     
      ${req.body.ms_text},
      ${req.body.ms_date},
      ${req.body.chat}
    )  
    returning *
  `
  res.send('Ok')    

   } else {
    const result = await sql`
    insert into chat (recipient,recipient_nikname,sendler,sendler_nikname,ms_text,ms_date,chat) 
    values (
      ${req.body.recipient},
      ${req.body.recipient_nikname},
      ${req.body.sendler},
      ${req.body.sendler_nikname},     
      ${req.body.ms_text},
      ${req.body.ms_date},
      ${req.body.chat}
    )  
    returning *
  `
  res.send('Ok')    

   }

  const result = await sql`
    insert into ${my_table} (recipient,recipient_nikname,sendler,sendler_nikname,ms_text,ms_date,chat) 
    values (
      ${req.body.recipient},
      ${req.body.recipient_nikname},
      ${req.body.sendler},
      ${req.body.sendler_nikname},     
      ${req.body.ms_text},
      ${req.body.ms_date},
      ${req.body.chat}
    )  
    returning *
  `
  res.send('Ok')    
}