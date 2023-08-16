// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)
  
 
  const result = await sql`
    select 
      status,blocked,id,nikname,client_password
    from clients
    where phone = ${+req.body.tel}
  `

  
 



  if (result.length === 0) {
    const max_id = await sql`
      select Max(id) from clients
    `

    const nikname = max_id[0].max + 1;
    const result = await sql`
          insert into clients (
            phone, status, nikname, id, blocked,client_password,name, text
          ) values (
            ${+req.body.tel}, 
            'client', 
            ${nikname}, 
            ${nikname}, 
            '0', 
            ${req.body.password},
            ${nikname}, 
            'Добрый день'
          )
          returning status, nikname, id, text, name
      `
    res.status(200).json(result[0])
    fetch(`https://masters-client.onrender.com/createclientfolder?dir=${nikname}`)
      .then(res => console.log('GOOD'))


    const max_chat = await sql`
      select Min(chat) from adminchat
    `
    let chat = +max_chat[0].min - 1;
    let date = Date.now();   
    const message_from_admin = await sql`
      insert into adminchat (recipient,recipient_nikname,sendler,sendler_nikname,ms_text,ms_date,chat,read,phone) 
      values (
        ${nikname}, 
        ${nikname}, 
        'администратор',
        'администратор',  
        'Приветствуем Вас на нашем сервисе.',
        ${date},
        ${chat},
        'f',
        0
      )  
      returning *
    `

  } else if (result[0].status === 'master' && result[0].blocked === '0') {
    if (result[0].client_password === req.body.password) {
      const result = await sql`
          select 
            name,status,city,stars,locations,nikname,text,address,address_full,currency,color,services
          from users
          where phone = ${+req.body.tel}
        `
      res.status(200).json(result[0])
    } else {
      res.status(200).json([])
    }
  } else if (result[0].status === 'client' && result[0].blocked === '0') {
    if (result[0].client_password === req.body.password) {
      const result = await sql`
          select 
            status,nikname,name,text,id,saved_image
          from clients
          where phone = ${+req.body.tel}
        `
      res.status(200).json(result[0])
    } else {
      res.status(200).json([{ message: 'пароль не верный' }])
    }

    // fetch(`https://masters-client.onrender.com/create?dir=${result[0].nikname}`)
    //   .then(res => console.log('Папка создана'))
  } else if (result[0].blocked !== '0') {

    res.status(404).json([{ message: 'Ваш аккаунт заблокирован' }])
  } else {
    res.status(404).end('Ваш аккаунт заблокирован')
  }


}
