import ethers, { Contract, ContractFunction } from 'ethers'

export type MultiCallResponse<T> = T | null

// Chainlink Orance
export type ChainLinkOracleLatestAnswerResponse = ethers.BigNumber

export interface ChainLinkOracleContract extends Contract {
  latestAnswer: ContractFunction<ChainLinkOracleLatestAnswerResponse>
}
