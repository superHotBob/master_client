import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres('postgres://bobozeranski:ZdxF36OgaSAK@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652')
  
  let new_date = Date.parse(req.body.event_date)

  console.log(new_date)

  const result = await sql`
  insert into events (
    master_nikname, date_event,event_text
  ) values (
    ${req.body.nikname},   
    ${new_date},
    ${req.body.text}   
  )
  returning *
   `

    res.status(200).json(result)  
}