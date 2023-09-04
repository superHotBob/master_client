import '../styles/globals.css'
import { Rubik } from 'next/font/google'
import { store } from '../store'
import { Provider } from 'react-redux'
import Head from 'next/head'
import Navi from '@/components/navi'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import Header from '@/components/header'
import { usePathname } from "next/navigation"





const rubik = Rubik({
  weight: ['300', '400', '500', '700', '800'],
  subsets: ['cyrillic'],
  style: ['normal'],
  display: 'auto',
})
const my_path = ['informations', 'informations/aboutservice',
  'newpassword',
  'succesregistration',
  'displaypublications',
  'masterrecords',
  'confirmation',
  'addlist',
  'calendar',
   'city', 'masternear', 'masternear/city', 'editprofile', 'addmasterorder']
export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const { slug } = router.query
  const pathname = usePathname()
  
  if(slug ) {
    my_path.push(slug)
  }
  
  return (
    <SWRConfig value={{ provider: () => new Map(),
      fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
    }}>
      <Provider store={store}>
        <Head>
          <meta name="description" content="Master app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <title>masters.place</title>
          <link rel="apple-touch-icon" href="icons/android-chrome-192x192.png" />
          <meta name="application-name" content="PWA App" />
          <meta name="mobile-web-app-capable" content="yes" />
        </Head>
        <main className={rubik.className}> 
        {pathname ? 
          (pathname === '/' ? <Header  /> : pathname === '/catalog' || pathname === '/catalog/services' ?  <Header sel='/' /> : null) 
          : null
        }    
          <Component {...pageProps} />
          {pathname ?
          (my_path.includes(pathname.replace('/', '')) ? null : <Navi />) : null}
        </main>
      </Provider>
    </SWRConfig>
  )
}
