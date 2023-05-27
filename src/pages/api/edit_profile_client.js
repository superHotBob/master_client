// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)

  const client = {
    nikname: req.body.new_nikname,
    name: req.body.name,    
    text: req.body.text,
    old_nikname: req.body.old_nikname
  }


  const result = await sql`
        update clients set ${sql(client, 'name', 'text', 'nikname')}    
        where nikname =  ${client.old_nikname}
        returning name, text, nikname, status  
      `
  if (result.length > 0) {
    res.status(200).json(result[0])
  } else {
    console.log('Error')
  }
}



