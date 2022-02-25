import { CurrencyAmount } from '@pancakeswap/sdk'
import { BalanceInput, ReverseFlex, MainComponent, Skeleton } from '@smartworld-libs/uikit'
import { useFilteredProjectToken } from 'hooks/Tokens'
import { useState, useEffect } from 'react'
import { useBankDollars } from 'state/bank/hooks'
import { tryParseAmount } from 'state/swap/hooks'
import { useSmartTokenBalances } from 'state/wallet/hooks'
import TokenCircle from '../../Layout/InvestTokenCircle'
import DepositInfo from './DepositInfo'

export const neededToken = ['STTS', 'BNB', 'BTC']

type ValueType = {
  [x: string]: CurrencyAmount | undefined
}

export const MainDepositSection = ({ toggle }) => {
  const dollar = useBankDollars()
  const balances = useSmartTokenBalances()
  const tokens = useFilteredProjectToken(neededToken)

  const [token, setToken] = useState<string>('STTS')
  const [editingUnit, setEditingUnit] = useState<string | 'USD'>(token)

  const [inputs, setInputs] = useState(['', ''])

  const [values, setValues] = useState<ValueType>({
    ...balances,
  })

  const conversionUnit = editingUnit === token ? 'USD' : token

  useEffect(() => {
    setEditingUnit(token)
    setInputs(['', ''])
    setValues((prev) => ({ ...prev, [token]: undefined }))
    return () => {
      setValues((prev) => ({ ...prev, [token]: undefined }))
    }
  }, [token])

  const minimumAmount = (t: string) => {
    return (100 / dollar[t]).toFixed(t === 'STTS' ? 1 : 4)
  }

  const currencyValues =
    '~' +
    (conversionUnit === 'USD'
      ? parseFloat(inputs[0] || '0').toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : values[conversionUnit]?.toSignificant(4))

  const handleInputChange = (input: string) => {
    const inputAsFloat = parseFloat(input)
    if (editingUnit !== 'USD') {
      setValues((prev) => ({
        ...prev,
        [token]: tryParseAmount(input, tokens[editingUnit]),
      }))
      setInputs([`${inputAsFloat * dollar[token]}`, input])
    } else {
      setValues((prev) => ({
        ...prev,
        [token]: tryParseAmount((inputAsFloat / +dollar[token]).toString(), tokens[token]),
      }))
      setInputs([input, `${inputAsFloat / dollar[token]}`])
    }
  }

  const switchEditingUnits = () => {
    setValues((prev) => ({ ...prev, [token]: values[token] }))
    setEditingUnit(conversionUnit)
  }

  const balanceValues = () => {
    const inputAsFloat = balances?.[token]?.toSignificant()

    if (editingUnit !== 'USD') {
      return balances?.[token]?.toSignificant()
    } else {
      return Number.isNaN(inputAsFloat) ? '0' : `${inputAsFloat * dollar[token]}`
    }
  }

  return (
    <ReverseFlex>
      <MainComponent
        tip="Token Selection"
        tipSize={2}
        flex={toggle ? 6 : 4}
        flexDirection="row"
        justifyContent="space-around"
        alignItems="center"
        demo={[0, 1, 2].map((i) => (
          <Skeleton key={i} shape="circle" scale="lg" />
        ))}
      >
        {Object.keys(tokens).map((t) => (
          <TokenCircle
            key={t}
            width={90}
            onClick={setToken}
            token={tokens[t]}
            active={token === t}
            info={minimumAmount(t)}
          />
        ))}
      </MainComponent>
      <MainComponent
        tip="Balance Input"
        flex={toggle ? 12 : 9}
        tipSize={3}
        flexDirection="row"
        justifyContent="space-around"
        alignItems="center"
        demo={<Skeleton size={200} />}
      >
        <BalanceInput
          value={editingUnit === 'USD' ? inputs[0] : inputs[1]}
          maxValue={balanceValues()}
          onUserInput={handleInputChange}
          unit={editingUnit}
          currencyValue={currencyValues}
          currencyUnit={conversionUnit}
          placeholder={balanceValues()}
          size={250}
          progressColor={balanceValues() === '0' ? 'transparent' : undefined}
          disabled={balanceValues() === '0'}
          switchEditingUnits={switchEditingUnits}
        />
      </MainComponent>
      <MainComponent
        tip="Long Press Button"
        flex={toggle ? 8 : 5}
        justifyContent="space-around"
        alignItems="center"
        tipSize={3}
        demo={<Skeleton size={80} />}
      >
        <DepositInfo token={tokens[token]} value={values[token]} price={inputs[0]} />
      </MainComponent>
    </ReverseFlex>
  )
}

export default MainDepositSection
