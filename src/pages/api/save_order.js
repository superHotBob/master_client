const { Client } = require('pg')

export default async function handler(req, res) {

  const { master_nikname, client_nikname, order, price, date, master_name, client_name, month, myorder, year} = req.body

  const client = new Client(process.env.pg_data)

  await client.connect()

  const { rows: save_order } = await client.query(`
    insert into "orders" ( master, client,neworder,price,date_order,master_name,client_name,order_month,myorder,year ) 
    values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) 
    returning *   
  `, [master_nikname, client_nikname, order, price, date, master_name, client_name, month, myorder, year]
  );


  const { rows: chat } = await client.query(`
    select (chat)
    from "chat"
    where (recipient_nikname = $1 and sendler_nikname = $2 ) or 
    (recipient_nikname = $2 and sendler_nikname = $1 )
  `, [master_nikname, client_nikname]);

  let my_chat = null
  if (chat.length === 0) {
    const { rows: max_chat } = await client.query("select Max(chat) from chat");

    my_chat = +max_chat[0].max + 1
  } else {
    my_chat = +chat[0]['chat']
  }

  




  const text = save_order[0]['id']; 
  const new_date = Date.now()

  await client.query(`
    insert into "chat" (recipient,recipient_nikname,sendler,sendler_nikname,ms_text,ms_date,chat) 
    values ($1,$2,$3,$4,$5,$6,$7)  
    returning *
  `, [client_name, client_nikname, master_name, master_nikname, text, new_date, my_chat]);




  await client.query(`
    update "clients" 
    set "rating" = rating::int + 1 
    where "nikname" = $1
  `, [master_nikname]);

  await client.query(`
    update "masters" 
    set "rating" = rating::int + 1 
    where "nikname" = $1
  `, [master_nikname]);

  await client.end();
  res.send('Ok');
}