const { Client } = require('pg')

export default async function handler(req, res) {

  const client = new Client(process.env.pg_data)

  await client.connect();

  const { rows: client_count } = await client.query(`
        SELECT count(recipient_nikname) from  "chat"       
        where "recipient_nikname" = $1 and "read" = false        
      `, [req.query.nikname]
  );

  const { rows: admin } = await client.query(`
        Select count(recipient_nikname) from  "adminchat"       
        where "recipient_nikname" = $1 and "read" = false           
        `, [req.query.nikname]
  );

 

  if (req.query.chat !="null") {

    const { rows: subscribe } = await client.query(`
        select COUNT(*) 
        from  "adminchat"       
        where "chat" = 0 and "ms_date" > $1 and "read" = false and ("recipient" = $2 or "recipient" = 'all')              
      `, [req.query.chat, req.query.status]
    );

    const result = +admin[0].count + +client_count[0].count + +subscribe[0].count
    await client.end();
    res.status(200).send(result)

  } else {

    const { rows: registration } = await client.query(`
      select "registration" from  "clients"       
      where "nikname" = $1          
      `, [req.query.nikname]
    )
    const time = Date.parse(new Date(registration[0].registration))

    const { rows: subscribe } = await client.query(`
    select COUNT(*) 
    from  "adminchat"       
    where "chat" = 0 and "ms_date" > $1 and "read" = false and ("recipient" = $2 or "recipient" = 'all')              
  `, [time, req.query.status]
    );

    const result = +admin[0].count + +client_count[0].count + +subscribe[0].count
    await client.end();
    res.status(200).send(result)

  }









}