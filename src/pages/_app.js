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
import Script from 'next/script'
import { useEffect } from 'react'

const rubik = Rubik({
  weight: ['300', '400', '500', '700', '800'],
  subsets: ['cyrillic'],
  style: ['normal'],
  display: 'auto',
})
export default function MyApp({ Component, pageProps }) {

  const my_path = ['informations', 'informations/aboutservice', 'filling',
    'newpassword', 'succesregistration', 'displaypublications',
    'masterrecords', 'confirmation', 'addlist', 'calendar', 'become', 'editprofile/address',
    'states', 'masternear', 'masternear/city', 'editprofile', 'addmasterorder']

  const router = useRouter()
  const { slug } = router.query
  const pathname = usePathname()
  useEffect(() => {
    window.dataLayer = window.dataLayer || []
    function gtag() {
      window.dataLayer.push(arguments)
    }
    gtag('js', new Date())
    gtag('config', 'AW-11474901956');
    var _tmr = window._tmr || (window._tmr = []);
    _tmr.push({ id: "3474474", type: "pageView", start: (new Date()).getTime() });

    (function (d, w, id) {
      if (d.getElementById(id)) return;
      var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id;
      ts.src = "https://top-fwz1.mail.ru/js/code.js";
      var f = function () { var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s); };
      if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); }
    })(document, window, "tmr-code");

    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function(){ (m[i].a = m[i].a||[]).push(arguments) };
      m[i].l = 1 * new Date();
      for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
      k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
    })
      (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

    ym(96171775, "init", {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true
    });

  }, [])
  return (
    <SWRConfig value={{
      provider: () => new Map(),
      fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
    }}>
      <Provider store={store}>
        <Head>
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
          <meta name="description"
            content="Лучшие мастера в вашем городе: маникюр, прически , массаж, педикюр, окрашивание, депиляция, барбер, стрижка, брови и многое другое"
          />
        </Head>
        <main className={rubik.className} >
          <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-11474901956" />
          
            {/* <div>
              <img src="https://top-fwz1.mail.ru/counter?id=3474474;js=na" style={{ position: 'absolute', left: '-9999px' }} alt="Top.Mail.Ru" />
            </div>
          
        
            <div>
              <img src="https://mc.yandex.ru/watch/96171775" style={{ position: 'absolute', left: '-9999px' }} alt="" />
            </div> */}
          
          {pathname ?
            (pathname === '/' ? <Header sel="back" /> : pathname === '/catalog' || pathname === '/catalog/services' ? <Header sel='/' /> : null)
            : null
          }
          <Component {...pageProps} />
          {pathname ?
            (my_path.includes(pathname.replace('/', '')) ? null : <Navi />) : null}
        </main>
      </Provider>
    </SWRConfig >
  )
}
