import { useEffect } from 'react'
import { Keyboard } from './components/keyboard'
import { Restart } from './components/restart'
import { Alphabet } from './components/alphabet'
import { Jotto } from './components/jotto'
import { useJottoStore } from './store'
import { normalizeWord } from './utils'
import { TOTAL_WORDS } from './constants'

function App() {
  const secretWord = useJottoStore((state) => state.secretWord)
  const setSecretWord = useJottoStore((state) => state.setSecretWord)

  useEffect(() => {
    ;(async function getRandomWord() {
      if (secretWord) {
        return
      }

      const randomId = Math.ceil(Math.random() * TOTAL_WORDS)
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/words/${randomId}`,
      )
      const { word } = await res.json()
      const normalizedWord = normalizeWord(word)
      setSecretWord(normalizedWord)
    })()
  }, [setSecretWord, secretWord])

  if (!secretWord) {
    return null
  }

  return (
    <main className="flex w-full flex-col gap-8 px-2 pt-12">
      <Alphabet />
      <Jotto />
      <Restart />
      <Keyboard />
    </main>
  )
}

export default App
