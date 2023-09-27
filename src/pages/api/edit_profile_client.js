// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { Client } = require('pg')

export default async function handler(req, res) {

  const client = new Client(process.env.pg_data)

  await client.connect();

  const { rows } = await client.query(`
    UPDATE "clients"
    SET "name" = $1 ,"nikname" = $2 ,"text" = $3
    where "nikname" = $2
    returning "nikname" , "name", "text" , "saved_image", "status"
  `, [req.body.name, req.body.nikname, req.body.text]
  );

  await client.query(`
      UPDATE "adminchat"
      SET "recipient" = case when "recipient" != $3 then $1 else $3 end,
          "sendler" = case when "sendler" != $3 then $1 else $3 end
      WHERE "recipient_nikname" = $2  or "sendler_nikname" = $2
    `, [req.body.name, req.body.nikname, 'администратор']
  );

  await client.query(`
    UPDATE "chat"
    SET "recipient" =  $1        
    WHERE "recipient_nikname" = $2 
  `, [req.body.name, req.body.nikname]
  );

  await client.query(`
    UPDATE "chat"
    SET "sendler" = $1 
    WHERE "sendler_nikname" = $2
  `, [req.body.name, req.body.nikname]
  );
  await client.query(`
    update "orders"
    SET "client_name" = $1
    WHERE "client" = $2
  `, [req.body.name, req.body.nikname]
  );

  await client.end();
  if (rows.length > 0) {
    res.status(200).json(rows[0])
  } else {
    console.log('Error')
  }
}



