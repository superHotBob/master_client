// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { Client } = require('pg')

export default async function handler(req, res) {
  
  const pgclient = new Client(process.env.pg_data)

  await pgclient.connect();

  const { rows } = await pgclient.query(`
    UPDATE "clients"
    SET "name" = $1 ,"nikname" = $2 ,"text" = $3
    where "nikname" = $2
    returning "nikname" , "name", "text" , "saved_image", "status"
  `, [req.body.name, req.body.nikname, req.body.text]
  );
  
  await pgclient.query(`
      UPDATE "adminchat"
      SET "recipient" = case when "recipient" != $3 then $1 else $3 end,
          "sendler" = case when "sendler" != $3 then $1 else $3 end
      WHERE "recipient_nikname" = $2  or "sendler_nikname" = $2
    `, [req.body.name, req.body.nikname,'администратор']
  );

  await pgclient.query(`
    UPDATE "chat"
    SET "recipient" = case when "recipient_nikname" != $2 then $1 else null end,
        "sendler" = case when "sendler_nikname" != $2 then $1 else null end
    WHERE "recipient_nikname" = $2 and "sendler_nikname" = $2
  `, [req.body.name, req.body.nikname]
  );

  await pgclient.end();
  if (rows.length > 0) {
    res.status(200).json(rows[0])
  } else {
    console.log('Error')
  }
}



