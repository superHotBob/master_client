import postgres from "postgres"
const { Client } = require('pg')

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)
  const client = new Client(process.env.pg_data)

  await client.connect();


  if (req.body.recipient_nikname === 'администратор' || req.body.sendler_nikname === 'администратор') {
    let chat = 0;
    if (req.body.chat) {
      chat = req.body.chat
    } else {
      const max_chat = await sql`
        select Max(chat) from adminchat
      `
      chat = +max_chat[0].max + 1

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

    client.query(`
        INSERT INTO "adminchat" (recipient,recipient_nikname,sendler,sendler_nikname,ms_text,ms_date,chat,read)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8)
    `, ['администратор', 'администратор', req.body.sendler, req.body.sendler_nikname,
      req.body.ms_text, req.body.ms_date, chat, false]
    );
    await client.end();
    res.send('Ok')


  } else {
    let chat = 0;
    if (req.body.chat) {
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
    client.query(`
      INSERT INTO "chat" (recipient,recipient_nikname,sendler,sendler_nikname,ms_text,ms_date,chat,read)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8)
    `, [req.body.recipient, req.body.recipient_nikname, req.body.sendler, req.body.sendler_nikname,
        req.body.ms_text, req.body.ms_date, chat, false]
    );
    await client.end();
    res.send('Ok')

  }

}