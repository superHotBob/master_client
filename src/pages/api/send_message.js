const { Client } = require('pg')

export default async function handler(req, res) {

  const client = new Client(process.env.pg_data)

  await client.connect();



  let chat = 0;
  if (req.body.chat) {
    chat = req.body.chat
  } else {
    const { rows } = await client.query("select Max(chat) from chat")
    chat = +rows[0].max + 1
  }

  await client.query(`
      INSERT INTO "chat" (recipient,recipient_nikname,sendler,sendler_nikname,ms_text,ms_date,chat,read)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8)
    `, [req.body.recipient, req.body.recipient_nikname, req.body.sendler, req.body.sendler_nikname,
  req.body.ms_text, req.body.ms_date, chat, false]
  );
  await client.end();
  res.send('Ok')

}