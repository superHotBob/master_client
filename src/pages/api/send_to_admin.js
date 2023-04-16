import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)
  
  

  const result = await sql`
    insert into ms_admin (ms_user,ms_text,ms_date) 
    values (
      ${req.body.user},     
      ${req.body.text},
      ${req.body.date}
    )  
    returning *
  `
  res.send('Ok')
    console.log(result)
}