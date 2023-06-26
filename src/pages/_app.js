import '../styles/globals.css'
import { Rubik } from 'next/font/google'
import { store } from '../store'
import { Provider } from 'react-redux'
import Head from 'next/head'
import Navi from '@/components/navi'
import { useRouter } from 'next/router'



const rubik = Rubik({
  weight: ['300', '400', '500', '700', '800'],
  subsets: ['cyrillic'],
  style: ['normal'],
  display: 'swap',
})
const my_path = ['informations','informations/aboutservice',
  'newpassword',
  'succesregistration',
  'masterrecords',
  'confirmation',
  'addlist',
  'calendar',
  'master',
  'masterprofile', 'city', 'masternear', 'chat', 'editprofile', 'addmasterorder']
export default function MyApp({ Component, pageProps }) {
  const router = useRouter()

  return (
    <Provider store={store}>
      <Head>
        <meta name="description" content="Master app" />
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" href="/favicon.ico" />
        <title>masters.place</title>      
        <link rel="apple-touch-icon" href="icons/android-chrome-192x192.png"></link>
        <meta name="application-name" content="PWA App" />
        <meta name="mobile-web-app-capable" content="yes" />       
      </Head>
      <main className={rubik.className}>
        <Component {...pageProps} />
        {my_path.includes(router.asPath.replace('/', '')) ? null : <Navi />}
      </main>
    </Provider>
  )
}
