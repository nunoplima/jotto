export const Restart = () => (
  <div className="flex justify-center">
    <button
      onClick={() => window.location.reload()}
      className="rounded-full bg-red-500 px-4 py-2 text-xl text-white"
    >
      Reiniciar Jogo
    </button>
  </div>
)
