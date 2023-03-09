// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
 console.log(req.body.tel)
  if (req.body.tel) {
    res.status(200).json({ name: 'Клава' })
  } else {
    res.status(400).json({ name: '' })
  }
  
}
