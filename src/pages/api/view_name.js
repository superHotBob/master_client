// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { Client } = require('pg')

export default async function handler(req, res) {
  const client = new Client(process.env.pg_data)

  await client.connect();

    const { rows } = await client.query(`
        select nikname
        from "clients"
        where "nikname" = $1
   `,[req.query.nam]);
    client.end();
    console.log(rows)
    res.status(200).json(rows)
}
