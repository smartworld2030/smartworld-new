import { CurrencyAmount } from '@pancakeswap/sdk'
import { BalanceInput, ReverseFlex, MainComponent, Skeleton } from '@smartworld-libs/uikit'
import { useFilteredProjectToken } from 'hooks/Tokens'
import { useState, useEffect } from 'react'
import { useBankDollars } from 'state/bank/hooks'
import { useLiquidityValue } from 'state/pool/hooks'
import { tryParseAmount } from 'state/swap/hooks'
import { useUserSmartTokenBalances } from 'state/wallet/hooks'
import TokenCircle from '../../Layout/PoolTokenCircle'
import DepositInfo from './DepositInfo'

export const neededToken = ['STTS', 'BNB', 'LPTOKEN']

export enum TokenIndex {
  STTS = 1,
  LPTOKEN = 1,
  BNB = 2,
}

export type ValueType = {
  [x: string]: CurrencyAmount | undefined
}

export const MainDepositSection = ({ toggle }) => {
  const dollar = useBankDollars()
  const { loading, balances } = useUserSmartTokenBalances()
  const tokens = useFilteredProjectToken(neededToken)
  const lptoken = useLiquidityValue()

  const [pairs, setPairs] = useState('STTS-BNB')
  const [editingUnit, setEditingUnit] = useState<string | 'USD'>(pairs)

  const [inputs, setInputs] = useState(['', '', ''])

  const [values, setValues] = useState<ValueType>({
    ...balances,
  })

  const pairSpliter = () => pairs.split('-')

  const token1 = pairSpliter()[0]
  const token2 = pairSpliter()[1]

  const conversionUnit = (token: string) => {
    return editingUnit === token1 ? 'USD' : token
  }

  useEffect(() => {
    setEditingUnit(token1)
    setInputs(['', '', ''])
    setValues((prev) => ({ ...prev, [token1]: undefined }))
    return () => {
      setValues((prev) => ({ ...prev, [token1]: undefined }))
    }
  }, [token1])

  const currencyValues = (token: string) => {
    let element = conversionUnit(token) === 'USD' ? 'USD' : token
    return (
      '~' +
      (element === 'USD'
        ? parseFloat(inputs[0] || '0').toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : values[token]?.toSignificant() || '0')
    )
  }

  const handleInputChange = (input: string, token: string) => {
    const inputAsFloat = parseFloat(input)
    if (editingUnit !== 'USD') {
      if (token === 'LPTOKEN') {
        const stts = +lptoken.stts * (inputAsFloat / 10 ** 8)
        const USD = (stts * dollar[token1]).toFixed(2)

        setValues({ [token]: tryParseAmount(input, tokens[token]) })
        setInputs([USD, input])
      } else {
        const USD = Number.isNaN(input) ? '0' : `${+input * dollar[token]}`
        const v1 = `${+USD / dollar[token1]}`
        const v2 = `${+USD / dollar[token2]}`
        const value1 = tryParseAmount(v1, tokens[token1])
        const value2 = tryParseAmount(v2, tokens[token2])
        setValues((prev) => ({
          ...prev,
          [token1]: value1,
          [token2]: value2,
        }))
        if (TokenIndex[token] === 1) return setInputs([USD, input, value2?.toSignificant()])
        return setInputs([USD, value1?.toSignificant(), input])
      }
    } else {
      if (token === 'LPTOKEN') {
        const stts = inputAsFloat / dollar[token1]
        const value = ((stts * 10 ** 8) / +lptoken.stts).toString()
        setValues({ [token]: tryParseAmount(value, tokens[token]) })
        setInputs([input, value])
      } else {
        const value1 = `${inputAsFloat / dollar[token1]}`
        const value2 = `${inputAsFloat / dollar[token2]}`
        setValues((prev) => ({
          ...prev,
          [token1]: tryParseAmount(value1, tokens[token1]),
          [token2]: tryParseAmount(value2, tokens[token2]),
        }))
        setInputs([input, value1, value2])
      }
    }
  }

  const switchEditingUnits = () => {
    setEditingUnit(conversionUnit(token1))
  }

  const getUnit = (token) => {
    if (editingUnit === 'USD') {
      return editingUnit
    } else {
      return token
    }
  }

  const balanceValues = (token: string): string => {
    const inputAsFloat = balances?.[token]?.toSignificant()
    if (editingUnit !== 'USD') {
      return balances?.[token]?.toSignificant()
    } else {
      if (token === 'LPTOKEN') {
        const stts = +lptoken.stts * (Number(inputAsFloat) / 10 ** 8)
        const usd = stts * dollar[token1]
        return Number.isNaN(usd) ? '0' : `${usd}`
      }
      return Number.isNaN(inputAsFloat) ? '0' : `${Number(inputAsFloat) * dollar[token]}`
    }
  }
  console.log(pairs)
  return (
    <ReverseFlex>
      <MainComponent
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
      </MainComponent>
      <MainComponent
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
            loading={loading}
            value={editingUnit === 'USD' ? inputs[0] : inputs[1 + i]}
            maxValue={balanceValues(token)}
            decimals={editingUnit === 'USD' ? 2 : tokens[token].decimals}
            onUserInput={(input) => handleInputChange(input, token)}
            unit={getUnit(token)}
            currencyValue={currencyValues(token)}
            currencyUnit={conversionUnit(token)}
            placeholder={balanceValues(token)}
            size={all.length > 1 ? 160 : 200}
            progressColor={balanceValues(token) === '0' ? 'transparent' : undefined}
            disabled={balanceValues(token) === '0'}
            switchEditingUnits={switchEditingUnits}
          />
        ))}
      </MainComponent>
      <MainComponent
        tip="Long Press Button"
        flex={toggle ? 8 : 5}
        justifyContent="space-around"
        alignItems="center"
        tipSize={3}
        demo={<Skeleton size={80} />}
      >
        <DepositInfo token={tokens[token1]} values={values} price={inputs[0]} error="" />
      </MainComponent>
    </ReverseFlex>
  )
}

export default MainDepositSection
