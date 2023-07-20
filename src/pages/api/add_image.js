import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres('postgres://bobozeranski:ZdxF36OgaSAK@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652')
  
  const date = Date.now()
  const result = await sql`
    
    insert into images (
        nikname,service,city,img_date,master_name
        ) values (
            ${req.body.nikname}, 
            ${req.body.service},
            ${req.body.city},
            ${+date},           
            ${req.body.master_name}
        )
        returning id
    `

  
    res.send(result)
  
  
}