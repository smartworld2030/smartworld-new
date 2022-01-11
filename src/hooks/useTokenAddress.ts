import info from 'utils/contracts/info'
import useActiveWeb3React from './useActiveWeb3React'

/**
 * Given a name or address, does a lookup to resolve to an address and name
 * @param nameOrAddress ENS name or address
 */
export default function useTokenAdress(name?: string | null): string | undefined | null {
  const { chainId } = useActiveWeb3React()
  const address = info[chainId][name]
  return address
}
