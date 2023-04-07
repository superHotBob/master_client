import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres('postgres://bobozeranski:ZdxF36OgaSAK@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652')

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
  }
  const nikname = user.user 
  const result = await sql`
    update services set ${sql(user, 'макияж','массаж', 'маникюр', 'педикюр', 'барбер', 'брови', 'прически', 'ресницы', 'стрижка', 'депиляция')
    }
    where master = ${user.user} 

    returning *
  `

  if (result.length > 0) {
    res.end('Сервисы добавлены')
  } else {
    res.end(null)
  }
  delete user.user
  let obj = Object.entries(user).filter(i => i[1].length > 0).map(i => i[0])
  await sql`
    update users 
    set services = ${obj}      
    where nikname = ${nikname}
    returning services
  `
  
}