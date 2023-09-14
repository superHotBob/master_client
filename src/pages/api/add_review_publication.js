const { Client } = require('pg')

export default async function handler(req, res) { 
 
  const client = new Client(process.env.pg_data)

  await client.connect();
  const { rows } = await client.query(`
      UPDATE "images" 
      SET "review" = $1
      WHERE "id" = +$2
    `,[req.body.review,req.body.id]
  );
  client.end()
  if (rows.length > 0) {
    res.end('Отзыв  добавлен')
  } else {
    res.end(null)
  }  
}