import postgres from "postgres"

export default async function handler(req, res) {
  const sql = postgres('postgres://bobozeranski:ZdxF36OgaSAK@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652')
  const rev ={
    id: req.body.id,    
    review: req.body.review
  }
  
  const result = await sql`
    update images 
    set ${
      sql(rev, 'review')
    }
    where id = ${rev.id} 

    returning *
  `

  if (result.length > 0) {
    res.end('Отзыв  добавлен')
  } else {
    res.end(null)
  }
  
}