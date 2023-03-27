import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres('postgres://bobozeranski:ZdxF36OgaSAK@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652')
  
  const user = {  
    user:req.body.nikname,
    педикюр: req.body.педикюр, 
    массаж: req.body.массаж,
    маникюр: req.body.маникюр,
    барбер: req.body.барбер || null,
    брови: req.body.брови|| null,
    прически: req.body.прически|| null,
    ресницы: req.body.ресницы|| null,
    стрижка: req.body.стрижка|| null,
    депиляция: req.body.депиляция|| null,
  }
  console.log('body',req.body)
  const result = await sql`
  update services set ${
    sql(user, 'массаж','маникюр','педикюр','барбер','брови','прически','ресницы','стрижка','депиляция')
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