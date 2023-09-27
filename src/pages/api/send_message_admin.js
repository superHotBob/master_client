const { Client } = require('pg')

export default async function handler(req, res) {
 
  const client = new Client(process.env.pg_data)
  const dt =  Date.now()
  await client.connect();
  const { rows } = await client.query(`
        INSERT INTO "adminchat" (recipient,recipient_nikname,sendler,sendler_nikname,ms_text,ms_date,chat)
        VALUES($1,$1,$2,$3,$4,$5,$6)
    `, [
            'администратор',           
            req.body.sendler, 
            req.body.sendler_nikname,
            req.body.ms_text, 
            dt, 
            req.body.chat
        ]
    );
    await client.end();
    res.send('Ok')
}

  