import { createAction } from '@reduxjs/toolkit'
import { BankData } from './reducer'

export const updateBankStates = createAction<{ chainId: number; states: BankData | {} }>('bank/updateBankStates')

export default updateBankStates
