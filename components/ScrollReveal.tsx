import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.6,
}: Props) {
  const directions = {
    up: { y: 25 },
    down: { y: -25 },
    left: { x: 25 },
    right: { x: -25 },
    none: {},
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: duration,
        delay: delay,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  )
}
