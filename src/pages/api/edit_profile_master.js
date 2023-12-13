const { Client } = require('pg')

export default async function handler(req, res) {
    const {nikname, name, text,currency,tema,city, state} = req.body;

    const client = new Client(process.env.pg_data)
    await client.connect();



    const { rows: result_master } = await client.query(`
      update "masters"
      set city = $2, name = $3, text = $4, currency = $5 , tema = $6, state = $7
      where "nikname" =  $1
      returning  state, nikname,name,text,currency,status,address,city,tema,locations, stars, services, address_full
    `, [nikname, city, name, text, currency,  tema, state]
    );
    await client.query(`
            update "clients" 
            set "name" = $1    
            where "nikname" =  $2           
    `, [name, nikname]);


    await client.query(`
        UPDATE "adminchat"
        SET "recipient" = $1
        where  "recipient_nikname" = $2       
        `, [name, nikname]
    );
    
    await client.query(`
        UPDATE "adminchat"
        SET "sendler" = $1
        where  "sendler_nikname" = $2       
        `, [ name, nikname]
    );
    

    await client.query(`
        UPDATE "chat"
        SET "recipient" = $1
        where  "recipient_nikname" = $2       
        `, [name, nikname]
    );
    
    await client.query(`
        UPDATE "chat"
        SET "sendler" = $1
        where  "sendler_nikname" = $2       
        `, [name, nikname]
    );
    
    await client.query(`
        update "images" 
        set master_name = $1    
        where nikname =  $2             
    `, [name, nikname]);
    
    await client.end()

    if (result_master.length > 0) {
        res.status(200).json(result_master[0])
    } else {
        console.log('Error')
    }


}



