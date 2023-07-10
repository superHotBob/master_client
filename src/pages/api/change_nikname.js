import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)
    console.log(req.query.newnikname,req.query.oldnikname)
    const result_clients = await sql`
        update clients 
        set nikname = ${req.query.newnikname}    
        where nikname =  ${req.query.oldnikname}  
        returning *      
    `
    console.log(1)
    const result_users = await sql`
        update users 
        set nikname = ${req.query.newnikname}    
        where nikname =  ${req.query.oldnikname}  
        returning  *     
    `
    console.log(2)
    const result_services = await sql`
        update services 
        set nikname = ${req.query.newnikname}    
        where nikname =  ${req.query.oldnikname}  
        returning *      
    `
    console.log(3)
    const result_schedule = await sql`
        update schedule 
        set nikname = ${req.query.newnikname}    
        where nikname =  ${req.query.oldnikname}  
        returning  *     
    `
    console.log(4)
    const result_orders = await sql`
        update schedule 
        set nikname = ${req.query.newnikname}    
        where nikname =  ${req.query.oldnikname}  
        returning  *     
    `
    console.log(5)
    fetch(`https://masters-client.onrender.com/rename_master_dir?oldname=${req.query.oldnikname}&newname=${req.query.newnikname}`)
    .then(res => console.log('GOOD'))

    res.status(200).send('Ok')

}