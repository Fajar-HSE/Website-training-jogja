import { motion, Variants } from 'framer-motion'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const variants: Variants = {
  hidden: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeInOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.3, ease: 'easeIn' } },
}

export default function PageWrapper({ children }: Props) {
  return (
    <motion.div
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
      className="flex flex-col min-h-screen"
    >
      {children}
    </motion.div>
  )
}
