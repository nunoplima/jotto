import { IWord } from './types'

export const getWordByNormalizedWord = async (
  normalizedWord: string,
): Promise<IWord | undefined> => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/words?normalizedWord=${normalizedWord}`,
  )
  const [data] = await res.json()

  return data
}
