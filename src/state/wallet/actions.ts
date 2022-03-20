import { createAction } from '@reduxjs/toolkit'
import { WalletData } from './reducer'

export const updateWalletStates =
  createAction<{ chainId: number; states: WalletData | {} }>('wallet/updateWalletStates')

export default updateWalletStates
