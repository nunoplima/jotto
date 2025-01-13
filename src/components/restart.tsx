import { useJottoStore } from '../store'

export const Restart = () => {
  const restart = useJottoStore((state) => state.restart)

  return (
    <div className="flex justify-center">
      <button
        onClick={restart}
        className="rounded-full bg-red-500 px-4 py-2 text-xl text-white"
      >
        Reiniciar Jogo
      </button>
    </div>
  )
}
