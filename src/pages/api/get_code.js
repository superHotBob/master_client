const IP = require('ip')
export default async function handler(req, res) {
  // const ipAddress =  IP.address()
  
  const st = await fetch('http://localhost:5000/call', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      tel: req.body.tel,
      code: req.body.number,
      ip: req.body.ip
    })
  })
  const txt = await st.text(); 

  console.log(req.body.ip,':',req.body.tel, ':', req.body.number)

  if ( txt === 'Code is good' ) {
    res.status(200).send(st)
  } else if ( txt === 'Enter code' ) {   
    res.status(400).send('Enter code') 
  } else if( st.status === 500) {
    res.status(500).send(txt)
  } else if( st.status === 429) {
    res.status(429).send(txt)  
  }
  else {
    res.status(404).send('code is fall')
  }
}