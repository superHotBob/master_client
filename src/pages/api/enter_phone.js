// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)


  const result = await sql`
    select 
    status,blocked,id,nikname
    from clients
    where phone = ${+req.body.tel}
  `

  const nikname = 'client' + (Math.random() * 100000).toFixed(0)

    if (result.length === 0) {
      const result = await sql`
          insert into clients (
            phone, status, nikname, id, blocked
          ) values (
            ${+req.body.tel}, 'client', ${nikname}, ${(Math.random() * 100000).toFixed(0)}, 'no'
          )
          returning status, nikname,id
      `
     
      res.status(200).json(result[0])
      fetch(`https://masters-client.onrender.com/create?dir=${nikname}`)
      .then(res=>console.log('GOOD'))
    } else if (result[0].status === 'master' && result[0].blocked === 'no') {
      const result = await sql`
        select 
        name,status,city,stars,locations,nikname,image,text,address,address_full,currency,color,services
        from users
        where phone = ${+req.body.tel}
      `
      res.status(200).json(result[0])
      fetch(`https://masters-client.onrender.com/create?dir=${result[0].nikname}`)
      .then(res=>console.log('GOOD'))
    } else if (result[0].status === 'client' && result[0].blocked === 'no') {
      const result = await sql`
        select 
        status,nikname,name,text,id,saved_image
        from clients
        where phone = ${+req.body.tel}
      `
      res.status(200).json(result[0])
      fetch(`https://masters-client.onrender.com/create?dir=${result[0].nikname}`)
      .then(res=>console.log('GOOD'))
    } else if (result[0].blocked === 'yes') {

      res.status(200).json(result[0])
    } else {
      res.end('Ваш аккаунт заблокирован')
    }
  

}
