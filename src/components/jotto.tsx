import {
  Dispatch,
  SetStateAction,
  FC,
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from 'react'
import { WORD_LENGTH, NUM_OF_ROWS } from '../constants'
import { IGuess } from '../types'
import { calculateJots, cn } from '../utils'
import { DiagonalLine } from './diagonal-line'
import { Circle } from './circle'
import Confetti from 'react-confetti'
import { ECharacterStatus, EStatus } from '../enums'

interface IJotto {
  secretWord: string
  lettersStatuses: Record<string, ECharacterStatus>
  setLettersStatuses: Dispatch<SetStateAction<Record<string, ECharacterStatus>>>
}

interface IJottoBoard {
  secretWord: string
  guesses: IGuess[]
  currentRowIdx: number
  status: 'playing' | 'winner' | 'loser'
  setCurrentRowIdx: Dispatch<SetStateAction<number>>
  setGuesses: Dispatch<SetStateAction<IGuess[]>>
  lettersStatuses: Record<string, ECharacterStatus>
  setLettersStatuses: Dispatch<SetStateAction<Record<string, ECharacterStatus>>>
}

const winnerMessages = [
  'Parabéns, és um génio!',
  'És o(a) maior, acertaste!',
  'Que campeão(ã), ganhaste!',
  'Uau, és imbatível!',
]

const loserMessages = [
  'É tramado mas este jogo está acabado!',
  'Não foi desta, mas não desistas!',
  'Ahh, que azar! Tenta outra vez!',
  'Quase, mas não foi desta!',
  'Já estiveste mais longe, tenta de novo!',
]

const JottoStatus: FC<{ status: EStatus; secretWord: string }> = ({
  status,
  secretWord,
}) => {
  return (
    <div
      className={cn(
        'absolute left-1/2 top-1/2 z-10 w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-lg px-4 py-2 text-center text-xl text-white',
        status === 'winner' && 'bg-green-400',
        status === 'loser' && 'bg-red-400',
      )}
    >
      {status === 'loser' && (
        <div>
          <h3>
            {loserMessages[Math.floor(Math.random() * loserMessages.length)]}
          </h3>
          <p className="mt-2">A palavra era: {secretWord}</p>
        </div>
      )}
      {status === 'winner' && (
        <h3>
          {winnerMessages[Math.floor(Math.random() * winnerMessages.length)]}
        </h3>
      )}
    </div>
  )
}

const JottoBoard: FC<IJottoBoard> = ({
  secretWord,
  guesses,
  currentRowIdx,
  status,
  setCurrentRowIdx,
  setGuesses,
  lettersStatuses,
  setLettersStatuses,
}) => {
  const rowRefs = useRef<HTMLDivElement[]>([])

  const handleClick = (letter: string) => () => {
    let newLetterStatus = ECharacterStatus.idle

    if (lettersStatuses[letter] === ECharacterStatus.idle) {
      newLetterStatus = ECharacterStatus.notPresent
    } else if (lettersStatuses[letter] === ECharacterStatus.notPresent) {
      newLetterStatus = ECharacterStatus.correct
    }

    setLettersStatuses((previousLettersStatuses) => ({
      ...previousLettersStatuses,
      [letter]: newLetterStatus,
    }))
  }

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      const { key } = e

      const guessLength = guesses[currentRowIdx]?.guess.length

      if (status !== EStatus.playing) return

      // on Enter
      if (key === 'Enter' && guessLength === WORD_LENGTH) {
        const jots = calculateJots(secretWord, guesses[currentRowIdx].guess)
        setCurrentRowIdx((prevRowIdx) => prevRowIdx + 1)
        setGuesses((prevGuesses) => {
          const updatedGuesses = structuredClone(prevGuesses)
          updatedGuesses[currentRowIdx] = {
            guess: updatedGuesses[currentRowIdx].guess,
            jots,
          }

          return updatedGuesses
        })

        if (jots === 0) {
          rowRefs.current[currentRowIdx].classList.add('animate-shake')
        } else {
          rowRefs.current[currentRowIdx].classList.add('animate-scale')
        }

        return
      }

      // on Backspace
      if (key === 'Backspace' && guessLength > 0) {
        setGuesses((prevGuesses) => {
          const updatedGuesses = structuredClone(prevGuesses)
          updatedGuesses[currentRowIdx] = {
            guess: updatedGuesses[currentRowIdx].guess.substring(
              0,
              updatedGuesses[currentRowIdx].guess.length - 1,
            ),
            jots: updatedGuesses[currentRowIdx].jots,
          }

          return updatedGuesses
        })

        return
      }

      // if the word already has 5 chars and the key is not Backspace or Enter
      if (guessLength === WORD_LENGTH) {
        return
      }

      const isValidKey = key.match(/^[a-zA-Z|ç]{1}$/)

      if (!isValidKey) return

      setGuesses((prevGuesses) => {
        const updatedGuesses = structuredClone(prevGuesses)
        updatedGuesses[currentRowIdx] = {
          guess:
            (updatedGuesses[currentRowIdx].guess || '') + key.toLowerCase(),
          jots: updatedGuesses[currentRowIdx].jots,
        }

        return updatedGuesses
      })
    },
    [currentRowIdx, guesses, secretWord, setCurrentRowIdx, setGuesses, status],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  return (
    <div className="relative -m-2.5 flex w-full max-w-md flex-col items-center gap-1 overflow-auto p-2.5">
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
                    disabled={status !== EStatus.playing || !char}
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

export const Jotto: FC<IJotto> = ({
  secretWord,
  lettersStatuses,
  setLettersStatuses,
}) => {
  const [guesses, setGuesses] = useState<{ guess: string; jots: number }[]>(
    Array(NUM_OF_ROWS).fill({ guess: '', jots: 0 }),
  )
  const [currentRowIdx, setCurrentRowIdx] = useState(0)

  const status = useMemo(
    () =>
      currentRowIdx === NUM_OF_ROWS
        ? EStatus.loser
        : guesses[currentRowIdx - 1]?.guess === secretWord
          ? EStatus.winner
          : EStatus.playing,
    [currentRowIdx, guesses, secretWord],
  )

  return (
    <>
      <div className="relative -mt-2.5 flex w-full justify-center overflow-hidden pt-2.5">
        <JottoStatus status={status} secretWord={secretWord} />
        <JottoBoard
          secretWord={secretWord}
          guesses={guesses}
          setGuesses={setGuesses}
          setCurrentRowIdx={setCurrentRowIdx}
          currentRowIdx={currentRowIdx}
          status={status}
          lettersStatuses={lettersStatuses}
          setLettersStatuses={setLettersStatuses}
        />
        <div className="absolute bottom-0 left-0 right-0 h-16 w-full justify-center bg-gradient-to-t from-white to-transparent" />
      </div>
      {status === EStatus.winner && <Confetti />}
    </>
  )
}
