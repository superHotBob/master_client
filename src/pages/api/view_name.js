// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { Client } = require('pg')

export default async function handler(req, res) {
  const client = new Client(process.env.pg_data)

  await client.connect();

    const { rows } = await client.query(`
        select Count(nikname)
        from "clients"
        where "nikname" = $1 
       
   `,[req.query.name]);
   

    await client.end();
    
    res.status(200).send(rows[0].count)
}
