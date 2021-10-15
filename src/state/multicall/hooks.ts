import { Interface, FunctionFragment } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBlockNumber } from '../application/hooks'
import { AppDispatch, AppState } from '../index'
import {
  addMulticallListeners,
  Call,
  removeMulticallListeners,
  parseCallKey,
  toCallKey,
  ListenerOptions,
} from './actions'
import useIsWindowVisible from 'hooks/useIsWindowVisible'
import { getMulticallContract } from 'utils/contractHelpers'

export interface Result extends ReadonlyArray<any> {
  readonly [key: string]: any
}

type MethodArg = string | number | BigNumber
type MethodArgs = Array<MethodArg | MethodArg[]>

export type OptionalMethodInputs = Array<MethodArg | MethodArg[] | undefined> | undefined

function isMethodArg(x: unknown): x is MethodArg {
  return ['string', 'number'].indexOf(typeof x) !== -1
}

function isValidMethodArgs(x: unknown): x is MethodArgs | undefined {
  return (
    x === undefined ||
    (Array.isArray(x) && x.every((xi) => isMethodArg(xi) || (Array.isArray(xi) && xi.every(isMethodArg))))
  )
}

interface CallResult {
  readonly valid: boolean
  readonly data: string | undefined
  readonly blockNumber: number | undefined
}

const INVALID_RESULT: CallResult = { valid: false, blockNumber: undefined, data: undefined }

// use this options object
export const NEVER_RELOAD: ListenerOptions = {
  blocksPerFetch: Infinity,
}

// the lowest level call for subscribing to contract data
function useCallsData(calls: (Call | undefined)[], options?: ListenerOptions): CallResult[] {
  const { chainId } = useActiveWeb3React()
  const callResults = useSelector<AppState, AppState['multicall']['callResults']>(
    (state) => state.multicall.callResults,
  )
  const dispatch = useDispatch<AppDispatch>()

  const serializedCallKeys: string = useMemo(
    () =>
      JSON.stringify(
        calls
          ?.filter((c): c is Call => Boolean(c))
          ?.map(toCallKey)
          ?.sort() ?? [],
      ),
    [calls],
  )

  // update listeners when there is an actual change that persists for at least 100ms
  useEffect(() => {
    const callKeys: string[] = JSON.parse(serializedCallKeys)
    if (!chainId || callKeys.length === 0) return undefined
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const calls = callKeys.map((key) => parseCallKey(key))
    dispatch(
      addMulticallListeners({
        chainId,
        calls,
        options,
      }),
    )

    return () => {
      dispatch(
        removeMulticallListeners({
          chainId,
          calls,
          options,
        }),
      )
    }
  }, [chainId, dispatch, options, serializedCallKeys])

  return useMemo(
    () =>
      calls.map<CallResult>((call) => {
        if (!chainId || !call) return INVALID_RESULT

        const result = callResults[chainId]?.[toCallKey(call)]
        let data
        if (result?.data && result?.data !== '0x') {
          // eslint-disable-next-line prefer-destructuring
          data = result.data
        }

        return { valid: true, data, blockNumber: result?.blockNumber }
      }),
    [callResults, calls, chainId],
  )
}

interface CallState {
  readonly valid: boolean
  // the result, or undefined if loading or errored/no data
  readonly result: Result | undefined
  // true if the result has never been fetched
  readonly loading: boolean
  // true if the result is not for the latest block
  readonly syncing: boolean
  // true if the call was made and is synced, but the return data is invalid
  readonly error: boolean
}

const INVALID_CALL_STATE: CallState = { valid: false, result: undefined, loading: false, syncing: false, error: false }
const LOADING_CALL_STATE: CallState = { valid: true, result: undefined, loading: true, syncing: true, error: false }

export function toCallState(
  callResult: CallResult | undefined,
  contractInterface: Interface | undefined,
  fragment: FunctionFragment | undefined,
  latestBlockNumber: number | undefined,
): CallState {
  if (!callResult) return INVALID_CALL_STATE
  const { valid, data, blockNumber } = callResult
  if (!valid) return INVALID_CALL_STATE
  if (valid && !blockNumber) return LOADING_CALL_STATE
  if (!contractInterface || !fragment || !latestBlockNumber) return LOADING_CALL_STATE
  const success = data && data.length > 2
  const syncing = (blockNumber ?? 0) < latestBlockNumber
  let result: Result | undefined
  if (success && data) {
    try {
      result = contractInterface.decodeFunctionResult(fragment, data)
    } catch (error) {
      console.debug('Result data parsing failed', fragment, data)
      return {
        valid: true,
        loading: false,
        error: true,
        syncing,
        result,
      }
    }
  }
  return {
    valid: true,
    loading: false,
    syncing,
    result,
    error: !success,
  }
}

