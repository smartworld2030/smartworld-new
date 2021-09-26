import { createReducer } from '@reduxjs/toolkit'
import { updateInvestStates } from './actions'

export interface InvestData {
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
const defaultInvestData = {
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

export interface InvestState {
  readonly [chainId: number]: InvestData
}

const initialState: InvestState = { 56: defaultInvestData, 97: defaultInvestData }

export default createReducer(initialState, (builder) =>
  builder.addCase(updateInvestStates, (state, action) => {
    const { chainId, states } = action.payload
    state[chainId] = { ...defaultInvestData, ...states }
  }),
)
