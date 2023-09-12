const { Client } = require('pg')

export default async function handler(req, res) {
  const client = new Client(process.env.pg_data)

  await client.connect();
  const user = {
    user: req.body.nikname,
    педикюр: req.body.педикюр || [],
    массаж: req.body.массаж || [],
    маникюр: req.body.маникюр || [],
    макияж: req.body.макияж || [],
    барбер: req.body.барбер || [],
    брови: req.body.брови || [],
    прически: req.body.прически || [],
    ресницы: req.body.ресницы || [],
    стрижка: req.body.стрижка || [],
    депиляция: req.body.депиляция || [],
    чистка: req.body.чистка || [],
    окрашивание: req.body.окрашивание || []
  }
  const nikname = user.user 
  const result = await client.query(`
    update "services"
    set макияж = $2 ,массаж = $3, маникюр = $4, 
    педикюр = $5, барбер = $6, брови = $7, прически = $8, ресницы = $9, 
    стрижка = $10, депиляция = $11, чистка = $12 ,окрашивание = $13
    
    where "nikname" = $1
    returning *
  `,[req.body.nikname, req.body.макияж, req.body.массаж, req.body.маникюр, req.body.педикюр, 
    req.body.барбер, req.body.брови, req.body.прически, req.body.ресницы, req.body.стрижка, 
    req.body.депиляция, req.body.чистка, req.body.окрашивание  ]
  );

 
  delete user.user
  let obj = Object.entries(user).filter(i => i[1].length > 0).map(i => i[0])
  const {rows } = await client.query(`
    update "masters" 
    set services = $1      
    where "nikname" = $2
    returning services
  `,[obj,req.body.nikname]);

  console.log(rows, obj)

  client.end();
  if (result.length > 0) {
    res.end('Сервисы добавлены')
  } else {
    res.end(null)
  }
}