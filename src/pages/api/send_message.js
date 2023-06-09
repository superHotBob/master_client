import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)
  
  

  const result = await sql`
    insert into chat (recipient,recipient_nikname,sendler,sendler_nikname,ms_text,ms_date) 
    values (
      ${req.body.recipient},
      ${req.body.recipient_nikname},
      ${req.body.sendler},
      ${req.body.sendler_nikname},     
      ${req.body.ms_text},
      ${req.body.ms_date}
    )  
    returning *
  `
  res.send('Ok')    
}