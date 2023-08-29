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
  const admin_all = await sql`
      select MIN(ms_date) 
      from  adminchat       
      where recipient_nikname = ${req.query.nikname} 
    `
  
  const subscribe = await sql`
      select COUNT(*) 
      from  adminchat       
      where chat = 0 and ms_date > ${admin_all[0].min}  and read = false and (recipient = ${req.query.status} or recipient = 'all')              
    `
  const result = +admin[0].count + +client[0].count + +subscribe[0].count
  console.log(+client[0].count, +admin[0].count, subscribe[0].count)
  res.status(200).send(result)
}