import { cn } from '../utils'

export const Circle = ({ classNames = 'bg-green-400 opacity-40' }) => (
  <div
    className={cn(
      'absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full',
      classNames,
    )}
  />
)
