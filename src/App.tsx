import { useEffect, useState } from 'react'
import { ECharacterStatus } from './enums'
import { Keyboard } from './components/keyboard'
import { Restart } from './components/restart'
import { Alphabet } from './components/alphabet'
import { LETTERS, TOTAL_WORDS } from './constants'
import { Jotto } from './components/jotto'

function App() {
  const [word, setWord] = useState<string>()
  const [lettersStatuses, setLettersStatuses] = useState<
    Record<string, ECharacterStatus>
  >(() =>
    LETTERS.reduce(
      (acc, curr) => ({ ...acc, [curr]: ECharacterStatus.idle }),
      {},
    ),
  )

  useEffect(() => {
    ;(async function getWord() {
      const randomId = Math.ceil(Math.random() * TOTAL_WORDS)
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/words/${randomId}`,
      )
      const { word } = await res.json()
      const normalizedWord = word
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
      setWord(normalizedWord)
    })()
  }, [])

  if (!word) {
    return null
  }

  return (
    <main className="flex w-full flex-col gap-8 px-2 pt-12">
      <Alphabet
        lettersStatuses={lettersStatuses}
        setLettersStatuses={setLettersStatuses}
      />
      <Jotto
        secretWord={word}
        lettersStatuses={lettersStatuses}
        setLettersStatuses={setLettersStatuses}
      />
      <Restart />
      <Keyboard />
    </main>
  )
}

export default App
