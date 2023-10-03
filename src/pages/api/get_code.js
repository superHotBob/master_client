const IP = require('ip')
export default async function handler(req, res) {
  const ipAddress = IP.address()

  // let ips = []
  // let calls = {}
  // const code = 1234

  // ips.push(ipAddress)

 

  // if(calls[req.body.tel] === +req.body.number ){
  //   console.log('1',ipAddress,ips,calls) 
  //   res.status(200).end("OK")
  // } else if( calls[req.body.tel] === undefined ){ 
  //     //     client.call.send({to: req.body.tel})
  //     //    .then((responce) => {
  //     //         calls[req.body.tel] = +responce.code
  //     //         console.log(responce.code)       
  //     //         res.end("OK")   
  //     //     })

  //     calls[req.body.tel] = code
  //     console.log('2',ipAddress,ips,calls) 
  //     res.status(200).json([])      
  // } else if( calls[req.body.tel] != +req.body.number ) {
  //     //     client.call.send({to: req.body.tel})
  //     //    .then((responce) => {
  //     //         calls[req.body.tel] = +responce.code
  //     //         console.log(responce.code)       
  //     //         res.end("OK")   
  //     //     })

  //     calls[req.body.tel] = code
  //     console.log('3',ipAddress,ips,calls) 
  //     res.status(200).json([])      

  // } else {
  //   console.log('4',ipAddress,ips,calls) 
  //   res.status(400).json([])
  // }
  // console.log('4',ipAddress,ips,calls) 
  const st = await fetch('http://localhost:5000/call', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      tel: req.body.tel,
      code: req.body.number,
      ip: ipAddress
    })
  })
  const txt = await st.text();
 


  

  if ( txt === 'Code is good' ) {
    res.status(200).send(st)
  } else if ( txt === 'Enter code' ) {
    res.status(400).send(st) 
  } else if( st.status === 500) {
    res.status(500).send(txt)
  } else {
    res.status(404).send('code is fall')
  }

}