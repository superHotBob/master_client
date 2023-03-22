// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)


 
 
  
  const master = {
    nikname: req.body.nikname,
    name: req.body.name,
    image: req.body.image,
    text: req.body.text,
    phone: '375295552255'
   
   
   
}


const result = await sql`
  insert into users (name,phone, nikname) 
  values (${req.body.name},'375295552255',${req.body.nikname})    
 
  returning *
`
}