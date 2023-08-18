import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)
  
   if( req.body.recipient_nikname === 'администратор' || req.body.sendler_nikname === 'администратор') {
    let chat = 0;
    if(req.body.chat) {
      chat = req.body.chat
    } else {
      const max_chat = await sql`
        select Max(chat) from adminchat
      `
      chat = max_chat[0].max + 1
      
    }
    await sql`
    insert into adminchat (recipient,recipient_nikname,sendler,sendler_nikname,ms_text,ms_date,chat,read) 
    values (
      ${req.body.recipient},
      ${req.body.recipient_nikname},
      ${req.body.sendler},
      ${req.body.sendler_nikname},     
      ${req.body.ms_text},
      ${req.body.ms_date},
      ${chat},
      'false'
     
    )  
    returning *
  `
  res.send('Ok')  


   } else {
    let chat = 0;
    if(req.body.chat) {
      chat = req.body.chat
    } else {
      const max_chat = await sql`
        select Max(chat) from chat
      `
      chat = max_chat[0].max + 1
      
    }
    const result = await sql`
    insert into chat (recipient,recipient_nikname,sendler,sendler_nikname,ms_text,ms_date,chat, read) 
    values (
      ${req.body.recipient},
      ${req.body.recipient_nikname},
      ${req.body.sendler},
      ${req.body.sendler_nikname},     
      ${req.body.ms_text},
      ${req.body.ms_date},
      ${chat},
      'false'
    )  
    returning *
  `
  res.send('Ok')    

  }
 
}