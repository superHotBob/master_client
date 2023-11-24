import '../styles/globals.css'
import { Rubik } from 'next/font/google'
import { store } from '../store'
import { Provider } from 'react-redux'
import Head from 'next/head'
import Navi from '@/components/navi'
import { useRouter } from 'next/router'
import { SWRConfig, useSWRConfig } from 'swr'
import Header from '@/components/header'
import { usePathname } from "next/navigation"






const rubik = Rubik({
  weight: ['300', '400', '500', '700', '800'],
  subsets: ['cyrillic'],
  style: ['normal'],
  display: 'auto',
})
export default function MyApp({ Component, pageProps }) {



const my_path = ['informations', 'informations/aboutservice',
  'newpassword',
  'succesregistration',
  'displaypublications',
  'masterrecords',
  'confirmation',
  'addlist',
 
  'calendar', 
   'city', 'masternear', 'masternear/city', 'editprofile', 'addmasterorder']

  const router = useRouter()
  const { slug } = router.query
  const pathname = usePathname()
  
 
  
  return (
    <SWRConfig value={{ provider: () => new Map(),
      fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
    }}>
      <Provider store={store}>
        <Head>
          <meta name="description" 
          content="Лучшие мастера в вашем городе: маникюр, прически , массаж, педикюр, окрашивание, депиляция, барбер, стрижка, брови и многое другое" 
          />
          <meta name="keywords" content="маникюр,	парикмахер, парикмахерские услуги, стрижки, прически, укладки, выпрямления, лечение, косметология, маникюр, педикюр, депиляция, низкие цены, Белорусь, сложное окрашивание, омбре, балаяж, шатуш, калифорнийское мелирование"></meta>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="color-scheme" content="dark light" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="author" content="Александр" />
          <link rel="canonical" href="https://masters.place" />
          <title>{slug ? slug : 'masters.place'}</title>
          <link rel="apple-touch-icon" href="icons/android-chrome-192x192.png" />
          <meta name="application-name" lang='ru' content="masters.place" />
          <meta name="mobile-web-app-capable" content="yes" />
        </Head>
        <main className={rubik.className} style={{position: 'relative'}}> 
        {pathname ? 
          (pathname === '/' ? <Header sel="back" /> : pathname === '/catalog' || pathname === '/catalog/services' ?  <Header sel='/' /> : null) 
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
