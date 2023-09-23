const { Client } = require('pg')

export default async function handler(req, res) {

  
  const client = new Client(process.env.pg_data)  
  await client.connect()

  console.log(req.query.ids.split(','))

  const ids = req.query.ids.split(',')
  const rows = []  
  for(const i of ids ) { 
    const { rows } = await client.query(`  
        delete from "images"
        where id = $1 
        `,[+req.query.id]
    ); 
    rows.push(i) 

    fetch(`http://localhost:5000/delete_image?id=${+req.query.id}`, { headers: {    
        'Authorization': 'master'
        },}
    )
    .then(res=>res.text())
    .then(res=>console.log(res))
}

  await client.end()
 
  
  if (rows.length === ids.length) {
    res.status(200).send("Удалено")
  } else {
    res.status(500).send("Ошибка удаления")
  }

}