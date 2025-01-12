import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const calculateJots = (secretWord: string, guess: string): number => {
  const secretWordMap = new Map<string, number>()
  for (const char of secretWord) {
    secretWordMap.set(char, (secretWordMap.get(char) || 0) + 1)
  }

  let jots = 0
  for (const char of guess) {
    if (secretWordMap.has(char) && secretWordMap.get(char)! > 0) {
      jots += 1
      secretWordMap.set(char, secretWordMap.get(char)! - 1)
    }
  }

  return jots
}
