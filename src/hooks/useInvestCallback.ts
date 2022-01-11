import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTransactionAdder } from '../state/transactions/hooks'
import isZero from '../utils/isZero'
import { useInvestContract } from './useContract'

export enum InvestCallbackState {
  INVALID,
  LOADING,
  VALID,
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useInvestCallback(
  methodName: string, // trade to execute, required
  args: any[],
  value: string | undefined,
  details?: { [key: string]: string | number },
): { state: InvestCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId, library } = useActiveWeb3React()
  const contract = useInvestContract()

  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    const options = !value || isZero(value) ? {} : { value }
    if (!library || !account || !chainId) {
      return { state: InvestCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }

    return {
      state: InvestCallbackState.VALID,
      callback: async function onInvest() {
        contract.estimateGas[methodName](...args, options)
          .then((gasEstimate) => {
            return {
              methodName,
              gasEstimate,
            }
          })
          .catch((gasError) => {
            console.error('Gas estimate failed, trying eth_call to extract error', methodName)

            return contract.callStatic[methodName](...args, options)
              .then((result) => {
                console.error('Unexpected successful call after failed estimate gas', methodName, gasError, result)
                return { methodName, error: new Error('Unexpected issue with estimating the gas. Please try again.') }
              })
              .catch((callError) => {
                console.error('Call threw error', methodName, callError)
                const reason: string = callError.reason || callError.data?.message || callError.message
                const errorMessage = `The transaction cannot succeed due to error: ${
                  reason ?? 'Unknown error, check the logs'
                }.`

                return { methodName, error: new Error(errorMessage) }
              })
          })

        return contract[methodName](...args, {
          ...(value && !isZero(value) ? { value, from: account } : { from: account }),
        })
          .then((response: any) => {
            const inputSymbol = methodName.split(/(?=[A-Z])/)[1]

            if (inputSymbol === 'Interest') {
              const stts = (+details.stts / 10 ** 8).toFixed(2)
              const dollar = (+details.dollar / 10 ** 8).toFixed(2)
              addTransaction(response, {
                summary: `SmartInvest: Withdraw ${stts} STTS(${dollar}$)`,
              })
            } else {
              const inputAmount = args[args.length - 1].toSignificant(3)
              addTransaction(response, {
                summary: `SmartInvest: Invest ${inputAmount} ${inputSymbol.toUpperCase()}`,
              })
            }

            return response.hash
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error('Transaction rejected.')
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Invest failed`, error, methodName, args, value)
              throw new Error(`Invest failed: ${error.message}`)
            }
          })
      },
      error: null,
    }
  }, [library, account, chainId, contract, methodName, args, value, details, addTransaction])
}
