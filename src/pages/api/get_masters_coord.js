const { Client } = require('pg')

export default async function handler(req, res) {

  const client = new Client(process.env.pg_data)

  await client.connect(); 
  const coords =  req.query.coord.split(',').map(i=>+i)
    const {rows: result } = await client.query(`
        select nikname, name,stars,address, services,locations
        from "masters" 
        where $1 = ANY (services) and buy = true and cast( locations [1] as numeric) > $2 and 
        cast( locations [2] as numeric) > $3 and cast( locations [1] as numeric) < $4 
        and cast( locations [2] as numeric) < $5
        order by rating DESC
   `,[req.query.service, coords[0], coords[1], coords[2], coords[3]]);

    await client.end();
    
    if (result.length > 0) {
        res.status(200).json(result)
    } else {
        res.status(200).json([])
    }

}
