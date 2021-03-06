import { createReducer } from '@reduxjs/toolkit'
import { updateInvestStates } from './actions'

export interface InvestData {
  loading: boolean
  maxPercent: string
  calculateInterest: {
    stts: string
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
  users: InvestUser
  userDepositNumber: string
  userDepositDetails: any
}
export interface InvestUser {
  referrer: string
  refEndTime: string
  refAmounts: string
  refPercent: string
  totalAmount: string
  latestWithdraw: string
}

const defaultInvestData = {
  loading: true,
  maxPercent: '1000',
  calculateInterest: {
    stts: '0',
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
    referrer: '0',
    refEndTime: '0',
    refAmounts: '0',
    refPercent: '0',
    totalAmount: '0',
    latestWithdraw: '0',
  },
  userDepositNumber: '0',
  userDepositDetails: [{ amount: '0', period: '0', reward: '0', startTime: '0', endTime: '0' }],
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
