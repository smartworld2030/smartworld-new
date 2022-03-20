import { createAction } from '@reduxjs/toolkit'
import { InvestData } from './reducer'

export const updateInvestStates =
  createAction<{ chainId: number; states: InvestData | {} }>('invest/updateInvestStates')

export default updateInvestStates
