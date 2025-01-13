import { FC } from 'react'
import { LETTERS } from '../constants'
import { DiagonalLine } from './diagonal-line'
import { Circle } from './circle'
import { ECharacterStatus } from '../enums'
import { useJottoStore } from '../store'

export const Alphabet: FC = () => {
  const lettersStatuses = useJottoStore((state) => state.lettersStatuses)
  const setLettersStatuses = useJottoStore((state) => state.setLettersStatuses)

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

  return (
    <div className="flex max-w-screen-md flex-wrap justify-center gap-3">
      {LETTERS.map((letter) => (
        <div
          key={letter}
          className="relative cursor-pointer"
          onClick={handleClick(letter)}
        >
          {letter}
          {lettersStatuses[letter] === ECharacterStatus.notPresent && (
            <DiagonalLine />
          )}
          {lettersStatuses[letter] === ECharacterStatus.correct && <Circle />}
        </div>
      ))}
    </div>
  )
}
