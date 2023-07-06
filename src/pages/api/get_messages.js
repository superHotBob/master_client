import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)

  const client = await sql`
        select * from (
          select distinct on ( chat ) *         
          from  chat       
          where recipient_nikname = ${req.query.nikname} or sendler_nikname =  ${req.query.nikname} 
          order by chat, ms_date desc
        ) chat
                
      `

  const admin = await sql`
        select * from (
          select distinct on ( chat ) *         
          from  adminchat       
          where recipient_nikname = ${req.query.nikname} 
          or sendler_nikname =  ${req.query.nikname}        
          order by chat, ms_date desc
        ) chat
                
      `

  const subscribe = await sql`
      select * from (
        select distinct on ( chat ) *         
        from  chat       
        where chat = 0 and ( recipient = ${req.query.status} or recipient = 'all')
        order by chat, ms_date desc
      ) chat
              
    `
  

  const result = {
    admin: admin,
    client: client,
    subscribe: subscribe
  } 
  if((+admin[0] ? +admin[0].ms_date : 0) > +subscribe[0].ms_date) {
    delete result['subscribe']
  } else {
    result['admin'] = result['subscribe']
    delete result['subscribe']
  }

  res.status(200).json(result)

}