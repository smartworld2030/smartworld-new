import { BalanceInput, ReverseFlex, MainComp, Skeleton, useWindowSize } from '@smartworld-libs/uikit'
import { useState, useEffect } from 'react'
import { useBankDollars, useBankSatoshi } from 'state/bank/hooks'
import { useInvestTokenBalances } from 'state/wallet/hooks'
import TokenCircle from '../../Layout/TokenCircle'
import DepositInfo from './DepositInfo'

export const tokenNames = ['STTS', 'BNB', 'BTC']

export const MainDepositSection = ({ toggle }) => {
  const dollar = useBankDollars()
  const prices = useBankSatoshi()
  const tokens = useInvestTokenBalances()

  const [token, setToken] = useState('STTS')
  const [editingUnit, setEditingUnit] = useState<string | 'USD'>(token)
  const [values, setValues] = useState({
    [token]: tokens[token] ? tokens[token] : '',
    USD: `${tokens[token] * dollar[token]}`,
  })

  const conversionUnit = editingUnit === token ? 'USD' : token

  useEffect(() => {
    setEditingUnit(token)
    setValues({
      [token]: '',
      USD: '',
    })
    return () => {
      setValues({
        [token]: '',
        USD: '',
      })
    }
  }, [token])

  const minimumAmount = (t: string) => (500000 / Number(prices[t.toLowerCase()])).toFixed(t === 'STTS' ? 0 : 3)

  const currencyValues = !Number.isNaN(parseFloat(values[conversionUnit]))
    ? '~' +
      parseFloat(values[conversionUnit]).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '0.00'

  const handleInputChange = (input: string) => {
    const inputAsFloat = parseFloat(input)
    if (editingUnit !== 'USD') {
      setValues({
        [token]: input,
        USD: Number.isNaN(inputAsFloat) ? '' : `${inputAsFloat * dollar[token.toLowerCase()]}`,
      })
    } else {
      setValues({
        [token]: Number.isNaN(inputAsFloat) ? '' : `${inputAsFloat / dollar[token.toLowerCase()]}`,
        USD: input,
      })
    }
  }

  const switchEditingUnits = () => {
    const editingUnitAfterChange = editingUnit === token ? 'USD' : token
    // This is needed to persist same value as shown for currencyValue after switching
    // otherwise user will see lots of decimals
    const valuesAfterChange = { ...values }
    valuesAfterChange[editingUnitAfterChange] = !Number.isNaN(parseFloat(values[conversionUnit]))
      ? parseFloat(values[conversionUnit]).toFixed(2)
      : ''
    setValues(valuesAfterChange)
    setEditingUnit(editingUnitAfterChange)
  }

  const balanceValues = () => {
    const inputAsFloat = parseFloat(tokens?.[token])
    if (editingUnit !== 'USD') {
      return tokens?.[token]
    } else {
      return Number.isNaN(inputAsFloat) ? '0' : `${inputAsFloat * dollar[token.toLowerCase()]}`
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
        {tokenNames.map((t) => (
          <TokenCircle key={t} width={70} onClick={setToken} token={t} active={token === t} info={minimumAmount(t)} />
        ))}
      </MainComp>
      <MainComp
        tip="Balance Input"
        flex={toggle ? 12 : 7}
        flexDirection="row"
        justifyContent="space-around"
        alignItems="center"
        demo={<Skeleton size={200} />}
      >
        <BalanceInput
          value={values[editingUnit]}
          maxValue={balanceValues()}
          onUserInput={handleInputChange}
          unit={editingUnit}
          currencyValue={currencyValues}
          currencyUnit={conversionUnit}
          placeholder={balanceValues()}
          size={200}
          progressColor={balanceValues() === '0' ? 'transparent' : undefined}
          disabled={balanceValues() === '0'}
          switchEditingUnits={switchEditingUnits}
        />
      </MainComp>
      <MainComp
        tip="Long Press Button"
        flex={toggle ? 8 : 5}
        justifyContent="space-around"
        alignItems="center"
        tipSize={3}
        demo={<Skeleton size={80} />}
      >
        <DepositInfo token={token} value={Number(values[token] ?? 0)} prices={prices} />
      </MainComp>
    </ReverseFlex>
  )
}

export default MainDepositSection
