
const { Client } = require('pg')


export default async function handler(req, res) {
    const client = new Client(process.env.pg_data)

    await client.connect()

    const { rows } = await client.query(`
        select phone, blocked
        from  "clients"
        where "phone" = $1 
        `, [+req.query.phone]
    );

 
   
    
    let date_enter = Date.now()
   
    await client.query(
        `INSERT INTO "history" ("ip", "date_enter", "city" , "phone")  
        VALUES ($1, $2, $3, $4)`
        , [req.query.ip_address, date_enter, req.query.city, req.query.phone]
    )
    await client.end()
    res.status(200).json(rows)
}