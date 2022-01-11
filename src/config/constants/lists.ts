const PANCAKE_EXTENDED = 'https://tokens.pancakeswap.finance/pancakeswap-extended.json'
const PANCAKE_TOP100 = 'https://tokens.pancakeswap.finance/pancakeswap-top-100.json'

export type TokenDetail = [string, number, string, string][]
export type ProjectChainToken = { readonly [key: number]: TokenDetail }

export const UNSUPPORTED_LIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  PANCAKE_TOP100,
  PANCAKE_EXTENDED,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_INVEST_LIST_TOKENS: ProjectChainToken = {
  56: [
    ['0xbBe476b50D857BF41bBd1EB02F777cb9084C1564', 8, 'STT', 'Smart World Token - Stock'],
    ['0x88469567A9e6b2daE2d8ea7D8C77872d9A0d43EC', 8, 'STTS', 'Smart World Token'],
    ['0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 18, 'BTC', 'Binance-Peg BTCB Token'],
    ['0x45Ee99347E4E3946bE250fEC8172401965E2DFB3', 18, 'LPTOKEN', 'STTS-BNB Liquidity Pool Token'],
  ],
  97: [
    ['0x75Bea6460fff60FF789F88f7FE005295B8901455', 8, 'STT', 'Smart World Token - Stock'],
    ['0xBFd0Ac6cD15712E0a697bDA40897CDc54b06D7Ef', 8, 'STTS', 'Smart World Token '],
    ['0x3c26729bb1Cf37d18EFdF3bb957f5e0de5c2Cb12', 18, 'BTC', 'Binance-Peg BTCB Token'],
    ['0x3403db5EDd2541Aaa3793De4C0FFb31463A3D1cF', 18, 'LPTOKEN', 'STTS-BNB Liquidity Pool Token'],
  ],
}

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = []
