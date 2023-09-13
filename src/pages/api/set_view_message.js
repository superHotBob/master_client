const { Client } = require('pg')

export default async function handler(req, res) {
  

  const client = new Client(process.env.pg_data)

  await client.connect();

  if (req.query.abonent === 'администратор') {
    await client.query(`
      UPDATE "adminchat"
      SET "read" = true
      where "sendler_nikname" =  $1 and recipient_nikname = $2
      `, [req.query.abonent, req.query.nikname]
    );  
    res.send('Ok')
  } else {   
    await client.query(`
      UPDATE "chat"
      SET "read" = true
      where "sendler_nikname" =  $1 and recipient_nikname = $2
      `, [req.query.abonent, req.query.nikname]
    );  
    client.end()
    res.send('Ok')
  }
}