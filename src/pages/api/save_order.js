import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres('postgres://bobozeranski:ZdxF36OgaSAK@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652')
  
 
  console.log('body',req.body)
  const result = await sql`
  insert into orders (
    master, client,neworder,price,date_order,master_name,client_name
  ) values (
    ${req.body.master}, 
    ${req.body.client},
    ${req.body.order},
    ${req.body.price},
    ${req.body.date},
    ${req.body.master_name},
    ${req.body.client_name}
  )
  returning *
  `
 
  
  
  if (result.length) {
    res.status(200).json(result) 
  } else {
   console.log("error")
  }
  
}