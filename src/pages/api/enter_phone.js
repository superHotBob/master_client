// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
 console.log(req.body.tel)
  if (+req.body.tel === 375111111111) {
    res.status(200).json({ status: 'master', name: 'Клава' })
  } else if (+req.body.tel === 375000000000) {
    res.status(400).json({ status: 'client', name: 'Зина' })
  } else {
    res.status(400).json({ name: '' })
  }
  
}
