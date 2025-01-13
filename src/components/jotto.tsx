import { FC, useCallback, useEffect, useRef } from 'react'
import {
  WORD_LENGTH,
  WINNER_MESSAGES,
  LOSER_MESSAGES,
  NUM_OF_ROWS,
} from '../constants'
import { calculateJots, cn } from '../utils'
import { DiagonalLine } from './diagonal-line'
import { Circle } from './circle'
import Confetti from 'react-confetti'
import { ECharacterStatus, EJottoStatus } from '../enums'
import { getWordByNormalizedWord } from '../api'
import { useFlashMessage } from '../hooks/use-flash-message'
import { useJottoStore } from '../store'
import { useShallow } from 'zustand/shallow'

const JottoStatus: FC<{ status: EJottoStatus }> = ({ status }) => {
  const secretWord = useJottoStore((state) => state.secretWord)

  return (
    <div
      className={cn(
        'absolute left-1/2 top-1/2 z-10 w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-lg px-4 py-2 text-center text-xl text-white',
        status === 'winner' && 'bg-green-600',
        status === 'loser' && 'bg-red-500',
      )}
    >
      {status === 'loser' && (
        <div>
          <h3>
            {LOSER_MESSAGES[Math.floor(Math.random() * LOSER_MESSAGES.length)]}
          </h3>
          <p className="mt-2">A palavra era: {secretWord}</p>
        </div>
      )}
      {status === 'winner' && (
        <h3>
          {WINNER_MESSAGES[Math.floor(Math.random() * WINNER_MESSAGES.length)]}
        </h3>
      )}
    </div>
  )
}

const JottoBoard: FC<{ status: EJottoStatus }> = ({ status }) => {
  const [
    secretWord,
    lettersStatuses,
    setLettersStatuses,
    guesses,
    setGuesses,
    currentRowIdx,
    setCurrentRowIdx,
  ] = useJottoStore(
    useShallow((state) => [
      state.secretWord,
      state.lettersStatuses,
      state.setLettersStatuses,
      state.guesses,
      state.setGuesses,
      state.currentRowIdx,
      state.setCurrentRowIdx,
    ]),
  )

  const rowRefs = useRef<HTMLDivElement[]>([])

  const {
    setMessage: setFlashMessage,
    FlashMessage: WordNotFoundFlashMessage,
  } = useFlashMessage()

  const handleClick = (letter: string) => () => {
    let newLetterStatus = ECharacterStatus.idle

    if (lettersStatuses[letter] === ECharacterStatus.idle) {
      newLetterStatus = ECharacterStatus.notPresent
    } else if (lettersStatuses[letter] === ECharacterStatus.notPresent) {
      newLetterStatus = ECharacterStatus.correct
    }

    setLettersStatuses({
      ...lettersStatuses,
      [letter]: newLetterStatus,
    })
  }

  const handleKeyPress = useCallback(
    async (e: KeyboardEvent) => {
      const { key } = e

      const guessLength = guesses[currentRowIdx]?.guess.length

      if (status !== EJottoStatus.playing) return

      // on Enter
      if (key === 'Enter' && guessLength === WORD_LENGTH) {
        // force synchronous layout (reflow): avoids batch updating the layout
        rowRefs.current[currentRowIdx].classList.remove('animate-shake')
        void rowRefs.current[currentRowIdx]?.offsetHeight

        // check if the word exists in the DB
        const wordData = await getWordByNormalizedWord(
          guesses[currentRowIdx].guess,
        )

        // if the word does not exist in the DB
        if (!wordData) {
          rowRefs.current[currentRowIdx].classList.add('animate-shake')
          setFlashMessage('A palavra não está na lista')
          return
        }

        const { word: guess } = wordData
        const jots = calculateJots(secretWord, guesses[currentRowIdx].guess)
        const updatedGuesses = structuredClone(guesses)
        updatedGuesses[currentRowIdx] = { guess, jots }
        setGuesses(updatedGuesses)

        setCurrentRowIdx(currentRowIdx + 1)

        if (jots === 0) {
          rowRefs.current[currentRowIdx].classList.add('animate-shake')
        } else {
          rowRefs.current[currentRowIdx].classList.add('animate-scale')
        }

        return
      }

      // on Backspace
      if (key === 'Backspace' && guessLength > 0) {
        const updatedGuesses = structuredClone(guesses)
        updatedGuesses[currentRowIdx] = {
          guess: updatedGuesses[currentRowIdx].guess.substring(
            0,
            updatedGuesses[currentRowIdx].guess.length - 1,
          ),
          jots: updatedGuesses[currentRowIdx].jots,
        }

        setGuesses(updatedGuesses)

        return
      }

      // if the word already has 5 chars and the key is not Backspace or Enter
      if (guessLength === WORD_LENGTH) {
        return
      }

      const isValidKey = key.match(/^[a-zA-Z|ç]{1}$/)

      if (!isValidKey) return

      const updatedGuesses = structuredClone(guesses)
      updatedGuesses[currentRowIdx] = {
        guess: (updatedGuesses[currentRowIdx].guess || '') + key.toLowerCase(),
        jots: updatedGuesses[currentRowIdx].jots,
      }
      setGuesses(updatedGuesses)
    },
    [
      currentRowIdx,
      guesses,
      secretWord,
      setCurrentRowIdx,
      setFlashMessage,
      setGuesses,
      status,
    ],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  return (
    <div className="relative -m-2.5 flex w-full max-w-md flex-col items-center gap-1 overflow-auto p-2.5">
      <WordNotFoundFlashMessage />

      {guesses.map(({ guess, jots }, rowIdx) => (
        <div
          key={rowIdx}
          ref={(element: HTMLDivElement) => (rowRefs.current[rowIdx] = element)}
          className="flex w-full justify-center gap-1 md:gap-4"
        >
          <div className="flex h-16 w-5/6 flex-shrink-0 items-center gap-1">
            {Array(WORD_LENGTH)
              .fill(null)
              .map((_, lineIdx) => {
                const char = guess[lineIdx]

                return (
                  <button
                    key={lineIdx}
                    type="button"
                    onClick={handleClick(char)}
                    className="relative flex h-full w-1/5 cursor-pointer items-center justify-center rounded-md border border-red-200 text-lg"
                    disabled={status !== EJottoStatus.playing || !char}
                  >
                    {char || ''}

                    {lettersStatuses[char] === ECharacterStatus.notPresent && (
                      <DiagonalLine />
                    )}
                    {lettersStatuses[char] === ECharacterStatus.correct && (
                      <Circle />
                    )}
                  </button>
                )
              })}
          </div>

          <div className="flex w-full items-center justify-center rounded-md bg-gray-300">
            {jots}
          </div>
        </div>
      ))}
    </div>
  )
}

export const Jotto: FC = () => {
  const status = useJottoStore(
    (state): EJottoStatus =>
      state.currentRowIdx === NUM_OF_ROWS
        ? EJottoStatus.loser
        : state.guesses[state.currentRowIdx - 1]?.guess === state.secretWord
          ? EJottoStatus.winner
          : EJottoStatus.playing,
  )

  return (
    <>
      <div className="relative -mt-2.5 flex w-full justify-center overflow-hidden pt-2.5">
        <JottoStatus status={status} />
        <JottoBoard status={status} />
        <div className="absolute bottom-0 left-0 right-0 h-16 w-full justify-center bg-gradient-to-t from-white to-transparent" />
      </div>

      {status === EJottoStatus.winner && <Confetti />}
    </>
  )
}
