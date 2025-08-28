import { useRef, useEffect } from 'react'

export function useHorizontalScroll() {
  const elRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = elRef.current
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaX !== 0) {
          // touchpad gestures
          e.preventDefault()
          el.scrollTo({
            left: el.scrollLeft + e.deltaX * 1.5,
            behavior: 'auto'
          })
        } else if (e.deltaY !== 0) {
          // mouse wheel
          e.preventDefault()
          el.scrollTo({
            left: el.scrollLeft + e.deltaY,
            behavior: 'auto'
          })
        }
      }
      el.addEventListener('wheel', onWheel)
      return () => el.removeEventListener('wheel', onWheel)
    }
  }, [])
  return elRef
}
