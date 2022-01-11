import { CurrencyAmount } from '@pancakeswap/sdk'
import { BalanceInput, ReverseFlex, MainComp, Skeleton } from '@smartworld-libs/uikit'
import { useFilteredProjectToken } from 'hooks/Tokens'
import { useState, useEffect } from 'react'
import { useBankDollars } from 'state/bank/hooks'
import { useLiquidityValue } from 'state/pool/hooks'
import { tryParseAmount } from 'state/swap/hooks'
import { useSmartTokenBalances } from 'state/wallet/hooks'
import TokenCircle from '../../Layout/PoolTokenCircle'
import DepositInfo from './DepositInfo'

export const neededToken = ['STTS', 'BNB', 'LPTOKEN']

export type ValueType = {
  [x: string]: CurrencyAmount | undefined
}

export const MainDepositSection = ({ toggle }) => {
  const dollar = useBankDollars()
  const balances = useSmartTokenBalances()
  const tokens = useFilteredProjectToken(neededToken)
  const lptoken = useLiquidityValue()

  const [pairs, setPairs] = useState('STTS-BNB')
  const [editingUnit, setEditingUnit] = useState<string | 'USD'>(pairs)

  const [inputs, setInputs] = useState(['', '', ''])

  const [values, setValues] = useState<ValueType>({
    ...balances,
  })

  const pairSpliter = () => pairs.split('-').map((token) => token)

  const token1 = pairSpliter()[0]
  const token2 = pairSpliter()[1]

  const conversionUnit = (token: string) => (editingUnit === token1 ? 'USD' : token)

  useEffect(() => {
    setEditingUnit(token1)
    setInputs(['', ''])
    setValues((prev) => ({ ...prev, [token1]: undefined }))
    return () => {
      setValues((prev) => ({ ...prev, [token1]: undefined }))
    }
  }, [token1])

  const currencyValues = (token: string) => {
    const element = conversionUnit(token) === 'USD' ? 'USD' : token

    return (
      '~' +
      (element === 'USD'
        ? parseFloat(inputs[0] || '0').toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : values[element]?.toSignificant(4))
    )
  }

  const handleInputChange = (input: string, token: string) => {
    const inputAsFloat = parseFloat(input)
    if (editingUnit !== 'USD') {
      if (token === 'LPTOKEN') {
        const stts = +lptoken.stts * (+input / 10 ** 8)
        setValues((prev) => ({
          ...prev,
          [token]: tryParseAmount(input, tokens[editingUnit]),
        }))
        setInputs([`${stts * 2}`, input])
      } else {
        const USD = Number.isNaN(input) ? '0' : `${+input * dollar[token]}`
        const value1 = `${+USD / dollar[token1]}`
        const value2 = `${+USD / dollar[token2]}`
        setValues((prev) => ({
          ...prev,
          [token]: tryParseAmount(input, tokens[editingUnit]),
        }))
        setInputs([`${inputAsFloat * dollar[token]}`, value1, value2])
      }
    } else {
      const value1 = `${+inputAsFloat / dollar[token1]}`
      const value2 = `${+inputAsFloat / dollar[token2]}`
      setValues((prev) => ({
        ...prev,
        [token1]: tryParseAmount(value1, tokens[token]),
        [token2]: tryParseAmount(value2, tokens[token]),
      }))
      setInputs([input, value1, value2])
    }
  }

  const switchEditingUnits = () => {
    setValues((prev) => ({ ...prev, [token1]: values[token1] }))
    setEditingUnit(conversionUnit(token1))
  }

  const totalValue = (token) => {
    const input = tokens?.[token]
    if (editingUnit !== 'USD') {
      return input
    } else {
      return Number.isNaN(input) ? '0' : `${input[0] * dollar[token]}`
    }
  }

  const getUnit = (token) => {
    if (editingUnit === 'USD') {
      return editingUnit
    } else {
      return token
    }
  }

  const balanceValues = (t: string) => {
    const inputAsFloat = balances?.[t]?.toSignificant()
    if (editingUnit !== 'USD') {
      return balances?.[t]?.toSignificant()
    } else {
      return Number.isNaN(inputAsFloat) ? '0' : `${inputAsFloat * dollar[t]}`
    }
  }

  return (
    <ReverseFlex>
      <MainComp
        tip="Token Selection"
        flex={toggle ? 7 : 4}
        flexDirection="row"
        justifyContent="space-around"
        alignItems="center"
        demo={[0, 1, 2].map((i) => (
          <Skeleton key={i} shape="circle" scale="lg" />
        ))}
      >
        <TokenCircle width={70} onClick={setPairs} token="STTS-BNB" active={pairs === 'STTS-BNB'} />
        <TokenCircle width={70} onClick={setPairs} token="LPTOKEN" active={pairs === 'LPTOKEN'} />
      </MainComp>
      <MainComp
        tip="Balance Input"
        flex={toggle ? 12 : 7}
        flexDirection="row"
        justifyContent="space-around"
        alignItems="center"
        demo={<Skeleton size={200} />}
      >
        {pairSpliter().map((token, i, all) => (
          <BalanceInput
            key={i}
            value={editingUnit === 'USD' ? inputs[0] : inputs[1 + i]}
            maxValue={balanceValues(token)}
            onUserInput={(input) => handleInputChange(input, token)}
            unit={getUnit(token)}
            decimals={token === 'STTS' ? 8 : 18}
            currencyValue={currencyValues(token)}
            currencyUnit={conversionUnit(token)}
            placeholder={balanceValues(token)}
            size={all.length > 1 ? 160 : 200}
            progressColor={balanceValues(token) === '0' ? 'transparent' : undefined}
            disabled={balanceValues(token) === '0'}
            switchEditingUnits={switchEditingUnits}
          />
        ))}
      </MainComp>
      <MainComp
        tip="Long Press Button"
        flex={toggle ? 8 : 5}
        justifyContent="space-around"
        alignItems="center"
        tipSize={3}
        demo={<Skeleton size={80} />}
      >
        <DepositInfo token={tokens[token1]} values={values} price={inputs[0]} />
      </MainComp>
    </ReverseFlex>
  )
}

export default MainDepositSection
