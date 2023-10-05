import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';



export function middleware(req,res) {

  if(req.nextUrl.pathname === '/404') {
    const response = NextResponse.next()
    
    response.cookies.set('key', '')
   
    return response
  }

  if(req.nextUrl.pathname === '/api/enter_phone') {
    const response = NextResponse.next() 
    response.cookies.set('key', 'YWxhZGRpbjpvcGVuc2VzYW1l')
    return response
  }

  console.log(req.nextUrl.pathname)
  const response = NextResponse.next() 
  const key = req.cookies.get('key')
  console.log('key',key) 
  
  response.cookies.set('key', 'YWxhZGRpbjpvcGVuc2VzYW1l')
  if(key != undefined) {

      if( key.value === 'YWxhZGRpbjpvcGVuc2VzYW1l' ){
        return response
      } else {
        return NextResponse.redirect(`${req.nextUrl.origin}/enter`)
      }

  } else {
    console.log(`${req.nextUrl.pathname}`)
    return NextResponse.redirect(`${req.nextUrl.origin}/`)
  }
  
  
 
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/api/enter_phone' ,'/404', '/editprofile' , '/calendar' , '/chat' , '/editprofile/client']
};