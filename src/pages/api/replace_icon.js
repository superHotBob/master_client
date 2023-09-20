import fs from "fs";
import { NextResponse } from 'next/server'


// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };
export default async function POST(req,res) {
    // const formData = await req.formData();
   
    // console.log(req)
    
    const buffer = await req;
    
    // const formDataEntryValues = Array.from(formData.values());
    // for (const formDataEntryValue of formDataEntryValues) {
    //   if (typeof formDataEntryValue === "object" && "arrayBuffer" in formDataEntryValue) {
    //     const file = formDataEntryValue 
    //     const buffer = Buffer.from(await file.arrayBuffer());
    //     fs.writeFileSync(`../data/images/${file.name}`, buffer);
    //   }
    // }
    
   
    // // console.log('data',req.body.data)
    fetch(`http://localhost:5000/upl?name=${req.query.name}`, {
        body: req.body.formData,
        method: 'post',
    }).then(res => res.text()).then(res=>console.log(res))


    res.status(200).json([])
}