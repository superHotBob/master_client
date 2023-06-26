import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)

  const result = await sql`
        select (address_full) 
        from  users       
        where nikname =  ${req.query.nikname}              
      `
   
  if (result.length > 0) {
    res.status(200).json(result[0].address_full)
  } else {
    res.status(500).json([])
  }
}