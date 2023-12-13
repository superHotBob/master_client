const { Client } = require('pg')

export default async function handler(req, res) {
  const {locations,nikname,address,address_full, city, state} = req.body
  const client = new Client(process.env.pg_data)

  await client.connect();

  const { rows } = await client.query(`
        update "masters" 
        set "locations" = $1, "address" = $3 , "address_full" = $4, "city" = $5, "state" = $6
        where "nikname" =  $2
        returning text, address, state, address_full, city, currency, locations, name, nikname, sertificats, stars, tema, status  
      `, [locations, nikname, address, address_full, city, state])


  await client.end();
  if (rows.length > 0) {
    res.status(200).json(rows[0])
  } else {
    res.status(500).json({ message: 'Error' })
  }
}