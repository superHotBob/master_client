// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)


  const result = await sql`
    select 
    status
    from clients
    where phone = ${+req.body.tel}
  `
 
  const nikname =  'client' + (Math.random() * 10000).toFixed(0)
  if (result.length === 0) {
    const result = await sql`
        insert into clients (
          phone, status, nikname
        ) values (
          ${+req.body.tel}, 'client', ${nikname}
        )

        returning *
    `
    console.log(result)
    res.status(200).json(result[0])
  } else if (result[0].status === 'master') {
    const result = await sql`
      select 
      name,status,city,stars,locations,nikname,image,text
      from users
      where phone = ${+req.body.tel}
    `
    res.status(200).json(result[0])
  } else if (result[0].status === 'client') {
    const result = await sql`
    select 
    status,nikname,image,name,text
    from clients
    where phone = ${+req.body.tel}
  `
    res.status(200).json(result[0])
  } else {
    console.log('Error')
  }

}
