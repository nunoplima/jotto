import { Dispatch, SetStateAction, FC } from 'react'
import { LETTERS } from '../constants'
import { DiagonalLine } from './diagonal-line'
import { Circle } from './circle'
import { ECharacterStatus } from '../enums'

interface IAlphabet {
  lettersStatuses: Record<string, string>
  setLettersStatuses: Dispatch<SetStateAction<Record<string, ECharacterStatus>>>
}

export const Alphabet: FC<IAlphabet> = ({
  lettersStatuses,
  setLettersStatuses,
}) => {
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
