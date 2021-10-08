import { createAction } from '@reduxjs/toolkit'
import { PoolData } from './reducer'

export const updatePoolStates = createAction<{ chainId: number; states: PoolData | {} }>('pool/updatePoolStates')

export default updatePoolStates
