import { ChainId } from '@pancakeswap/sdk'
import { createStore, Store } from 'redux'
import { updateInvestStates } from './actions'
import reducer, { InvestState } from './reducer'

describe('application reducer', () => {
  let store: Store<InvestState>

  beforeEach(() => {
    store = createStore(reducer)
  })

  describe('updateInvestStates', () => {
    it('updates block number', () => {
      store.dispatch(updateInvestStates({ chainId: ChainId.MAINNET, blockNumber: 4 }))
      expect(store.getState().blockNumber[ChainId.MAINNET]).toEqual(4)
    })
    it('no op if late', () => {
      store.dispatch(updateInvestStates({ chainId: ChainId.MAINNET, blockNumber: 2 }))
      expect(store.getState().blockNumber[ChainId.MAINNET]).toEqual(3)
    })
    it('works with non-set chains', () => {
      store.dispatch(updateInvestStates({ chainId: ChainId.TESTNET, blockNumber: 2 }))
      expect(store.getState().blockNumber).toEqual({
        [ChainId.MAINNET]: 3,
        [ChainId.TESTNET]: 2,
      })
    })
  })
})
