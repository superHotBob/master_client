// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres"

export default async function handler(req, res) {
  // const sql = postgres('postgres://bobozeranski:ZdxF36OgaSAK@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652')
  // // const result = await sql.query("select * from users", function(err, result, fields) {
  // //   if (err) throw err;
  // //   console.log(result);
  // // });
  // const result = await sql`
  // select
  //   username,
  //   password
  // from users`
 
  // console.log(result);
  if (+req.body.tel === 375111111111) {
    res.status(200).json({ status: 'master', name: 'Клава' })
  } else if (+req.body.tel === 375000000000) {
    res.status(400).json({ status: 'client', name: 'Зина' })
  } else {
    res.status(400).json({ name: '' })
  }
  
}
