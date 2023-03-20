// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)

  const client = {
    nikname: req.body.new_nikname,
    name: req.body.name,
    image: req.body.image,
    text: req.body.text,
    old_nikname: req.body.old_nikname
  }

  if(req.body.status = 'master') {
    const result = await sql`
      update users set ${sql(client, 'name', 'image', 'text','nikname')}    
      where nikname =  ${client.old_nikname}
      returning *
    `    
    if( result.length>0 ) {        
      res.status(200).json(result[0])
    }  else {
      throw new Error('Not found')
    }
    
  } else {
      const result = await sql`
        update clients set ${sql(client, 'name', 'image', 'text','nikname')}    
        where nikname =  ${client.old_nikname}
        returning *
      `    
      if( result.length>0 ) {        
        res.status(200).json(result[0])
      }  else {
        throw new Error('Not found')
      }
  }   
 

}
