const { Client } = require('pg')

export default async function handler(req, res) {
  const client = new Client(process.env.pg_data)

  await client.connect();
  
  
  
  
  const { rows:result } = await client.query(`
    update "orders" 
    set "stars" = $2 ,"review" = $3    
    where "id" = $1
    returning *
  `,[req.body.id,req.body.stars,req.body.review])

  

  const { rows:average } = await client.query(`
    select AVG(stars) as avg from "orders" 
    where "master" = $1
  `,[req.body.nikname]) 

  const { rows: count_orders } = await client.query(`
    select Count(id) from "orders" 
    where "master" = $1
  `,[req.body.nikname]) 
 
  const ave = (+average[0].avg).toFixed(1)
  
  await client.query(`
    update "masters" 
    set "stars" = $1
    where "nikname" = $2
  `,[ave,req.body.nikname]) 

  await client.query(`
    update "masters" 
    set "rating" = $1
    where "nikname" = $2
  `,[(+count_orders[0].count + +ave).toFixed(0),req.body.nikname])  

  await client.query(`
    update "clients" 
    set "rating" = $1
    where "nikname" = $2
    `,[(+count_orders[0].count + +ave).toFixed(0),req.body.nikname]
  )
  await client.end()
  if (result.length > 0) {
    res.status(200).send('Отзыв  добавлен')
  } else {
    res.status(500).send("Ошибка добавления отзыва")
  }
  
}