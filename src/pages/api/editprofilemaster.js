// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres"

export default async function handler(req, res) {
    const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)

    const master = {
        nikname: req.body.nikname,
        name: req.body.name,
        image: req.body.image,
        text: req.body.text,
        currency: req.body.currency ,       
        color: req.body.color,
        address_full: req.body.address_full,
        address: req.body.address,
        city: req.body.city,
        locations: req.body.locations
    }


    const result = await sql`
      update users set ${sql(master, 'city', 'name','address', 'text', 'nikname','currency','color','address_full','locations')}    
      where nikname =  ${master.nikname}
      returning *
    `
    if (result.length > 0) {
        res.status(200).json(result[0])
    } else {
        console.log('Error')
    }


}



