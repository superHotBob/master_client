const { Client } = require('pg')

export default async function handler(req, res) {

  const client = new Client(process.env.pg_data)

  await client.connect();
  await client.query(`
  insert into "orders" (
    master, client,neworder,price,date_order,master_name,client_name,order_month
  ) values ($1,$2,$3,$4,$5,$6,$7,$8)
  returning id
  `, [req.body.master, req.body.client, req.body.order, req.body.price,
     req.body.date, req.body.master_name, req.body.client_name, req.body.month]
  );


  const { rows: chat } = await client.query(`
    select (chat)
    from "chat"
    where (recipient_nikname = $1 and sendler_nikname = $2 ) or 
    (recipient_nikname = $2 and sendler_nikname = $1 )
  `, [req.body.master, req.body.client]);

  let my_chat = null
  if (chat.length === 0) {
    const { rows: max_chat } = await client.query("select Max(chat) from chat");

    my_chat = +max_chat[0].max + 1
  } else {
    my_chat = +chat[0]['chat']
  }

  const order = req.body.order.map(i => i.split(':')).map(i => i[0]).join()

  const text = `Cоздан заказ ; ${save_order[0]['id']};${order};
  Детали заказа:;
  Дата встречи: ${req.body.date.replace(/,/g, ' , ')}; 
  Адрес встечи: ${req.body.address};
  ${req.body.price}`
  const date = Date.now()
  await client.query(`
    insert into "chat" (recipient,recipient_nikname,sendler,sendler_nikname,ms_text,ms_date,chat) 
    values ($1,$2,$3,$4,$5,$6,$7)  
    returning *
  `, [req.body.client_name, req.body.client, req.body.master_name, req.body.master, text, date, my_chat]);

  await client.query(`
    update "clients" 
    set "rating" = rating + 1 
    where "nikname" = $1
  `, [req.body.master]);

  await client.query(`
    update "masters" 
    set "rating" = rating + 1 
    where "nikname" = $1
  `, [req.body.master]);

  client.end();

  res.send('Ok');
}