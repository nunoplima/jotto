interface IGuess {
  guess: string
  jots: number
}

interface IWord {
  word: string
  normalizedWord: string
  id: number
}

export type { IGuess, IWord }
