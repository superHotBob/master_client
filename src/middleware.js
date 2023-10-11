import { NextResponse } from 'next/server';




export async function middleware(request, res) {

  

 console.log(Math.random().toString(36).slice(-12))

  if (request.nextUrl.pathname === '/enter') {

    const response = NextResponse.next()
    response.cookies.set('key', '0123456789')
    return response
  }

  console.log(Math.random().toString(36).slice(-12))
  const response = NextResponse.next()
  const key = request.cookies.get('key')
  response.cookies.set('key', '0123456789')
  console.log(request.method)
  if (key != undefined) {
    if (request.method === 'POST') {
      let body = await request.json()    
      let data = await fetch('http://localhost:3000/api/get_key?' + new URLSearchParams({ nikname: body.nikname }))
      let user_key = await data.text();     
      if (key.value === user_key) {
        return response  
      } else {
        return NextResponse.redirect(`${request.nextUrl.origin}/enter`)
      }
    } else { 
      const nik = request.nextUrl.searchParams.get('nikname')
      let data = await fetch('http://localhost:3000/api/get_key?' + new URLSearchParams({ nikname: nik }))
      let user_key = await data.text();      
      if (key.value === user_key) {
        return response
      } else {
        return NextResponse.redirect(`${request.nextUrl.origin}/enter`)
      }
    }

  } else {

    return new NextResponse.json(200, { error: 'Internal Server Error' }, { status: 500 })
  }




}

// console.log(Math.random().toString(36).slice(-8))
export const config = {
  matcher: ['/api/get_messages', '/api/set_patern', '/api/save_order']
};
