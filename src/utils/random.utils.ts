import * as seedrandom from 'seedrandom';

export const generateRandomNumber = (min: number, max: number, seed: string = null) => {
  const generator = (seed)
    ? seedrandom(seed)
    : Math.random;
  return Math.floor(generator() * max) + min;
};