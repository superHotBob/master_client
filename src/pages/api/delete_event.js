const { Client } = require('pg')

export default async function handler(req, res) {

  const client = new Client(process.env.pg_data)

  await client.connect();

  const { rows } = await client.query(`
    delete from  "events"        
    where "id" = $1
    returning *
  `,[req.query.id])

  await client.end();

  if (rows.length > 0) {
    res.send('Мероприятие удалено')
  } else {
    res.send('')
  }
  
}