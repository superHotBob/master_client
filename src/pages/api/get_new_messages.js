import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)

  const client = await sql`
        select Count(*)      
        from  chat       
        where recipient_nikname = ${req.query.nikname} and read = false              
      `
  const admin = await sql`
        select COUNT(*) 
        from  adminchat       
        where recipient_nikname = ${req.query.nikname} and read = false               
      `
  const subscribe = await sql`
      select COUNT(*) 
      from  adminchat       
      where chat = 0  and read = false               
    `
  const result = +admin[0].count + +client[0].count + +subscribe[0].count
  console.log(+client[0].count, +admin[0].count)
  res.status(200).send(result)
}