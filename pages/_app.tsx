import React from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import { CacheProvider, EmotionCache } from '@emotion/react'
import theme from '@lib/theme'
import createEmotionCache from '@lib/createEmotionCache'
import { CssBaseline } from '@mui/material'
import { NextPage } from 'next'
import MainLayout from '@lib/layouts/MainLayout'

const clientSideEmotionCache = createEmotionCache()

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

interface MyAppProps extends AppPropsWithLayout {
  emotionCache?: EmotionCache
}

function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache }: MyAppProps) {
  const getLayout = Component.getLayout ?? ((page) => <MainLayout>{page}</MainLayout>)

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>{ Component.displayName && `${Component.displayName} -` } SCEF - Sistema de Controle e Emissão de Formulários</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </CacheProvider>
  )
}

export default MyApp
