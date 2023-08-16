import postgres from "postgres"
const IP = require('ip')
export default async function handler(req, res) {
    const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)

    const result = await sql`
        select 
        phone,blocked
        from  clients
        where phone = ${req.query.phone} 
    `
   
    let date_enter = Date.now()
    const ipAddress = IP.address()
    await sql`
        insert into history (
            ip, date_enter, city , phone
        ) values (
            ${ipAddress}, ${date_enter},'Минск',${req.query.phone}
        )
    `
    res.status(200).json(result)
}