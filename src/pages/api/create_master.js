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
  master['text'] = req.body.text ? 'Немного о себе' : req.body.text
  master['color'] = ['linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)', '#3D4EEA', '#ECEEFD']
  master['id'] = my_result[0].id
  master['phone'] = my_result[0].phone

  const result = await sql`   
    insert into users (name, phone, nikname, id, services, color, text) 
    values (      
      ${master.name},
      ${master.phone},      
      ${req.body.nikname},
      ${master.id},      
      '{}',
      ${master.color},
      ${master.text}
    )  
    returning *
  `


  if (my_result.length > 0) {
    console.log("Запись мастера создана")
    const result = await sql`
        update clients 
        set status = 'master'
        where id = ${my_result[0].id}
        returning *
      `
    if (result.length > 0) {
      console.log("Статус изменён на master")
    }

    const services = await sql`
        insert into services (user_id,nikname,маникюр,чистка,брови,массаж,педикюр,стрижка,ресницы,депиляция,прически,макияж,барбер)
        values (
          ${my_result[0].id},
          ${master.nikname},
          '{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}'
        )
      `

    const schedule = await sql`
          insert into schedule (nikname,patern,апрель,май,июнь,июль,август, сентябрь)
          values (
            ${master.nikname},
            '{}','{}','{}','{}','{}','{}','{}'
          )
    
    `
    res.status(200).end('Профиль мастера создан')
  } else {
    res.status(400).end('Error')
  }
}