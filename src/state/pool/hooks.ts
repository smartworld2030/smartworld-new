import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useSelector } from 'react-redux'
import { AppState } from '../index'
import { PoolData } from './reducer'

export function usePoolStates(): PoolData {
  const { chainId } = useActiveWeb3React()
  return useSelector((state: AppState) => state.pool[chainId ?? -1])
}

export function usePoolMax(): number {
  const { chainId } = useActiveWeb3React()

  return useSelector((state: AppState) => +state.pool[chainId ?? -1]?.maxPercent)
}

export function useUserPoolDetails(): PoolData {
  return usePoolStates()
}

export function useUserPoolInfo(): PoolData['users'] {
  const { chainId } = useActiveWeb3React()

  return useSelector((state: AppState) => state.pool[chainId ?? -1]?.users)
}

export function useLiquidityValue(): PoolData['calculateLiquidityValue'] {
  const { chainId } = useActiveWeb3React()

  return useSelector((state: AppState) => state.pool[chainId ?? -1]?.calculateLiquidityValue)
}

export function useUserPoolInterest(): PoolData['calculateInterest'] {
  const { chainId } = useActiveWeb3React()

  return useSelector((state: AppState) => state.pool[chainId ?? -1]?.calculateInterest)
}

export function useUserPoolPercent(): PoolData['calculatePercent'] {
  const { chainId } = useActiveWeb3React()

  return useSelector((state: AppState) => state.pool[chainId ?? -1]?.calculatePercent)
}

export function useUserPoolBalance(): PoolData['userBalances'] {
  const { chainId } = useActiveWeb3React()

  return useSelector((state: AppState) => state.pool[chainId ?? -1]?.userBalances)
}

export default usePoolStates
