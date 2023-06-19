import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)
   
  const result = await sql`
      update chat 
      set read = 'true'    
      where sendler_nikname =  ${req.query.name} and recipient_nikname = ${req.query.my_name}             
    `
  res.send('Ok')
}