import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres('postgres://bobozeranski:ZdxF36OgaSAK@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652')
  
  const user = {  
    user:req.body.nikname, 
    массаж: req.body.массаж,    
  }
  console.log('body',req.body)
  const result = await sql`
  update services set ${
    sql(user, 'массаж')
  }
  where master = ${user.user} 

  returning *
  `
 
  
  
  if (result.length) {
    res.status(200).json(result) 
  } else {
   console.log("error")
  }
  
}