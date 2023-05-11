import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://${process.env.DATABASE_NAME}:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)
  let month = req.query.month

  const table = 'schedule'
    , column = req.query.month
  const result = await sql`
       select ${ sql(column) } from ${ sql(table) }       
        where nikname =  ${req.query.nikname}             
      `
 
    res.status(200).json(result[0][month])
  
}