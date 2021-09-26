import { ethers } from 'ethers'
import { simpleRpcProvider } from 'utils/providers'

// Addresses
import {
  getPancakeProfileAddress,
  getMasterChefAddress,
  getPointCenterIfoAddress,
  getClaimRefundAddress,
  getTradingCompetitionAddress,
  getChainlinkOracleAddress,
  getMulticallAddress,
} from 'utils/addressHelpers'
// ABI
import bep20Abi from 'config/abi/erc20.json'
import erc721Abi from 'config/abi/erc721.json'
import lpTokenAbi from 'config/abi/lpToken.json'
import profileABI from 'config/abi/pancakeProfile.json'
import pointCenterIfo from 'config/abi/pointCenterIfo.json'
import masterChef from 'config/abi/masterchef.json'
import claimRefundAbi from 'config/abi/claimRefund.json'
import tradingCompetitionAbi from 'config/abi/tradingCompetition.json'
import chainlinkOracleAbi from 'config/abi/chainlinkOracle.json'
import MultiCallAbi from 'config/abi/Multicall.json'
import { ChainLinkOracleContract } from './types'

const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  const signerOrProvider = signer ?? simpleRpcProvider
  return new ethers.Contract(address, abi, signerOrProvider)
}

export const getBep20Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(bep20Abi, address, signer)
}
export const getErc721Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(erc721Abi, address, signer)
}
export const getLpContract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(lpTokenAbi, address, signer)
}
export const getProfileContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(profileABI, getPancakeProfileAddress(), signer)
}
export const getPointCenterIfoContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(pointCenterIfo, getPointCenterIfoAddress(), signer)
}
export const getMasterchefContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(masterChef, getMasterChefAddress(), signer)
}
export const getClaimRefundContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(claimRefundAbi, getClaimRefundAddress(), signer)
}
export const getTradingCompetitionContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(tradingCompetitionAbi, getTradingCompetitionAddress(), signer)
}

export const getChainlinkOracleContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(chainlinkOracleAbi, getChainlinkOracleAddress(), signer) as ChainLinkOracleContract
}
export const getMulticallContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(MultiCallAbi, getMulticallAddress(), signer)
}
