// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)
  
  const master = {
    nikname: req.body.nikname,
    name: req.body.name,
    image: req.body.image,
    text: req.body.text,
    phone: req.body.phone,
    id: req.body.id,
    currency: req.body.currency,
    color: req.body.color  
  }


  const result = await sql`
    insert into users (name,phone, nikname,id,currency,color,services) 
    values (
      ${req.body.name},${master.phone},
      ${req.body.nikname},${master.id},
      ${master.currency},${master.color},
      '{}'
    )  
    returning *
  `

  console.log(result)
  if(result.length>0) {
      const result = await sql`
        update clients 
        set status = 'master'
        where id = ${master.id}
        returning *
      `
     

      const next_result = await sql`
        insert into services (id,master)
        values (
          ${master.id},
          ${req.body.nikname}
        )
      `
      res.status(200).end('Профиль мастера создан')
  } else {
    res.status(400).end('Error')
  }
}