import { Delete, CornerDownLeft } from 'lucide-react'
import { cn } from '../utils'

const alphabet = [
  { key: 'q', className: 'w-[10%]', keyCode: 113 },
  { key: 'w', className: 'w-[10%]', keyCode: 119 },
  { key: 'e', className: 'w-[10%]', keyCode: 101 },
  { key: 'r', className: 'w-[10%]', keyCode: 114 },
  { key: 't', className: 'w-[10%]', keyCode: 116 },
  { key: 'y', className: 'w-[10%]', keyCode: 121 },
  { key: 'u', className: 'w-[10%]', keyCode: 117 },
  { key: 'i', className: 'w-[10%]', keyCode: 105 },
  { key: 'o', className: 'w-[10%]', keyCode: 111 },
  { key: 'p', className: 'w-[10%]', keyCode: 112 },
  { key: 'a', className: 'w-[10%]', keyCode: 97 },
  { key: 's', className: 'w-[10%]', keyCode: 115 },
  { key: 'd', className: 'w-[10%]', keyCode: 100 },
  { key: 'f', className: 'w-[10%]', keyCode: 102 },
  { key: 'g', className: 'w-[10%]', keyCode: 103 },
  { key: 'h', className: 'w-[10%]', keyCode: 104 },
  { key: 'j', className: 'w-[10%]', keyCode: 106 },
  { key: 'k', className: 'w-[10%]', keyCode: 107 },
  { key: 'l', className: 'w-[10%]', keyCode: 108 },
  { key: 'ç', className: 'w-[10%]', keyCode: 186 },
  {
    key: 'Backspace',
    className: 'w-[11%]',
    icon: <Delete className="h-5 w-5" />,
    keyCode: 8,
  },
  { key: 'z', className: 'w-[11%]', keyCode: 122 },
  { key: 'x', className: 'w-[11%]', keyCode: 120 },
  { key: 'c', className: 'w-[11%]', keyCode: 99 },
  { key: 'v', className: 'w-[11%]', keyCode: 118 },
  { key: 'b', className: 'w-[11%]', keyCode: 98 },
  { key: 'n', className: 'w-[11%]', keyCode: 110 },
  { key: 'm', className: 'w-[11%]', keyCode: 109 },
  {
    key: 'Enter',
    className: 'w-[11%]',
    icon: <CornerDownLeft className="h-5 w-5" />,
    keyCode: 13,
  },
]

export const Keyboard = () => {
  const handleKeyPress =
    ({ key, keyCode }: { key: string; keyCode: number }) =>
    () => {
      const keyboardEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        keyCode,
        key,
      })
      window.dispatchEvent(keyboardEvent)
    }

  return (
    <div className="flex max-w-screen-md flex-grow items-end justify-center md:mb-16">
      <div className="flex w-full flex-wrap justify-center">
        {alphabet.map(({ key, keyCode, className, icon }) => (
          <div key={key} className={cn('h-16 cursor-pointer p-1', className)}>
            <div
              onClick={handleKeyPress({ key, keyCode })}
              className="flex h-full w-full items-center justify-center rounded-md border border-gray-200 transition-all md:hover:bg-slate-200"
            >
              {icon ? icon : key}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
