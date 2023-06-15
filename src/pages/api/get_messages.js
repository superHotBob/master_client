import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)

  const result = await sql`
        select * from (
        select distinct on ( chat ) *         
        from  chat       
        where recipient_nikname = ${req.query.nikname} or sendler_nikname =  ${req.query.nikname}
        order by chat, ms_date desc
        ) chat
                
      `
  if (result.length > 0) {
    res.status(200).json(result)
  } else {
    res.status(500).json([])
  }
}