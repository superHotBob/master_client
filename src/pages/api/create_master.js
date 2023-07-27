// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)

  const master = {
    nikname: req.body.nikname,
    name: req.body.name,
    text: req.body.text,
    phone: req.body.phone,
    id: req.body.id,
    currency: 'BYN',
    color: req.body.color
  }

  const my_result = await sql`
    select phone, id, name, text from clients
    where nikname = ${req.body.nikname}
  `

  master['name'] = my_result[0].name
  master['text'] = req.body.text ?  req.body.text : 'Немного о себе' 
  master['color'] = ['linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)', '#3D4EEA', '#ECEEFD']
  master['id'] = my_result[0].id
  master['phone'] = my_result[0].phone
  master['nikname'] = (req.body.nikname)
  const result = await sql`   
    insert into users (name, phone, nikname, id, services,stars, color, text,blocked) 
    values (      
      ${master.name},
      ${master.phone},      
      ${master.nikname},
      ${master.id},      
      '{}',
      '0.0',
      ${master.color},
      ${master.text},
      '0'
    )  
    returning *
  `


  if (my_result.length > 0) {
    fetch(`https://masters-client.onrender.com/createclientfolder?dir=${master.nikname}`)
    .then(res => console.log('Папка мастера создана'))
    fetch(`https://masters-client.onrender.com/deleteclientfolder?dir=${req.body.nikname}`)
    .then(res => console.log('Папка клиетна удалена'))
    console.log("Запись мастера создана")
    const result = await sql`
        update clients 
        set status = 'master', nikname = ${master.nikname}, rating = 0
        where id = ${my_result[0].id}
        returning *
      `
    if (result.length > 0) {
      console.log("Статус изменён на master")
    }

    const services = await sql`
        insert into services (user_id,nikname,маникюр,чистка,брови,массаж,педикюр,стрижка,ресницы,депиляция,прически,макияж,барбер,окрашивание)
        values (
          ${my_result[0].id},
          ${master.nikname},
          '{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}', '{}'
        )
      `

    const schedule = await sql`
          insert into schedule (nikname,patern,апрель,май,июнь,июль,август, сентябрь,октябрь,ноябрь,декабрь)
          values (
            ${master.nikname},
            '{}','{}','{}','{}','{}','{}','{}','{}','{}','{}'
          )
    
    `
    res.status(200).end('Профиль мастера создан')
  } else {
    res.status(400).end('Error')
  }
}