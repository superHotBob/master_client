const { Client } = require('pg')

export default async function handler(req, res) {
  const client = new Client(process.env.pg_data)

  await client.connect();
  const { rows } = await client.query(`
    select *
    from "images"
    where "nikname" = $1 and "service" != $3
    order by $2 desc
  `,[req.query.nikname,'rating','sertificat']);

  await client.end();
  if (rows.length) {
    res.status(200).json(rows)
  } else {
    res.json([])
  }

}