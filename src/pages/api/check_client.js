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
    await client.end()
    res.status(200).json(rows)
}