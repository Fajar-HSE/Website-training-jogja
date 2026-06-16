import React from 'react'

type Props = {
  title: string
  description: string
  icon?: React.ReactNode
}

export default function SectionCard({ title, description, icon }: Props) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_28px_70px_-45px_rgba(15,23,42,0.35)] transition duration-200 hover:-translate-y-1 hover:shadow-lg js-animate">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 flex-none items-center justify-center rounded-3xl bg-primary-900 text-white shadow-sm">
          {icon ?? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15 8H9L12 2Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <p className="mt-3 text-slate-600 leading-7">{description}</p>
        </div>
      </div>
    </div>
  )
}
