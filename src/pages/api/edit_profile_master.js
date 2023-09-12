// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres"
const { Client } = require('pg')
export default async function handler(req, res) {
    const sql = postgres(`postgres://bobozeranski:${process.env.DATABASE_API}@ep-yellow-mountain-679652.eu-central-1.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-yellow-mountain-679652`)
    const client = new Client(process.env.pg_data)
    await client.connect();
   
    const master = {
        nikname: req.body.nikname,
        name: req.body.name,       
        text: req.body.text,
        currency: req.body.currency ,        
        address_full: req.body.address_full,
        address: req.body.address,
        city: req.body.city,
        tema: req.body.tema,
        locations: req.body.locations
    }


    const {rows: result_master } = await client.query(`
      update "masters"
      set city = $2, name = $3, address = $4, text = $5, 
      nikname = $1, currency = $6 , address_full = $7,locations = $8,tema = $9   
      where "nikname" =  $1
      returning  nikname,name,text,currency,status,address,city,tema,locations, stars, services
    `,[req.body.nikname,req.body.city,req.body.name,req.body.address,
        req.body.text,req.body.currency,req.body.address_full,req.body.locations,req.body.tema]
    );
    await client.query(`
            update "clients" 
            set "name" = $1    
            where "nikname" =  $2
            returning *
        `,
    [req.body.name,req.body.nikname]);

    if (result_master.length > 0) {
        res.status(200).json(result_master[0])
    } else {
        console.log('Error')
    }


}



