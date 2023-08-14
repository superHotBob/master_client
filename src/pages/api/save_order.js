import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres('postgres://bobozeranski:ZdxF36OgaSAK@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652')
  
 

  const save_order = await sql`
  insert into orders (
    master, client,neworder,price,date_order,master_name,client_name,read,order_month
  ) values (
    ${req.body.master}, 
    ${req.body.client},
    ${req.body.order},
    ${req.body.price},
    ${req.body.date},
    ${req.body.master_name},
    ${req.body.client_name},
    'f',
    ${req.body.month}
  )
  returning id
  ` 
  

  const chat = await sql`
    select (chat)
    from chat
    where (recipient_nikname = ${req.body.master} and sendler_nikname = ${req.body.client}) or 
    (recipient_nikname = ${req.body.client} and sendler_nikname = ${req.body.master})
  `
 
  let my_chat = null
  if(chat.length === 0 ) {
    const max_chat = await sql`
      select Max(chat) from chat
    `
   my_chat = +max_chat[0].max + 1
  } else {
    my_chat =  +chat[0]['chat']
  }
 
  const order = req.body.order.map(i=>i.split(':')).map(i=>i[0]).join()
 
  const text = `Cоздан заказ ; ${save_order[0]['id']};${order};
  Детали заказа:;
  Дата встречи: ${req.body.date.replace(/,/g,' , ')}; 
  Адрес встечи: ${req.body.address};
  ${req.body.price}`
  const date = Date.now()
  const send_message = await sql`
    insert into chat (recipient,recipient_nikname,sendler,sendler_nikname,ms_text,ms_date,chat, read) 
    values (
      ${req.body.client_name},
      ${req.body.client},
      ${req.body.master_name},
      ${req.body.master},     
      ${text},
      ${date},
      ${my_chat},
      'f'
    )  
    returning *
  `

  await sql`
    update clients 
    set rating = rating + 1
    where nikname = ${req.body.master}
  `
   await sql`
    update users 
    set rating = rating + 1
    where nikname = ${req.body.master}
  `
  res.send('Ok')     
  
  
}