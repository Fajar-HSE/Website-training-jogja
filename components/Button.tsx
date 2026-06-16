import Link from 'next/link'

type Props = {
  children: React.ReactNode
  href?: string
}

export default function Button({ children, href = '#' }: Props) {
  return (
    <Link href={href} className="btn-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-accent-50">
      {children}
    </Link>
  )
}
