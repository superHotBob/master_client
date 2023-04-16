// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres('postgres://bobozeranski:ZdxF36OgaSAK@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652')
  console.log(req.query.city.toLowerCase(),req.query.service.toLowerCase())
  const result = await sql`
    select nikname, name,image,stars,address, services
    from users
    where ${req.query.service.toLowerCase()} = ANY (services) and city = ${req.query.city.toLowerCase()} and blocked = 'no'
  `
 
  
  
  if (result.length>0) {
    res.status(200).json(result) 
  } else {
   console.log("error")
  }
  
}