export function useSingleContractMultipleData(
  contract: Contract | null | undefined,
  methodName: string,
  callInputs: OptionalMethodInputs[],
  options?: ListenerOptions,
): CallState[] {
  const fragment = useMemo(() => contract?.interface?.getFunction(methodName), [contract, methodName])

  const calls = useMemo(
    () =>
      contract && fragment && callInputs && callInputs.length > 0
        ? callInputs.map<Call>((inputs) => {
            return {
              address: contract.address,
              callData: contract.interface.encodeFunctionData(fragment, inputs),
            }
          })
        : [],
    [callInputs, contract, fragment],
  )

  const results = useCallsData(calls, options)
  const latestBlockNumber = useBlockNumber()

  return useMemo(() => {
    return results.map((result) => toCallState(result, contract?.interface, fragment, latestBlockNumber))
  }, [fragment, contract, results, latestBlockNumber])
}

export function useMultipleContractSingleData(
  addresses: (string | undefined)[],
  contractInterface: Interface,
  methodName: string,
  callInputs?: OptionalMethodInputs,
  options?: ListenerOptions,
): CallState[] {
  const fragment = useMemo(() => contractInterface.getFunction(methodName), [contractInterface, methodName])
  const callData: string | undefined = useMemo(
    () =>
      fragment && isValidMethodArgs(callInputs)
        ? contractInterface.encodeFunctionData(fragment, callInputs)
        : undefined,
    [callInputs, contractInterface, fragment],
  )

  const calls = useMemo(
    () =>
      fragment && addresses && addresses.length > 0 && callData
        ? addresses.map<Call | undefined>((address) => {
            return address && callData
              ? {
                  address,
                  callData,
                }
              : undefined
          })
        : [],
    [addresses, callData, fragment],
  )

  const results = useCallsData(calls, options)

  const latestBlockNumber = useBlockNumber()

  return useMemo(() => {
    return results.map((result) => toCallState(result, contractInterface, fragment, latestBlockNumber))
  }, [fragment, results, contractInterface, latestBlockNumber])
}

export function useSingleCallResult(
  contract: Contract | null | undefined,
  methodName: string,
  inputs?: OptionalMethodInputs,
  options?: ListenerOptions,
): CallState {
  const fragment = useMemo(() => contract?.interface?.getFunction(methodName), [contract, methodName])

  const calls = useMemo<Call[]>(() => {
    return contract && fragment && isValidMethodArgs(inputs)
      ? [
          {
            address: contract.address,
            callData: contract.interface.encodeFunctionData(fragment, inputs),
          },
        ]
      : []
  }, [contract, fragment, inputs])

  const result = useCallsData(calls, options)[0]
  const latestBlockNumber = useBlockNumber()

  return useMemo(() => {
    return toCallState(result, contract?.interface, fragment, latestBlockNumber)
  }, [result, contract, fragment, latestBlockNumber])
}

export function useSingleCallMultipleMethod(
  contract: Contract | null | undefined,
  methodNames: string[],
  inputs?: OptionalMethodInputs[],
  options?: ListenerOptions,
): CallState[] {
  const fragments = useMemo(() => methodNames.map((methodName) => contract?.interface?.getFunction(methodName)), [
    contract,
    methodNames,
  ])

  const calls = useMemo<Call[]>(() => {
    return contract && fragments && isValidMethodArgs(inputs)
      ? fragments.reduce(
          (frags, frag, i) => [
            ...frags,
            {
              address: contract.address,
              callData: contract.interface.encodeFunctionData(frag, inputs[i]),
            },
          ],
          [],
        )
      : []
  }, [contract, fragments, inputs])
  const results = useCallsData(calls, options)
  const latestBlockNumber = useBlockNumber()

  return useMemo(() => {
    return results.map((result, i) => toCallState(result, contract?.interface, fragments[i], latestBlockNumber))
  }, [results, contract, fragments, latestBlockNumber])
}

export interface MultiCallSingleData {
  ifs: Interface
  address: string
  name: string
  decimals?: number
  methods: string[]
  args: (string | number)[][]
}

