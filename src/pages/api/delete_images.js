const { Client } = require('pg')

export default async function handler(req, res) {

  
  const client = new Client(process.env.pg_data)  
  await client.connect()

  const { rows } = await client.query(`  
    delete from "images"
    where id = $1 
    `,[req.query.id]
  );
  fetch(`http://localhost:5000/delete_image?id=${req.query.id}`,{ headers: {'Authorization': 'master'},}) 
  .then(res=>res.text())
  .then(res=>console.log(res))

  await client.end()
  
  if (rows.length) {
    res.status(200).text("Удалено")
  } else {
    res.json([])
  }

}