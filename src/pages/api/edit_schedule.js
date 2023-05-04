import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)

  const data = {
    nikname: req.body.nikname,
    month: req.body.month,
    schedule: req.body.schedule   
  }
  const table = 'schedule'
  , column = data.month

  const result = await sql`
        update ${ sql(table) }  
        set ${ sql(column) } = ${data.schedule}
        where nikname =  ${data.nikname}
        returning *
      `
  if (result.length > 0) {
    res.status(200).json(result[0])
  } else {
    console.log('Error')
  }
}