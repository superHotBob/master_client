import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres('postgres://bobozeranski:ZdxF36OgaSAK@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652')
  
  const result = await sql`
    select 
    маникюр, брови,стрижка,массаж,педикюр,стрижка,ресницы,депиляция,прически,макияж
    from services
    where master = ${req.query.nikname}
  `  
  if (result.length) {
    res.status(200).json(result) 
  } else {
    res.status(200).json([])
  }  
}