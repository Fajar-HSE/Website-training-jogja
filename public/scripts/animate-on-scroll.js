export default function initAnimate() {
  if (typeof window === 'undefined') return

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view')
      }
    })
  }, { threshold: 0.15 })

  document.querySelectorAll('.js-animate').forEach(el => observer.observe(el))
}
