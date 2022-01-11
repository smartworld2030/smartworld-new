import { createReducer } from '@reduxjs/toolkit'
import { updateBankStates } from './actions'

export interface BankData {
  totalSatoshi: { BTC: string; STTS: string; BNB: string }
  sttPrice: string
  btcToSatoshi: string
  bnbToSatoshi: string
  sttsToSatoshi: string
  latestAnswer: string
}
const defaultBankData = {
  totalSatoshi: { BTC: '0', STTS: '0', BNB: '0' },
  sttPrice: '0',
  btcToSatoshi: '0',
  bnbToSatoshi: '0',
  sttsToSatoshi: '0',
  latestAnswer: '0',
}

export interface BankState {
  readonly [chainId: number]: BankData
}

const initialState: BankState = { 56: defaultBankData, 97: defaultBankData }

export default createReducer(initialState, (builder) =>
  builder.addCase(updateBankStates, (state, action) => {
    const { chainId, states } = action.payload
    if (states) state[chainId] = { ...states[chainId], ...states }
  }),
)
