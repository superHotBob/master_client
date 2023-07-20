import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)

  const result = await sql`
  select id, nikname,img_date, review, master_name
    from images
    where city = ${req.query.city} and  service = ${req.query.service}
    order  by img_date DESC
  `
  if (result.length) {
    res.status(200).json(result)
  } else {
    res.json([])
  }

}