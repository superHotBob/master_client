const { Client } = require('pg')

export default async function handler(req, res) { 
 
  const client = new Client(process.env.pg_data)

  await client.connect();
  const { rows } = await client.query(`
  select *
    from "images"
    where city = $1 and  service = $2
    order  by img_date DESC
    limit $3 offset $4
  `,[req.query.city,req.query.service, req.query.limit,req.query.offset ]);

  client.end();
  if (rows.length) {
    res.status(200).json(rows)
  } else {
    res.json([])
  }

}