export interface MultiCallMultipleData {
  ifs: Interface
  address: string
  methods: string[]
  args: (string | number)[][]
}
export interface MultiCall {
  target: string
  callData: string
}
interface MulticallOptions {
  requireSuccess?: boolean
}

/**
 * Fetches a chunk of calls, enforcing a minimum block number constraint
 * @param multiCalls chunk of calls to make
 */
export async function multiCallMultipleData(
  multiContract: Contract,
  multiCalls: MultiCallMultipleData[],
  options: MulticallOptions = { requireSuccess: false },
): Promise<{ [key: string]: string | string[] }> {
  const { requireSuccess } = options

  let callCounter = 0

  const calls: MultiCall[] = multiCalls.reduce(
    (calls, { ifs, address, methods, args }) => [
      ...calls,
      ...methods.reduce(
        (items, method, i) => [
          ...items,
          {
            target: address.toLowerCase(),
            callData: ifs.encodeFunctionData(method, args[i]),
          },
        ],
        [],
      ),
    ],
    [],
  )
  try {
    const multiCall = calls.map(({ target, callData }) => [target, callData])
    const data = await multiContract.tryAggregate(requireSuccess, multiCall)
    return multiCalls.reduce(
      (items, { ifs, methods }) => ({
        ...items,
        ...methods.reduce(
          (its, method) => ({
            ...its,
            [method]: ifs.decodeFunctionResult(method, data[callCounter++].returnData),
          }),
          {},
        ),
      }),
      {},
    )
  } catch (error) {
    console.log(error)
    return {}
  }
}

/**
 * Fetches a chunk of calls, enforcing a minimum block number constraint
 * @param multiCalls chunk of calls to make
 */
export function useMultiCallSingleData(
  multiCalls: MultiCallSingleData[],
  options: MulticallOptions = { requireSuccess: false },
): { [key: string]: string | string[] } {
  const { requireSuccess } = options
  const [states, setStates] = useState({})
  const latestBlockNumber = useBlockNumber()
  const multiContract = getMulticallContract()
  const windowVisible = useIsWindowVisible()

  useEffect(() => {
    if (!latestBlockNumber || !windowVisible) return

    if (multiCalls) {
      multiCallRequest(multiContract, multiCalls, requireSuccess).then((res) => {
        setStates(res)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiCalls, windowVisible])

  return states
}

export async function multiCallRequest(multiContract, multiCalls: MultiCallSingleData[], requireSuccess) {
  let callCounter = 0

  const calls: MultiCall[] = multiCalls.reduce(
    (calls, { ifs, address, methods, args }) => [
      ...calls,
      ...methods.reduce(
        (items, method, i) => [
          ...items,
          {
            target: address.toLowerCase(),
            callData: ifs.encodeFunctionData(method, args[i]),
          },
        ],
        [],
      ),
    ],
    [],
  )
  try {
    const multiCall = calls.map(({ target, callData }) => [target, callData])
    const data = await multiContract.tryAggregate(requireSuccess, multiCall)
    return multiCalls.reduce(
      (items, { name, ifs, methods }, i) => ({
        ...items,
        ...methods.reduce(
          (its, method) => ({
            ...its,
            [name ? name : method + i]: ifs.decodeFunctionResult(method, data[callCounter++].returnData),
          }),
          {},
        ),
      }),
      {},
    )
  } catch (error) {
    console.log(error)
    return {}
  }
}

export async function singleContractMultiCallRequest(
  multiContract: Contract,
  multiCalls: MultiCallMultipleData,
  requireSuccess: boolean,
) {
  const calls: MultiCall[] = multiCalls.methods.reduce(
    (items, method, i) => [
      ...items,
      {
        target: multiCalls.address.toLowerCase(),
        callData: multiCalls.ifs.encodeFunctionData(method, multiCalls.args[i]),
      },
    ],
    [],
  )
  try {
    const multiCall = calls.map(({ target, callData }) => [target, callData])
    const data = await multiContract.tryAggregate(requireSuccess, multiCall)

    return multiCalls.methods.reduce(
      (its, method, i) => [...its, multiCalls.ifs.decodeFunctionResult(method, data[i].returnData)],
      [],
    )
  } catch (error) {
    console.log(error)
    return []
  }
}

export const resConverter = (data: { [key: string]: string }) => {
  return Object.keys(data).length === 1
    ? data?.toString()
    : Object.keys(data).reduce((res, key) => key.length > 1 && { ...res, [key]: data[key].toString() }, {})
}
