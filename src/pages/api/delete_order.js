const { Client } = require('pg')

export default async function handler(req, res) {

  const client = new Client(process.env.pg_data)

  await client.connect();
  const months = [
    'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
    'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
  const { rows } = await client.query(`
    delete from  "orders"        
    where "id" = $1
    returning *
  `, [req.body.id])

  const {rows: message } = await client.query(`
    delete from "chat"
    where "ms_text" = $1
  `,[req.body.id])

  

  const month = months[rows[0].order_month -1]
  const day = rows[0].date_order[0]
  const time = rows[0].date_order[1]

  

  const columns = [month]

  const { rows: schedule } = await client.query(`
    select ${columns} from "schedule" 
    where "nikname" = $1 
  `,[req.body.nikname])

  let new_schedule = schedule[0][month]

  let new_schedule_day = new_schedule[day-1]
  new_schedule_day = new_schedule_day ? new_schedule_day + ',' + time : time
  
  new_schedule[day-1] = new_schedule_day

 

  


  const { rows: master_new_schedule } = await client.query(`
    update "schedule"
    SET ${columns} = $1
    WHERE "nikname" = $2
   
  `, [new_schedule, req.body.nikname])

    console.log(master_new_schedule)


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