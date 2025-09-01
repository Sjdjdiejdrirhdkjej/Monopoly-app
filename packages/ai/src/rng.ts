import seedrandom from 'seedrandom'

export const createAiRng = (seed: string) => {
  const rng = seedrandom(seed, { state: true })
  return {
    next: () => rng(),
  }
}
