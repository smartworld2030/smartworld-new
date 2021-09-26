import { ChainId } from '@pancakeswap/sdk'
import { createStore, Store } from 'redux'
import { updateBankStates } from './actions'
import reducer, { BankState } from './reducer'

describe('application reducer', () => {
  let store: Store<BankState>

  beforeEach(() => {
    store = createStore(reducer)
  })

  describe('updateBankStates', () => {
    it('updates block number', () => {
      store.dispatch(updateBankStates({ chainId: ChainId.MAINNET, blockNumber: 4 }))
      expect(store.getState().blockNumber[ChainId.MAINNET]).toEqual(4)
    })
    it('no op if late', () => {
      store.dispatch(updateBankStates({ chainId: ChainId.MAINNET, blockNumber: 2 }))
      expect(store.getState().blockNumber[ChainId.MAINNET]).toEqual(3)
    })
    it('works with non-set chains', () => {
      store.dispatch(updateBankStates({ chainId: ChainId.TESTNET, blockNumber: 2 }))
      expect(store.getState().blockNumber).toEqual({
        [ChainId.MAINNET]: 3,
        [ChainId.TESTNET]: 2,
      })
    })
  })
})
