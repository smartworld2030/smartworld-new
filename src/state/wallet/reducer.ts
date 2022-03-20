import { CurrencyAmount } from '@pancakeswap/sdk'
import { createReducer } from '@reduxjs/toolkit'
import { updateWalletStates } from './actions'

export interface WalletData {
  loading: boolean
  balances: {
    BNB: CurrencyAmount
    BTCB: CurrencyAmount
    STTS: CurrencyAmount
    STT: CurrencyAmount
    LPTOKEN: CurrencyAmount
  }
}

const defaultWalletData = {
  loading: true,
  balances: {
    BNB: undefined,
    BTCB: undefined,
    STTS: undefined,
    STT: undefined,
    LPTOKEN: undefined,
  },
}

export interface WalletState {
  readonly [chainId: number]: WalletData
}

const initialState: WalletState = { 56: defaultWalletData, 97: defaultWalletData }

export default createReducer(initialState, (builder) =>
  builder.addCase(updateWalletStates, (state, action) => {
    const { chainId, states } = action.payload
    state[chainId] = { ...defaultWalletData, ...states }
  }),
)
