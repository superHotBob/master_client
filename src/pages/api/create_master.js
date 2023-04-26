// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)
  
  const master = {
    nikname: req.body.nikname,
    name: req.body.name,
    image: 'image',
    text: req.body.text,
    phone: req.body.phone,
    id: req.body.id,
    currency: 'BYN',
    color: req.body.color
  }

  const my_result = await sql`
    select phone, id from clients
    where nikname = ${req.body.nikname}
  `
  if (!req.body.name) {
    master['name'] = req.body.nikname
    master['text'] = 'Немного о себе'
    master['color'] =  ['linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)', '#3D4EEA', '#ECEEFD']  
    master['id'] = my_result[0].id
    master['phone'] = my_result[0].phone
  }

  

  const result = await sql`
  
    insert into users (name, phone, image, nikname, id, services, color, text) 
    values (
      ${master.name},
      ${master.phone},
      ${master.image},
      ${req.body.nikname},
      ${master.id},      
      '{}',
      ${master.color},
      ${master.text}
    )  
    returning *
  `
  
 console.log(result)
  if(my_result.length>0) {
      const result = await sql`
        update clients 
        set status = 'master'
        where id = ${my_result[0].id}
        returning *
      `
    

      const next_result = await sql`
        insert into services (user_id,master)
        values (
          ${my_result[0].id},
          ${req.body.nikname}
        )
      `
      res.status(200).end('Профиль мастера создан')
  } else {
    res.status(400).end('Error')
  }
}