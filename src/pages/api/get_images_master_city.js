const { Client } = require('pg')

export default async function handler(req, res) { 
 
  const client = new Client(process.env.pg_data)

  await client.connect();

  

  
  const { rows } = await client.query(`
  select id,img_date,master_name,nikname,review
    from "images"
    where "city" = $1 and  "service" = $2 
    order  by img_date DESC   
  `,[req.query.city,req.query.service ]);

  await client.end();
 
  res.status(200).json({one: rows.filter((i, index) => index % 2 === 0), two: rows.filter((i, index) => index % 2 !== 0)})


}