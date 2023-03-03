import '../styles/globals.css'
import { Rubik } from 'next/font/google'
import { store } from '../store'
import { Provider } from 'react-redux'
import Head from 'next/head'

const rubik = Rubik({
  weight: ['400', '500'],
  subsets: ['latin'],
})

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <main className={rubik.className}>
        <Head >
          <script src="https://api-maps.yandex.ru/3.0/?apikey=89caab37-749d-4e30-8fdf-e8045542f060&lang=ru_RU"></script>
        </Head>
        <Component {...pageProps} />
      </main>
    </Provider>
  )
}
