import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres('postgres://bobozeranski:ZdxF36OgaSAK@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652')

  
  const result = await sql`
    delete from  orders        
    where id = ${req.body.id}
    returning *
  `

  await sql`
  update clients 
  set rating = rating - 1
  where nikname = ${req.body.nikname}
`
 await sql`
  update users 
  set rating = rating - 1
  where nikname = ${req.body.nikname}
`

  if (result.length > 0) {
    res.end('Заказ удален')
  } else {
    res.end(null)
  }
  
}