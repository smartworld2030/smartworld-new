import { createReducer } from '@reduxjs/toolkit'
import { updatePoolStates } from './actions'

export interface PoolData {
  maxPercent: string
  calculateInterest: {
    hourly: string
    referral: string
    requestTime: string
  }
  userBalances: {
    bnb: string
    btcb: string
    stts: string
    satoshi: string
  }
  calculatePercent: string
  users: {
    id: string
    refID: string
    refAmounts: string
    refPercent: string
    latestWithdraw: string
  }
}
const defaultPoolData = {
  maxPercent: '1000',
  calculateInterest: {
    hourly: '0',
    referral: '0',
    requestTime: '0',
  },
  userBalances: {
    bnb: '0',
    btcb: '0',
    stts: '0',
    satoshi: '0',
  },
  calculatePercent: '0',
  users: {
    id: '0',
    refID: '0',
    refAmounts: '0',
    refPercent: '0',
    latestWithdraw: '0',
  },
}

export interface PoolState {
  readonly [chainId: number]: PoolData
}

const initialState: PoolState = { 56: defaultPoolData, 97: defaultPoolData }

export default createReducer(initialState, (builder) =>
  builder.addCase(updatePoolStates, (state, action) => {
    const { chainId, states } = action.payload
    state[chainId] = { ...defaultPoolData, ...states }
  }),
)
