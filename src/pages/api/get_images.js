const { Client } = require('pg')

export default async function handler(req, res) {
  const client = new Client(process.env.pg_data)

  await client.connect();
  const { rows } = await client.query(`
    select 
      CAST("rating" AS integer),
      CAST("id" AS integer),
      CAST("img_date" AS bigint),
      CAST("city" AS character varying),
      CAST("service" AS character varying),
      CAST("nikname" AS character varying),
      CAST("master_name" AS character varying),
      CAST("review" AS character varying)
    from "images"
    where "nikname" = $1 and "service" != 'sertificat'
    order by "rating" DESC
  `,[req.query.nikname]);

 

  await client.end();
  if (rows.length) {
    res.status(200).json(rows)
  } else {
    res.json([])
  }

}