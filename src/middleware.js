import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';



export function middleware(request) {
  
  const response = NextResponse.next()
  
  
  return response 
 
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/enter',
};