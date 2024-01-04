const { Client } = require('pg')

export default async function handler(req, res) {

  const client = new Client(process.env.pg_data)

  await client.connect();
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
  const { rows } = await client.query(`
    delete from  "orders"        
    where "id" = $1
    returning *
  `, [req.body.id])

  const {rows: message } = await client.query(`
    delete from "chat"
    where "ms_text" = $1
  `,[req.body.id])

  

  let month = months[rows[0].order_month -1].toLowerCase()
  let day = rows[0].date_order[0]
  let time = rows[0].date_order[1]

  console.log(rows[0].master, month)

  const columns = [month]

  const { rows: schedule } = await client.query(`
    select ${columns} from "schedule" 
    where "nikname" = $1 
  `,[rows[0].master])

  let new_schedule = schedule[0][month]

  let new_schedule_day = new_schedule[day-1]
  new_schedule_day = new_schedule_day ? new_schedule_day + ',' + time : time
  
  new_schedule[day-1] = new_schedule_day

 

  


  await client.query(`
    update "schedule"
    SET ${columns} = $1
    WHERE "nikname" = $2
  `, [new_schedule, rows[0].master])


  await client.query(`
    update "clients" 
    set "rating" = rating - 1
    where "nikname" = $1
  `, [rows[0].master])

  await client.query(`
    update "masters" 
    set "rating" = rating - 1
    where nikname = $1
  `, [rows[0].master])

  await client.end()

  if (rows.length > 0) {
    res.end('Заказ удален')
  } else {
    res.end(null)
  }

}