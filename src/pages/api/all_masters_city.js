const { Client } = require('pg')

export default async function handler(req, res) {

  const client = new Client(process.env.pg_data)

  await client.connect();
    const {rows: result } = await client.query(`
        select nikname, name,stars,address, services,locations
        from "masters" 
        where $1 = ANY (services) and city = $2 and buy = true
        order by rating DESC
   `,[req.query.service, req.query.city]);

    await client.end();
    
    if (result.length > 0) {
        res.status(200).json(result)
    } else {
        res.status(200).json([])
    }

}
