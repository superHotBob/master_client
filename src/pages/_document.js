import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <head>
        <script src="https://api-maps.yandex.ru/3.0/?apikey=89caab37-749d-4e30-8fdf-e8045542f060&lang=ru_RU"></script>
      </head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
