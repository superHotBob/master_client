const { Client } = require('pg')

export default async function handler(req, res) {

  const data = {
    nikname: req.body.nikname,
    month: req.body.month,
    schedule: req.body.schedule,
    year: req.body.year
  }


  const client = new Client(process.env.pg_data)

  await client.connect();

  const { rows: schedule } = await client.query(`
    select "year" from "schedule"
    where "year" = $2 and "nikname" = $1
  `, [data.nikname, data.year]);

  if (schedule.length > 0) {
    const { rows } = await client.query(`
    update "schedule"  
    SET ${req.body.month} = $1
    where "nikname" =  $2 and "year" = $3
    returning *
  `, [data.schedule, data.nikname, data.year]);
    await client.end();
    res.status(200).json(rows[0])

  } else {
    await client.query(`
    insert into "schedule" (nikname, year)
    values($1,$2)  
    `,[data.nikname,data.year]);


    const { rows } = await client.query(`
    update "schedule"  
    SET ${req.body.month} = $1
    where nikname =  $2 and "year" = $3
    returning *
   
  `, [data.schedule, data.nikname, data.year]);
    await client.end();
    res.status(200).json(rows[0])
  }






  // if (rows.length > 0) {

  // } else {
  //   res.status(200).json([])
  // }
}