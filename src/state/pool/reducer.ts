import { createReducer } from '@reduxjs/toolkit'
import { updatePoolStates } from './actions'

export interface PoolData {
  maxPercent: string
  calculateInterest: {
    daily: string
    referral: string
    referrer: string
    requestTime: string
  }
  userBalances: {
    bnb: string
    btcb: string
    stts: string
    satoshi: string
  }
  calculateLiquidityValue: {
    bnb: string
    stts: string
    total: string
  }
  calculatePercent: string
  users: {
    id: string
    liquidity: string
    referrer: string
    refAmounts: string
    refPercent: string
    latestWithdraw: string
  }
}
const defaultPoolData = {
  maxPercent: '1000',
  calculateInterest: {
    daily: '0',
    referral: '0',
    referrer: '0',
    requestTime: '0',
  },
  userBalances: {
    bnb: '0',
    btcb: '0',
    stts: '0',
    satoshi: '0',
  },
  calculateLiquidityValue: {
    bnb: '0',
    stts: '0',
    total: '0',
  },
  calculatePercent: '0',
  users: {
    id: '0',
    referrer: '0',
    liquidity: '0',
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
