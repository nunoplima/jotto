import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ECharacterStatus } from './enums'
import { LETTERS, NUM_OF_ROWS } from './constants'
import { IGuess } from './types'

interface IJottoStore {
  secretWord: string
  setSecretWord: (word: string) => void
  lettersStatuses: Record<string, ECharacterStatus>
  setLettersStatuses: (
    lettersStatuses: Record<string, ECharacterStatus>,
  ) => void
  guesses: IGuess[]
  setGuesses: (guesses: IGuess[]) => void
  currentRowIdx: number
  setCurrentRowIdx: (currentRowIdx: number) => void
  restart: () => void
}

const initialLettersStatuses = LETTERS.reduce(
  (acc, curr) => ({ ...acc, [curr]: ECharacterStatus.idle }),
  {},
)
const initalGuesses = Array(NUM_OF_ROWS).fill({ guess: '', jots: 0 })

export const useJottoStore = create(
  persist<IJottoStore>(
    (set) => ({
      secretWord: '',
      setSecretWord: (word: string) => set({ secretWord: word }),
      lettersStatuses: initialLettersStatuses,
      setLettersStatuses: (lettersStatuses: Record<string, ECharacterStatus>) =>
        set({ lettersStatuses }),
      guesses: initalGuesses,
      setGuesses: (guesses: IGuess[]) => set({ guesses }),
      currentRowIdx: 0,
      setCurrentRowIdx: (currentRowIdx: number) => set({ currentRowIdx }),
      restart: () =>
        set({
          secretWord: '',
          lettersStatuses: initialLettersStatuses,
          guesses: initalGuesses,
          currentRowIdx: 0,
        }),
    }),
    {
      name: 'jotto-storage',
    },
  ),
)
