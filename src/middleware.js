import { NextResponse } from 'next/server';

export async function middleware(request, res) {
  
  if (request.nextUrl.pathname === '/enter') {

    const response = NextResponse.next()
    response.cookies.set('key', '0123456789')
    return response
  }


  const response = NextResponse.next()
  const key = request.cookies.get('key')
  

  response.cookies.set('key', '0123456789')
  if (key != undefined) {
    const nik = request.nextUrl.searchParams.get('nikname')
    let data = await fetch('http://localhost:3000/api/get_key?' + new URLSearchParams({ nikname: nik }))
    let user_key = await data.text();
   

   
  


    // console.log(Math.random().toString(36).slice(-12))
    if (key.value === user_key) {
      return response

    } else {
      return NextResponse.redirect(`${request.nextUrl.origin}/enter`)
    }

  } else {

    return new NextResponse.json(200, { error: 'Internal Server Error' }, { status: 500 })
  }




}

// console.log(Math.random().toString(36).slice(-8))
export const config = {
  matcher: [  '/api/get_messages']
};
