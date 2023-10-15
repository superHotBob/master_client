const { Client } = require('pg')

export default async function handler(req, res) {
    const client = new Client(process.env.pg_data)

    await client.connect();

    await client.query(`
        update "clients" 
        set "nikname" = $1    
        where "nikname" =  $2  
        returning *      
    `, [req.query.newnikname, req.query.oldnikname]);

    console.log(1)
    await client.query(`
        update "masters" 
        set "nikname" = $1    
        where "nikname" =  $2  
        returning *      
    `, [req.query.newnikname, req.query.oldnikname]);
    console.log(2)
    await client.query(`
        update "services" 
        set "nikname" = $1    
        where "nikname" =  $2  
        returning *      
    `, [req.query.newnikname, req.query.oldnikname]);
    console.log(3)
    await client.query(`
        update "schedule" 
        set "nikname" = $1    
        where "nikname" =  $2               
    `, [req.query.newnikname, req.query.oldnikname]);
    console.log(4)

    await client.query(`
        UPDATE "adminchat"
        SET "recipient_nikname" = $1
        where  "recipient_nikname" = $2      
    `, [req.query.newnikname, req.query.oldnikname]
    );
    console.log(5)
    await client.query(`
        UPDATE "adminchat"
        SET "sendler_nikname" = $1
        where  "sendler_nikname" = $2       
    `, [req.query.newnikname, req.query.oldnikname]
    );
    await client.query(`
        UPDATE "chat"
        SET "recipient_nikname" = $1
        where  "recipient_nikname" = $2      
        `, [req.query.newnikname, req.query.oldnikname]
    );
    console.log(5)
    await client.query(`
        UPDATE "chat"
        SET "sendler_nikname" = $1
        where  "sendler_nikname" = $2       
    `, [req.query.newnikname, req.query.oldnikname]
    );

    await client.query(`
        update "images" 
        set "nikname" = $1    
        where "nikname" =  $2             
    `, [req.query.newnikname, req.query.oldnikname]);
    console.log(7)
    await client.query(`
        update "orders" 
        set "master" = $1    
        where "master" =  $2             
    `, [req.query.newnikname, req.query.oldnikname]);
    console.log(8)
    await client.query(`
        update "events"
        set "master_nikname" = $1
        where "master_nikname" =  $2             
    `, [req.query.newnikname, req.query.oldnikname]);

    const { rows: key } = await client.query(`
        select key          
        from "clients"
        where "nikname" = $1
    `, [req.query.newnikname]);
    

    fetch(`http://admin.masters.place/rename_master_icon?oldname=${req.query.oldnikname}&newname=${req.query.newnikname}`)
        .then(res => res.text())
        .then(res => console.log(res))

    await client.end();

    res.setHeader('Set-Cookie', [`key=${key[0].key}; Expires=Wed, 21 Oct 2024 07:28:00 GMT; Path=/;`,
    `nikname=${req.query.newnikname}; Expires=Wed, 21 Oct 2024 07:28:00 GMT; Path=/;`])

    res.status(200).send('Nikname изменён')

}