import '../styles/globals.css'
import { Rubik } from 'next/font/google'
import { store } from '../store'
import { Provider } from 'react-redux'

const rubik = Rubik({
  weight: ['400', '500'],
  subsets: ['latin'],
})


export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <main className={rubik.className}>       
        <Component {...pageProps} />
      </main>
    </Provider>
  )
}
