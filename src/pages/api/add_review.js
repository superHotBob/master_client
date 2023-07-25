import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres('postgres://bobozeranski:ZdxF36OgaSAK@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652')
  const rev ={
    id: req.body.id,
    stars: req.body.stars,
    review: req.body.review
  }
  
  const result = await sql`
    update orders 
    set ${
      sql(rev, 'stars', 'review')
    }
    where id = ${rev.id} 

    returning *
  `
  const average = await sql`
    select AVG(stars) as avg from orders 
    where master = ${req.body.nikname}
  ` 
  console.log(average)
  const ave = (+average[0].avg).toFixed(1)
  const update_stars = await sql`
    update users 
    set stars = ${ave}
    where nikname = ${req.body.nikname}
  `  


  if (result.length > 0) {
    res.end('Отзыв  добавлен')
  } else {
    res.end(null)
  }
  
}