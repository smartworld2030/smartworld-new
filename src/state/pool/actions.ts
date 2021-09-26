import { createAction } from '@reduxjs/toolkit'
import { PoolData } from './reducer'

export const updatePoolStates = createAction<{ chainId: number; states: PoolData | {} }>('invest/updatePoolStates')

export default updatePoolStates
