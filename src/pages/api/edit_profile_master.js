const { Client } = require('pg')

export default async function handler(req, res) {

    const client = new Client(process.env.pg_data)
    await client.connect();



    const { rows: result_master } = await client.query(`
      update "masters"
      set city = $2, name = $3, address = $4, text = $5, 
      nikname = $1, currency = $6 , address_full = $7,locations = $8,tema = $9   
      where "nikname" =  $1
      returning  nikname,name,text,currency,status,address,city,tema,locations, stars, services, address_full
    `, [req.body.nikname, req.body.city, req.body.name, req.body.address,
    req.body.text, req.body.currency, req.body.address_full, req.body.locations, req.body.tema]
    );
    await client.query(`
            update "clients" 
            set "name" = $1    
            where "nikname" =  $2           
    `, [req.body.name, req.body.nikname]);


    await client.query(`
        UPDATE "adminchat"
        SET "recipient" = $1
        where  "recipient_nikname" = $2       
        `, [req.body.name, req.body.nikname]
    );
    
    await client.query(`
        UPDATE "adminchat"
        SET "sendler" = $1
        where  "sendler_nikname" = $2       
        `, [req.body.name, req.body.nikname]
    );
    

    await client.query(`
        UPDATE "chat"
        SET "recipient" = $1
        where  "recipient_nikname" = $2       
        `, [req.body.name, req.body.nikname]
    );
    
    await client.query(`
        UPDATE "chat"
        SET "sendler" = $1
        where  "sendler_nikname" = $2       
        `, [req.body.name, req.body.nikname]
    );
    
    await client.query(`
        update "images" 
        set master_name = $1    
        where nikname =  $2             
    `, [req.body.name, req.body.nikname]);
    
    await client.end()

    if (result_master.length > 0) {
        res.status(200).json(result_master[0])
    } else {
        console.log('Error')
    }


}



