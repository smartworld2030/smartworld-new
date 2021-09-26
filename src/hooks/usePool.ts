import { useMemo } from "react";
import { useSingleCallMultipleMethod } from "../state/multicall/hooks";
import info from "utils/contracts/info";
import { usePoolContract } from "./useContract";

export function usePool() {
  const methods = useMemo(() => ["freezePrice"], []);
  const poolContract = usePoolContract();
  const args = [[], [info.addressZero, 0]];

  const results = useSingleCallMultipleMethod(poolContract, methods, args);

  return useMemo(() => {
    return results.reduce(
      (items, { result }, i) =>
        result && {
          ...items,
          [methods[i]]: Object.keys(result).reduce(
            (res, key) =>
              key.length > 1 && { ...res, [key]: result[key].toString() },
            {}
          ),
        },
      {}
    );
  }, [results, methods]);
}

export function useUserPool(account: string) {
  const poolContract = usePoolContract();
  const methods = useMemo(
    () => [
      "calculateInterest",
      "users",
      "userExpired",
      "userExpireTime",
      "userFreezeInfo",
      "userUnfreezeInfo",
      "calculateDaily",
    ],
    []
  );
  const args = [
    [account],
    [account],
    [account],
    [account],
    [account, 0],
    [account, 0],
    [account, Math.floor(Date.now() / 1000) + 86400],
  ];

  const results = useSingleCallMultipleMethod(poolContract, methods, args);

  return useMemo(() => {
    return results.reduce(
      (items, { result }, i) =>
        result && {
          ...items,
          [methods[i]]: Object.keys(result).reduce(
            (res, key) =>
              key.length > 1 && { ...res, [key]: result[key].toString() },
            {}
          ),
        },
      {}
    );
  }, [results, methods]);
}
