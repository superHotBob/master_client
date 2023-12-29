const { Client } = require('pg')

export default async function handler(req, res) {
    const client = new Client(process.env.pg_data)
    const {newnikname, oldnikname} = req.query;

    await client.connect();

    await client.query(`
        update "clients" 
        set "nikname" = $1    
        where "nikname" =  $2  
        returning *      
    `, [newnikname, oldnikname]);

   
    await client.query(`
        update "masters" 
        set "nikname" = $1    
        where "nikname" =  $2  
        returning *      
    `, [newnikname, oldnikname]);
    
    await client.query(`
        update "services" 
        set "nikname" = $1    
        where "nikname" =  $2  
        returning *      
    `, [newnikname, oldnikname]);
   
    await client.query(`
        update "schedule" 
        set "nikname" = $1    
        where "nikname" =  $2               
    `, [newnikname, oldnikname]);
    

    await client.query(`
        UPDATE "adminchat"
        SET "recipient_nikname" = $1
        where  "recipient_nikname" = $2      
    `, [newnikname, oldnikname]
    );
    
    await client.query(`
        UPDATE "adminchat"
        SET "sendler_nikname" = $1
        where  "sendler_nikname" = $2       
    `, [newnikname, oldnikname]
    );
    await client.query(`
        UPDATE "chat"
        SET "recipient_nikname" = $1
        where  "recipient_nikname" = $2      
        `, [newnikname, oldnikname]
    );
   
    await client.query(`
        UPDATE "chat"
        SET "sendler_nikname" = $1
        where  "sendler_nikname" = $2       
    `, [newnikname, oldnikname]
    );

    await client.query(`
        update "images" 
        set "nikname" = $1    
        where "nikname" =  $2             
    `, [newnikname, oldnikname]);
   
    await client.query(`
        update "orders" 
        set "master" = $1    
        where "master" =  $2             
    `, [newnikname, oldnikname]);
    
    await client.query(`
        update "events"
        set "master_nikname" = $1
        where "master_nikname" =  $2             
    `, [newnikname, oldnikname]);

    const { rows: key } = await client.query(`
        select key          
        from "clients"
        where "nikname" = $1
    `, [newnikname]);
    

    fetch(`https://admin.masters.place/rename_master_icon?oldname=${oldnikname}&newname=${newnikname}`)
        .then(res => res.text())
        .then(res => console.log(res))

    await client.end();

    res.setHeader('Set-Cookie', [`key=${key[0].key}; Expires=Wed, 21 Oct 2024 07:28:00 GMT; Path=/;`,
    `nikname=${newnikname}; Expires=Wed, 21 Oct 2024 07:28:00 GMT; Path=/;`])

    res.status(200).send('Никнэйм изменён')

}