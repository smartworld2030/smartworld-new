import {
  Currency,
  CurrencyAmount,
  ETHER,
  JSBI,
  Token,
  TokenAmount,
} from "@pancakeswap/sdk";
import { useEffect, useMemo, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import ERC20_INTERFACE from "config/abi/erc20";
import { useProjectTokens, useAllTokens } from "hooks/Tokens";
import { useMulticallContract } from "hooks/useContract";
import { isAddress } from "utils";
import {
  useSingleContractMultipleData,
  useMultipleContractSingleData,
  MultiCallSingleData,
  multiCallRequest,
} from "../multicall/hooks";
import { getMulticallContract } from "utils/contractHelpers";
import useIsWindowVisible from "hooks/useIsWindowVisible";
import useBlockNumber from "state/application/hooks";
import useDebounce from "hooks/useDebounce";

/**
 * Returns a map of the given addresses to their eventually consistent BNB balances.
 */
export function useBNBBalances(
  uncheckedAddresses?: (string | undefined)[]
): {
  [address: string]: CurrencyAmount | undefined;
} {
  const multicallContract = useMulticallContract();

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== false)
            .sort()
        : [],
    [uncheckedAddresses]
  );

  const results = useSingleContractMultipleData(
    multicallContract,
    "getEthBalance",
    addresses.map((address) => [address])
  );

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: CurrencyAmount }>(
        (memo, address, i) => {
          const value = results?.[i]?.result?.[0];
          if (value)
            memo[address] = CurrencyAmount.ether(JSBI.BigInt(value.toString()));
          return memo;
        },
        {}
      ),
    [addresses, results]
  );
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: TokenAmount | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () =>
      tokens?.filter(
        (t?: Token): t is Token => isAddress(t?.address) !== false
      ) ?? [],
    [tokens]
  );

  const validatedTokenAddresses = useMemo(
    () => validatedTokens.map((vt) => vt.address),
    [validatedTokens]
  );

  const balances = useMultipleContractSingleData(
    validatedTokenAddresses,
    ERC20_INTERFACE,
    "balanceOf",
    [address]
  );

  const anyLoading: boolean = useMemo(
    () => balances.some((callState) => callState.loading),
    [balances]
  );

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{
              [tokenAddress: string]: TokenAmount | undefined;
            }>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0];
              const amount = value ? JSBI.BigInt(value.toString()) : undefined;
              if (amount) {
                memo[token.address] = new TokenAmount(token, amount);
              }
              return memo;
            }, {})
          : {},
      [address, validatedTokens, balances]
    ),
    anyLoading,
  ];
}

export function useProjectBalances(
  account: string,
  tokens: Token[]
): {
  [key: string]: string | undefined;
} {
  const [states, setStates] = useState({});
  const latestBlockNumber = useBlockNumber();
  const multiContract = getMulticallContract();
  const windowVisible = useIsWindowVisible();

  const multicall: MultiCallSingleData[] = useMemo(
    () =>
      tokens.reduce(
        (items, { address, symbol, decimals }) => [
          ...items,
          {
            ifs: ERC20_INTERFACE,
            name: symbol,
            address,
            methods: ["balanceOf"],
            args: [[account]],
            decimals,
          },
        ],
        [
          {
            ifs: multiContract.interface,
            name: "BNB",
            address: multiContract.address,
            methods: ["getEthBalance"],
            args: [[account]],
            decimals: 18,
          },
        ]
      ),
    [tokens, account, multiContract]
  );

  const blockNumber = useDebounce(latestBlockNumber, 1000);
  const visible = useDebounce(windowVisible, 1000);

  useEffect(() => {
    multiCallRequest(multiContract, multicall, false)
      .then((result) => {
        setStates(result);
      })
      .catch(() => setStates({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, blockNumber, account]);

  return useMemo(
    () =>
      multicall.reduce<{ [address: string]: string }>(
        (memo, { name, decimals }) => {
          const value: string = states?.[name]?.[0].toString();
          if (value) memo[name] = (+value / 10 ** decimals).toString();
          return memo;
        },
        {}
      ),
    [states, multicall]
  );
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: TokenAmount | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0];
}

// get the balance for a single token/account combo
export function useTokenBalance(
  account?: string,
  token?: Token
): TokenAmount | undefined {
  const tokenBalances = useTokenBalances(account, [token]);
  if (!token) return undefined;
  return tokenBalances[token.address];
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[]
): (CurrencyAmount | undefined)[] {
  const tokens = useMemo(
    () =>
      currencies?.filter(
        (currency): currency is Token => currency instanceof Token
      ) ?? [],
    [currencies]
  );

  const tokenBalances = useTokenBalances(account, tokens);
  const containsBNB: boolean = useMemo(
    () => currencies?.some((currency) => currency === ETHER) ?? false,
    [currencies]
  );
  const ethBalance = useBNBBalances(containsBNB ? [account] : []);

  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency) return undefined;
        if (currency instanceof Token) return tokenBalances[currency.address];
        if (currency === ETHER) return ethBalance[account];
        return undefined;
      }) ?? [],
    [account, currencies, ethBalance, tokenBalances]
  );
}

export function useCurrencyBalance(
  account?: string,
  currency?: Currency
): CurrencyAmount | undefined {
  return useCurrencyBalances(account, [currency])[0];
}

// mimics useAllBalances
export function useAllTokenBalances(): {
  [tokenAddress: string]: TokenAmount | undefined;
} {
  const { account } = useWeb3React();
  const allTokens = useAllTokens();
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [
    allTokens,
  ]);
  const balances = useTokenBalances(account ?? undefined, allTokensArray);
  return balances ?? {};
}

// mimics useAllBalances
export function useInvestTokenBalances(): { [key: string]: string } | {} {
  const { account } = useWeb3React();
  const allTokens = useProjectTokens();
  const balances = useProjectBalances(account, allTokens);
  return balances;
}
