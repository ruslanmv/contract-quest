// Central game constants and the retro palette.
export const GAME = {
  WIDTH: 640,
  HEIGHT: 360,
  GRAVITY: 1200,
  TILE: 32,
} as const;

export const PALETTE = {
  skyTop: 0x1b2a55,
  skyMid: 0x6b4a4a,
  skyBottom: 0xc97a3c,
  ground: 0x5a4632,
  groundTop: 0x5fa84a,
  metal: 0x46566a,
  metalTop: 0x7fd0ff,
  hero: 0xc9cdd6,
  helmet: 0xffb000,
  visor: 0x36c2ff,
  coin: 0xffcf33,
  bug: 0xff8a3c,
  rmd: 0x3a7bff,
  white: 0xffffff,
} as const;

export const PLAYER = {
  SPEED: 200,
  JUMP: 560,
  ACCEL: 1600,
  DRAG: 1400,
} as const;
