import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)

  const result = await sql`
        select 
          distinct on ( sendler_nikname) sendler_nikname,
          ms_date,
          sendler_nikname,
          ms_text,
          sendler,
          recipient,
          recipient_nikname
        from  chat
        where recipient_nikname = ${req.query.nikname}  or  sendler_nikname = ${req.query.nikname}          
      `
  if (result.length > 0) {
    res.status(200).json(result)
  } else {
    res.status(500).json([])
  }
}