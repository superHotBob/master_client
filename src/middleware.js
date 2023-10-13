import { NextResponse } from 'next/server';

export async function middleware(request, res) {

  const response = NextResponse.next()
  const key = request.cookies.get('key')
  const nikname = request.cookies.get('nikname')  
  
  if (key != undefined) {        
      let data = await fetch('http://localhost:3000/api/get_key?' + new URLSearchParams({ nikname: nikname.value }))
      let user_key = await data.text();     
      if (key.value === user_key) {
        return response  
      } else {
        return NextResponse.redirect(`${request.nextUrl.origin}/enter`)
      }   
  } else {    
    return NextResponse.redirect(`${request.nextUrl.origin}/`)
  }
}
export const config = {
  matcher: ['/masterprofile/:path*','/api/get_messages','/api/get_orders_client', '/api/save_image','/api/set_patern', '/api/save_order','/clientprofile/:path']
};
