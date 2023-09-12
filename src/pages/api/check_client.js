const IP = require('ip')
const { Client } = require('pg')


export default async function handler(req, res) {    
    const client = new Client({
        user: 'client',
        host: '5.35.5.23',
        database: 'postgres',
        password: 'client123',
        port: 5432,
    })
    await client.connect();
    const { rows }  = await client.query(`
        select *
        from  "clients"
        where "phone" = $1`
        ,[req.query.phone]
    );

    console.log(rows.length === 0 ? 'Это новый клиент' : rows[0].phone)
   
    let date_enter = Date.now()
    const ipAddress = IP.address()

   
    await client.query(
        `INSERT INTO "history" ("ip", "date_enter", "city" , "phone")  
        VALUES ($1, $2,$3,$4)`
        , [ipAddress, date_enter, 'Минск', req.query.phone]
    );
    console.log('IP inserted  to history');


    res.status(200).json(rows)
}