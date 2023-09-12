// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres"
const { Client } = require('pg')

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)
  const client = new Client(process.env.pg_data)
  await client.connect();
 
  const master = {
    nikname: req.body.nikname,
    name: req.body.name,
    text: req.body.text,
    phone: req.body.phone,
    id: req.body.id,
    currency: 'BYN',
    color: req.body.color
  }

  const { rows } = await client.query(`
    SELECT *
    FROM "clients" 
    WHERE "nikname" = $1
  `,[req.body.nikname]);

  console.log(rows)

  master['name'] = rows[0].name
  master['text'] = req.body.text ? req.body.text : 'Немного о себе'
  master['color'] = ['linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)', '#3D4EEA', '#ECEEFD']
  master['id'] = rows[0].id
  master['phone'] = rows[0].phone
  master['nikname'] = (req.body.nikname)
  // const master_profile = await sql`   
  //   insert into users (name, phone, nikname, id, services,stars, tema, text, rating) 
  //   values (      
  //     ${master.name},
  //     ${master.phone},      
  //     ${master.nikname},
  //     ${master.id},      
  //     '{}',
  //     '0.0',
  //     0,
  //     ${master.text},
  //     '0'
  //   )  
  //   returning *
  // `
  const { rows: new_master } = await client.query(
    `INSERT INTO "masters" ("phone", "nikname","name","text")  
    VALUES ($1,$2,$3,$4)
    returning *`
    , [master.phone,master.nikname,master.name,master.text]
    
  ); 
  // console.log(new_master)

  if (rows.length > 0) {
    // fetch(`https://masters-client.onrender.com/createclientfolder?dir=${master.nikname}`)
    //   .then(res => console.log('Папка мастера создана'))
    // fetch(`https://masters-client.onrender.com/deleteclientfolder?dir=${req.body.nikname}`)
    //   .then(res => console.log('Папка клиетна удалена'))
    console.log("Запись мастера создана")
    // const result = await sql`
    //     update clients 
    //     set status = 'master', nikname = ${master.nikname}, rating = 0
    //     where id = ${my_result[0].id}
    //     returning *    
    //   `
    await client.query(`
      UPDATE "clients" 
      SET "status" = $2 
      WHERE "nikname" = $1
    `,[master.nikname,"master"]
    );  
  


   
    await client.query(
      `INSERT INTO "services" ("nikname")  
      VALUES ($1)`, [req.body.nikname]
    ); 
    await client.query(
      `INSERT INTO "schedule" ("nikname")  
      VALUES ($1)`, [req.body.nikname]
    ); 
    await client.end();
    // await sql`
    //     insert into services (user_id,nikname,маникюр,чистка,брови,массаж,педикюр,стрижка,ресницы,депиляция,прически,макияж,барбер,окрашивание)
    //     values (
    //       ${my_result[0].id},
    //       ${master.nikname},
    //       '{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}', '{}'
    //     )
    //   `

    // await sql`
    //       insert into schedule (nikname,patern,январь,февраль,март,апрель,май,июнь,июль,август, сентябрь,октябрь,ноябрь,декабрь)
    //       values (
    //         ${master.nikname},
    //         '{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}'
    //       )
    
    // `

    res.status(200).send(new_master)
  } else {
    res.status(400).end('Error')
  }
}