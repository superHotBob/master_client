import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)

  const data = {
    nikname: req.body.nikname,
    month: req.body.month,
    'май': req.body.schedule   
  }


  const result = await sql`
        update schedule set ${
          
          sql(data, 'май'  )  
        }
        where nikname =  ${data.nikname}
        returning *
      `
  if (result.length > 0) {
    res.status(200).json(result[0])
  } else {
    console.log('Error')
  }
}