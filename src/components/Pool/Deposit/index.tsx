import { BalanceInput, MainFlex, MainComp, Skeleton } from '@smartworld-libs/uikit'
import { useState, useEffect } from 'react'
import { useBankDollars, useBankSatoshi } from 'state/bank/hooks'
import { useInvestTokenBalances } from 'state/wallet/hooks'
import TokenCircle from '../../Layout/TokenCircle'
import DepositInfo from './DepositInfo'

export const tokenNames = ['STTS', 'BNB', 'BTC']

export const MainDepositSection = ({ isMobile, isTablet, flex }) => {
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
    <MainFlex {...{ flex: 6, md: 12, sm: 12, xs: 12 }}>
      <MainComp
        tip="Token Selection"
        flex={3}
        flexDirection={isMobile ? 'row' : 'column'}
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
        flex={6}
        flexDirection={isMobile ? 'row' : 'column'}
        justifyContent="space-around"
        alignItems="center"
        tipSize={3}
        demo={<Skeleton size={isMobile ? flex * 3.5 : isTablet ? flex * 2.5 : flex * 2} />}
      >
        <BalanceInput
          value={values[editingUnit]}
          maxValue={balanceValues()}
          onUserInput={handleInputChange}
          unit={editingUnit}
          currencyValue={currencyValues}
          currencyUnit={conversionUnit}
          placeholder={balanceValues()}
          size={isMobile ? flex * 4 : isTablet ? flex * 3 : flex * 2}
          borderColor="transparent"
          progressColor={balanceValues() === '0' ? 'transparent' : undefined}
          borderSize={2}
          knobSize={12}
          disabled={balanceValues() === '0'}
          switchEditingUnits={switchEditingUnits}
        />
      </MainComp>
      <MainComp
        tip="Long Press Button"
        flex={6}
        justifyContent="space-around"
        alignItems="center"
        tipSize={3}
        demo={<Skeleton size={80} />}
      >
        <DepositInfo token={token} value={Number(values[token] ?? 0)} prices={prices} />
      </MainComp>
    </MainFlex>
  )
}

export default MainDepositSection
