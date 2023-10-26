// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { Client } = require('pg')




export default async function handler(req, res) {


  const client = new Client(process.env.pg_data)
  await client.connect()

  const { rows: result } = await client.query(
    `select 
      status,blocked,id,nikname,client_password  
    from  "clients"     
    where "phone" = $1
    `, [+req.body.tel]
  );



  if (result.length === 0) {
    const { rows: max_id } = await client.query("SELECT Max(id) from clients");

    const nikname = max_id[0].max + 1;
    const key = Math.random().toString(36).slice(-12)

    const { rows: result } = await client.query(
      `INSERT INTO "clients" ("phone","nikname", "id", "client_password","name", "text","key")  
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      returning *
      `, [+req.body.tel, nikname, nikname, req.body.password, nikname, 'Добрый день', key]
    );


    fetch(`http://masters.place:5000/createclienticon?name=${nikname}`)
      .then(res => console.log('Иконка клиента создана'))




    const { rows: max_chat } = await client.query("SELECT Max(chat) from adminchat");
    let chat = +max_chat[0].max + 1;
    let date = Date.now();

    await client.query(
      `INSERT INTO "adminchat" ("recipient","recipient_nikname","ms_date","chat")  
        VALUES ($1,$2,$3,$4)
      returning *
      `, [nikname, nikname, date, chat]
    );
    res.setHeader('Set-Cookie', `key=${key}; Path=/;`)
    await client.end();
    res.status(200).json(result[0])

  } else if (result[0].status === 'master' && result[0].blocked === '0') {
    if (result[0].client_password === req.body.password) {
      const { rows: result } = await client.query(`
          select 
          masters.address,masters.city,masters.currency,masters.locations,masters.name,masters.nikname,
          masters.services,masters.stars,masters.status,masters.tema,masters.text,masters.address_full,
          clients.confid
          from "masters"
          left join "clients" on masters.phone = clients.phone
          where masters.phone = $1
        `, [+req.body.tel]);

      const { rows: key } = await client.query(`
        select key          
        from "clients"
        where "phone" = $1
      `, [+req.body.tel]);



      await client.end();
      res.setHeader('Set-Cookie', [`key=${key[0].key}; Expires=Wed, 21 Oct 2024 07:28:00 GMT; Path=/;`,
      `nikname=${result[0].nikname}; Expires=Wed, 21 Oct 2024 07:28:00 GMT; Path=/;`])



      res.status(200).json(result[0])
    } else {
      await client.end();
      res.status(200).json([])
    }
  } else if (result[0].status === 'client' && result[0].blocked === '0') {
    if (result[0].client_password === req.body.password) {
      const { rows: result } = await client.query(`
          select 
            status,nikname,name,text,id,saved_image,key,confid
          from "clients"
          where phone = $1
        `, [+req.body.tel]);


      const { rows: key } = await client.query(`
        select key          
        from "clients"
        where "phone" = $1
      `, [+req.body.tel]);
      await client.end();


      res.setHeader('Set-Cookie', [`key=${key[0].key}; Expires=Wed, 21 Oct 2024 07:28:00 GMT; Path=/;`,
      `nikname=${result[0].nikname}; Expires=Wed, 21 Oct 2024 07:28:00 GMT; Path=/;`])


      res.status(200).json(result[0])
    } else {
      await client.end();
      res.status(200).json([])
    }
  } else {
    await client.end();
    res.status(404).json([])
  }


}