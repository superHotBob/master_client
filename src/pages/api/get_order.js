const { Client } = require('pg')

export default async function handler(req, res) {

    const client = new Client(process.env.pg_data)

    await client.connect();

    const { rows } = await client.query(`
    select *
    from "orders"
    where "id" = $1 
  `, [req.query.id]);

  const { rows: master_address } = await client.query(`
  select   address, address_full  
  from "masters"
  where "nikname" = $1 
`, [rows[0].master]);

   
    const address = Object.assign(rows[0],master_address[0].address_full,{ улица:master_address[0].address })
   

    await client.end();
    if (rows.length > 0) {
        res.status(200).json(address)
    } else {
        res.json([])
    }

}