import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)
  const d = new Date()
  const curr_date = Date.now(d) 
  const result = await sql`
        select 
        date_event, 
        event_text,
        master_nikname,
        event_id,       
        name,
        stars,
        address,
        services
        from  events 
        INNER JOIN users ON master_nikname = nikname
        where +date_event > ${curr_date}                
      `
  if (result.length > 0) {
    res.status(200).json(result)
  } else {
    res.status(200).json([])
  }
}