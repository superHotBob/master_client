// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)

  const client = {
    nikname: req.body.nikname,
    name: req.body.name,    
    text: req.body.text,    
  } 
  const new_client = await sql`
    update clients set ${sql(client, 'name', 'text', 'nikname')}    
    where nikname =  ${client.nikname}
    returning name, text, nikname, status  
  `
  await sql`
    update adminchat
    set recipient = ${client.name}    
    where recipient_nikname =  ${client.nikname}    
  `
  await sql`
    update chat
    set recipient = ${client.name},
    set sendler =  ${client.name}
    where recipient_nikname =  ${client.nikname} or  sendler_nikname =  ${client.nikname}  
  `
 
  if (new_client.length > 0) {
    res.status(200).json(new_client[0])
  } else {
    console.log('Error')
  }
}



