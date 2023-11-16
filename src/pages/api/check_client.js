// const IP = require('ip')
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

   let responce = await fetch('https://ipgeolocation.abstractapi.com/v1/?api_key=ecc713e733a64a24bd32521c2f47be98')
   let data = await responce.json()    
   

    let date_enter = Date.now()
    // const ipAddress = IP.address()
    await client.query(
        `INSERT INTO "history" ("ip", "date_enter", "city" , "phone")  
        VALUES ($1, $2,$3,$4)`
        , [data.ip_address, date_enter, data.city, req.query.phone]
    )
    await client.end()
    res.status(200).json(rows)
}