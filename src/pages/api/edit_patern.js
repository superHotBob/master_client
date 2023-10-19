
const { Client } = require('pg')

export default async function handler(req, res) {
 

  const client = new Client(process.env.pg_data)
  await client.connect();
  const { rows: result } = await client.query(`
      UPDATE "schedule" 
      SET "patern" = $1
      where "nikname" = $2
      returning patern
    `,[req.body.patern,req.body.nikname]);
  
     
 
  await client.end()
  if (result.length > 0) {
    res.status(200).send('Шаблон сохранён')
  } else {
    res.status(500).send('Ошибка сохранения шаблона')
  }
}