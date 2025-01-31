import { useEffect, useRef } from 'react'

const useOutsideClick = (callback) => {
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchend', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchend', handleClickOutside)
    }
  }, [callback])

  return ref
}

export default useOutsideClick
