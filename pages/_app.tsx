import '../styles/globals.css'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/600.css'
import '@fontsource/manrope/700.css'
import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/plus-jakarta-sans/700.css'
import '@fontsource/plus-jakarta-sans/800.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import initAnimate from '../utils/animate'
import { AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'

export default function App({ Component, pageProps, router }: AppProps) {
  useEffect(() => {
    initAnimate()
  }, [])

  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageWrapper key={router.asPath}>
        <Component {...pageProps} />
      </PageWrapper>
    </AnimatePresence>
  )
}
