import '../styles/globals.css'
import { Rubik } from 'next/font/google'
import { store } from '../store'
import { Provider } from 'react-redux'
import Head from 'next/head'
import localFont from 'next/font/local'
import Navi from '@/components/navi'

const myFont = localFont({ src: [{path: '../../fonts/DelaGothicOne-Regular.ttf',display: 'block'}] })
const rubik = Rubik({
  weight: ['400', '500','600'],
  subsets: ['cyrillic'],
})
export default function MyApp({ Component, pageProps }) {  
  return (
    <Provider store={store}>      
        <Head>
        <meta name="description" content="Master app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>masters.place</title>
        <meta name="theme-color" content="#317EFB"/>
        <link rel="apple-touch-icon" href="icons/android-chrome-192x192.png"></link>
        <meta name="application-name" content="PWA App" />
        <meta name="mobile-web-app-capable" content="yes" />
          <meta
            name='viewport'
            content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
          />
        </Head>
        <main className={rubik.className}>     
        <Component {...pageProps} className={myFont.className}/>
        <Navi />
      </main>
    </Provider>
  )
}
