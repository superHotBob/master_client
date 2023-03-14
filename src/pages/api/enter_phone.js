// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres('postgres://bobozeranski:ZdxF36OgaSAK@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652')
 
  const result = await sql`
  select 
  username,status,city,stars,locations,nikname
  from users
  where password = ${+req.body.tel}`
  
  if (result.length) {
    res.status(200).json(result[0]) 
  } else {
    res.status(400).json({ name: '' })
  }
  
}
