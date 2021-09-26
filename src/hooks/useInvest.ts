import { useMemo } from 'react'
import { useSingleCallMultipleMethod } from '../state/multicall/hooks'
import { useInvestContract } from './useContract'

export function useInvest() {
  const investContract = useInvestContract()
  const methods = useMemo(() => ['maxPercent'], [])
  const args = [[]]

  const results = useSingleCallMultipleMethod(investContract, methods, args)

  return useMemo(() => {
    return results.reduce(
      (items, result, i) =>
        result && {
          ...items,
          [methods[i]]:
            Object.keys(result).length === 1
              ? result[0].toString()
              : Object.keys(result).reduce(
                  (res, key) => key.length > 1 && { ...res, [key]: result[key].toString() },
                  {},
                ),
        },
      {},
    )
  }, [results, methods])
}

export function useUserInvest(account: string) {
  const investContract = useInvestContract()
  const methods = useMemo(() => ['calculateInterest', 'userBalances', 'users'], [])
  const args = [[account], [account], [account]]

  const results = useSingleCallMultipleMethod(investContract, methods, args)

  return useMemo(() => {
    return results.reduce(
      (items, { result }, i) =>
        result && {
          ...items,
          [methods[i]]: Object.keys(result).reduce(
            (res, key) => key.length > 1 && { ...res, [key]: result[key].toString() },
            {},
          ),
        },
      {},
    )
  }, [results, methods])
}
