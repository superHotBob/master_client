// const IP = require('ip')
export default async function handler(req, res) {
  // const ipAddress =  IP.address()
  
  const st = await fetch('http://localhost:5000/code', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      tel: req.body.tel          
    })
  })
  const txt = await st.text(); 

  
  console.log(req.body.ip,':',req.body.tel)

   if ( txt === 'Enter code' ) {
     res.status(200).send(txt)
   } else {   
     res.status(429).send(txt) 
   }
// //   } else if( st.status === 500) {
// //     res.status(500).send(txt)
// //   } else {
// //     res.status(404).send('code is fall')
// //   }
}