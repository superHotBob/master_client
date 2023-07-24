import postgres from "postgres"

export default async function handler(req, res) {
    const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)
    console.log(req.query.newnikname, req.query.oldnikname)
    await sql`
        update clients 
        set nikname = ${req.query.newnikname}    
        where nikname =  ${req.query.oldnikname}  
        returning *      
    `
    console.log(1)
    await sql`
        update users 
        set nikname = ${req.query.newnikname}    
        where nikname =  ${req.query.oldnikname}  
        returning  *     
    `
    console.log(2)
    await sql`
        update services 
        set nikname = ${req.query.newnikname}    
        where nikname =  ${req.query.oldnikname}  
        returning *      
    `
    console.log(3)
    await sql`
        update schedule 
        set nikname = ${req.query.newnikname}    
        where nikname =  ${req.query.oldnikname}  
        returning  *     
    `
    console.log(4)
    await sql`
        update adminchat 
        set sendler_nikname = ${req.query.newnikname},
            recipient_nikname =  ${req.query.newnikname}
        where recipient_nikname =  ${req.query.oldnikname} or sendler_nikname = ${req.query.oldnikname}
        returning  *     
    `
    console.log(5)

    await sql`
        update chat 
        set sendler_nikname = ${req.query.newnikname},
            recipient_nikname =  ${req.query.newnikname}
        where recipient_nikname =  ${req.query.oldnikname} or sendler_nikname = ${req.query.oldnikname}
        returning  *     
    `
    console.log(6)
    await sql`
        update images 
        set nikname = ${req.query.newnikname}    
        where nikname =  ${req.query.oldnikname}  
        returning  *     
    `
    console.log(7)
    await sql`
        update orders 
        set master = ${req.query.newnikname}    
        where master =  ${req.query.oldnikname}  
        returning  *     
    `
    fetch(`https://masters-client.onrender.com/rename_master_dir?oldname=${req.query.oldnikname}&newname=${req.query.newnikname}`)
    .then(res => console.log('GOOD'))

    res.status(200).send('Ok')

}