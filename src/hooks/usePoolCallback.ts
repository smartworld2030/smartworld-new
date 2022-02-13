import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTransactionAdder } from '../state/transactions/hooks'
import isZero from '../utils/isZero'
import { usePoolContract } from './useContract'
import useToast from './useToast'
import compileErrorMessage from 'utils/compileErrorMessage'
import { calculateGasMargin } from 'utils'

export enum InvestCallbackState {
  INVALID,
  LOADING,
  VALID,
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function usePoolCallback(
  methodName: string, // trade to execute, required
  args: any[],
  value: string | undefined,
  details?: { [key: string]: string | number },
): { state: InvestCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId, library } = useActiveWeb3React()
  const contract = usePoolContract()
  const { toastError } = useToast()

  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    const options = !value || isZero(value) ? {} : { value }
    if (!library || !account || !chainId) {
      return { state: InvestCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }

    return {
      state: InvestCallbackState.VALID,
      callback: async () => {
        const gasEstimate = await contract.estimateGas[methodName](...args, options)
          .then((gasEstimate) => {
            return gasEstimate
          })
          .catch((gasError) => {
            console.error('Gas estimate failed, trying eth_call to extract error', methodName)

            return contract.callStatic[methodName](...args, options)
              .then((result) => {
                console.error('Unexpected successful call after failed estimate gas', methodName, gasError, result)
                return new Error('Unexpected issue with estimating the gas. Please try again.')
              })
              .catch((callError) => {
                console.error('Call threw error', methodName, callError)
                const reason: string = callError.reason || callError.data?.message || callError.message
                const errorMessage = `The transaction cannot succeed due to error: ${
                  reason ?? 'Unknown error, check the logs'
                }.`

                return new Error(errorMessage)
              })
          })

        if (gasEstimate instanceof Error) {
          toastError(...compileErrorMessage(gasEstimate))
          // throw gasEstimate
          return
        }
        console.log(gasEstimate)
        return contract[methodName](...args, {
          gasLimit: calculateGasMargin(gasEstimate),
          ...(value && !isZero(value) ? { value, from: account } : { from: account }),
        })
          .then((response: any) => {
            const inputSymbol = methodName.split(/(?=[A-Z])/)
            if (inputSymbol[1] === 'Interest') {
              const stts = (+details.stts / 10 ** 8).toFixed(2)
              const dollar = (+details.dollar / 10 ** 8).toFixed(2)
              addTransaction(response, {
                summary: `SmartPool: Withdraw ${stts} STTS(${dollar}$)`,
              })
            } else if (inputSymbol[2] === 'L') {
              const stts = (+details.lptoken / 10 ** 8).toFixed(2)
              addTransaction(response, {
                summary: `SmartPool: Freeze ${stts} LPToken`,
              })
            } else {
              const stts = (+details.stts / 10 ** 8).toFixed(2)
              const bnb = (+details.bnb / 10 ** 18).toFixed(4)
              addTransaction(response, {
                summary: `SmartPool: Freeze ${stts} STTS + ${bnb} BNB`,
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
              console.error(`Freeze failed`, error, methodName, args, value)
              throw new Error(`Freeze failed: ${error.message}`)
            }
          })
      },
      error: null,
    }
  }, [
    value,
    library,
    account,
    chainId,
    contract,
    methodName,
    args,
    toastError,
    details.stts,
    details.dollar,
    details.lptoken,
    details.bnb,
    addTransaction,
  ])
}
