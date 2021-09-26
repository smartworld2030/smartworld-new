import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useSelector } from 'react-redux'
import { AppState } from '../index'
import { BankData } from './reducer'

export function useBankStates(): BankData {
  const { chainId } = useActiveWeb3React()
  return useSelector((state: AppState) => state.bank[chainId ?? -1])
}

export function useSttPrice(): BankData['sttPrice'] {
  const { chainId } = useActiveWeb3React()

  return useSelector((state: AppState) => state.bank[chainId ?? -1]?.sttPrice)
}

export function useBankBalances(): BankData['totalSatoshi'] {
  const { chainId } = useActiveWeb3React()

  return useSelector((state: AppState) => state.bank[chainId ?? -1]?.totalSatoshi)
}

export function useBankSatoshi(): { btc: string; bnb: string; stts: string; stt: string } {
  const { btcToSatoshi, bnbToSatoshi, sttsToSatoshi, sttPrice } = useBankStates()

  return { btc: btcToSatoshi, bnb: bnbToSatoshi, stts: sttsToSatoshi, stt: sttPrice }
}

export function useBankDollars(): { btc: string; bnb: string; stts: string; stt: string } {
  const { bnbToSatoshi, sttsToSatoshi, latestAnswer } = useBankStates()
  const sttPrice = useSttPrice()
  const btc = (+latestAnswer / 10 ** 8).toFixed(2)
  const stt = ((+sttPrice * +btc) / 10 ** 8).toFixed(4)
  const bnb = ((+bnbToSatoshi / 10 ** 8) * +btc).toFixed(2)
  const stts = ((+sttsToSatoshi / 10 ** 8) * +btc).toFixed(2)
  return { btc, bnb, stts, stt }
}

export default useBankStates
