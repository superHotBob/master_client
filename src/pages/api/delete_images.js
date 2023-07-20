import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)

  const result = await sql`  
  delete from images
  where id = ${req.query.id} 
  `
  if (result.length) {
    res.status(200).json(result)
  } else {
    res.json([])
  }

}