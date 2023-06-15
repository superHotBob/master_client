import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)
    console.log(req.query.name,req.query.my_name)
  const result = await sql`
        update chat 
        set read = 'true'    
        where sendler_nikname =  ${req.query.name} and recipient_nikname = ${req.query.my_name} 
        returning *      
      `
  if (result.length > 0) {
    res.status(200).json(result[0])
  } else {
    res.status(500).json({message:'Error'})
  }
}