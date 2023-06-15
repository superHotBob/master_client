import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)


  if(req.query.abonent === 'администратор') {
    const result = await sql`
    select *
    from ms_admin
    where ms_user_nikname = ${req.query.my_name} 
    
    `
    console.log(result)
    if (result.length > 0) {
      res.status(200).json(result)
    } else {
      res.status(500).json([])
    }
  } else {
    const result = await sql`
          select * 
          from  chat
          where (sendler_nikname = ${req.query.abonent} and recipient_nikname =  ${req.query.my_name}  ) or (
              recipient_nikname = ${req.query.abonent} and sendler_nikname =  ${req.query.my_name}
          )                
        `
    if (result.length > 0) {
      res.status(200).json(result)
    } else {
      res.status(500).json([])
    }
  }
}