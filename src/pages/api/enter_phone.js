// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres"
const { Client } = require('pg')

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)
  
  const client = new Client({
    user: 'client',
    host: '5.35.5.23',
    database: 'postgres',
    password: 'client123',
    port: 5432,
  })

  await client.connect();
  const { rows:result } = await client.query(
   `select 
      status,blocked,id,nikname,client_password  
    from  "clients"     
    where "phone" = $1
    `,[+req.body.tel]
  );

  

  if (result.length === 0) {
    const {rows:max_id} = await client.query("SELECT Max(id) from clients");
    console.log(max_id)

    const nikname = max_id[0].max + 1;
    
   

    const { rows:result } = await client.query(
      `INSERT INTO "clients" ("phone","nikname", "id", "client_password","name", "text")  
      VALUES ($1,$2,$3,$4,$5,$6)
      returning *
      `, [+req.body.tel,nikname,nikname,req.body.password,nikname, 'Добрый день']      
    );
   
      
    fetch(`http://masters.place:5000/createclientfolder?dir=${nikname}`)
    .then(res => console.log('Папка клиента создана'))
    // fetch(`${process.env.url}createclientfolder?dir=${nikname}`)
    // .then(res => console.log('Папка клиента создана'))

    res.status(200).json(result[0])
    console.log(result)
    const {rows: max_chat } = await client.query("SELECT Max(chat) from adminchat");
    let chat = +max_chat[0].max + 1;
    let date = Date.now();

    await client.query(
      `INSERT INTO "adminchat" ("recipient","recipient_nikname","ms_date","chat")  
        VALUES ($1,$2,$3,$4)
      returning *
      `, [nikname,nikname,date,chat]      
    );

  } else if (result[0].status === 'master' && result[0].blocked === '0') {
    if (result[0].client_password === req.body.password) {
      const { rows:result } = await client.query(`
          select 
            name,status,city,stars,locations,nikname,text,address,address_full,currency,services,tema
          from "masters"
          where phone = $1
        `,[+req.body.tel]);
      res.status(200).json(result[0])
    } else {
      res.status(200).json([])
    }
  } else if (result[0].status === 'client' && result[0].blocked === '0') {
    if (result[0].client_password === req.body.password) {
      const {rows: result } = await client.query(`
          select 
            status,nikname,name,text,id,saved_image
          from "clients"
          where phone = $1
        `,[+req.body.tel]);
      res.status(200).json(result[0])
    } else {
      res.status(200).json([])
    }   
  } else  {

    res.status(404).json([])
  } 


}
