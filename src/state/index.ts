import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'
import { useDispatch } from 'react-redux'
import application from './application/reducer'
import bank from './bank/reducer'
import { updateVersion } from './global/actions'
import user from './user/reducer'
import transactions from './transactions/reducer'
import swap from './swap/reducer'
import lists from './lists/reducer'
import burn from './burn/reducer'
import multicall from './multicall/reducer'
import mint from './mint/reducer'
import invest from './invest/reducer'

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists']

export const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    // Exchange
    application,
    invest,
    bank,
    user,
    transactions,
    swap,
    mint,
    burn,
    multicall,
    lists,
  },
  middleware: [...getDefaultMiddleware({ thunk: true }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS }),
})

store.dispatch(updateVersion())

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
export const useAppDispatch = () => useDispatch()

export default store
