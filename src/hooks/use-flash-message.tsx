import { useCallback, useMemo, useState } from 'react'
import { cn } from '../utils'
import { createPortal } from 'react-dom'

export const useFlashMessage = () => {
  const [message, setMessage] = useState('')

  const handleAnimationEnd = useCallback(() => {
    setMessage('')
  }, [])

  return {
    message,
    setMessage,
    FlashMessage: useMemo(
      () => () =>
        createPortal(
          <div
            className={cn(
              'animate-flash md:w-screen-md absolute left-1/2 top-1/3 z-10 w-11/12 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-500 px-4 py-2 text-center font-["PlaywriteAUSA"] text-xl text-white',
              message ? 'block' : 'hidden',
            )}
            onAnimationEnd={handleAnimationEnd}
          >
            {message}
          </div>,
          document.body,
        ),
      [message, handleAnimationEnd],
    ),
  }
}
