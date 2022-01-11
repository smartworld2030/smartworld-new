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

export function useBankSatoshi(): { BTC: string; BNB: string; STTS: string; STT: string } {
  const { btcToSatoshi, bnbToSatoshi, sttsToSatoshi, sttPrice } = useBankStates()

  return { BTC: btcToSatoshi, BNB: bnbToSatoshi, STTS: sttsToSatoshi, STT: sttPrice }
}

export function useBankDollars(): { BTC: string; BNB: string; STTS: string; STT: string; LPTOKEN: string } {
  const { bnbToSatoshi, sttsToSatoshi, latestAnswer } = useBankStates()
  const sttPrice = useSttPrice()
  const BTC = (+latestAnswer / 10 ** 8).toFixed(2)
  const STT = ((+sttPrice * +BTC) / 10 ** 8).toFixed(4)
  const BNB = ((+bnbToSatoshi / 10 ** 8) * +BTC).toFixed(2)
  const STTS = ((+sttsToSatoshi / 10 ** 8) * +BTC).toFixed(2)
  const LPTOKEN = (+STTS * 2).toFixed(2)
  return { BTC, BNB, STTS, STT, LPTOKEN }
}

export default useBankStates
