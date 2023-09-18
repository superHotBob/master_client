const { Client } = require('pg')

export default async function handler(req, res) {
 
  const data = {
    nikname: req.body.nikname,
    month: req.body.month,
    schedule: req.body.schedule
  }
 

  const client = new Client(process.env.pg_data)

  await client.connect();

  const { rows } = await client.query(`
        update "schedule"  
        SET ${req.body.month} = $1
        where nikname =  $2
        returning *
      `, [data.schedule, data.nikname]);


  await client.end();
  if (rows.length > 0) {
    res.status(200).json(rows[0])
  } else {
    console.log('Error')
  }
}