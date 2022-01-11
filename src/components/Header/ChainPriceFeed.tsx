import Marquee from 'react-fast-marquee'
import { useBankDollars } from 'state/bank/hooks'
import { useBankBalances, useBankSatoshi } from 'state/bank/hooks'

interface ChainPriceFeedProps {}

type IProps = ChainPriceFeedProps

export const ChainPriceFeed: React.FC<IProps> = () => {
  const { BTC: $BTC } = useBankDollars()
  const prices = useBankSatoshi()
  const { STTS, BNB, BTC } = useBankBalances()
  const total = STTS + BNB + BTC

  const calcBTC = (value) => value / +$BTC

  const calcBtcPrice = (value) => Math.round(calcBTC(value) * +$BTC).toLocaleString('en')

  const calcDollar = (token) => ((prices[token] / 10 ** 8) * +$BTC).toString()

  return prices && total ? (
    <Marquee gradient={false}>
      <div style={{ display: 'inline-flex', padding: '0 10', fontSize: 13 }}>
        <div>
          Smart World Balance(BTC):
          <p className="price-value">
            {calcBTC(total).toString()}
            <span> BTC</span>
          </p>
          Smart World Balance(Dollar):
          <p className="price-value">
            {calcBtcPrice(total)}
            <span>$</span>
          </p>
          STT:
          <p className="price-value">
            {prices.STT}
            <span>SATS</span>
          </p>
          STTS:
          <p className="price-value">
            {calcDollar('STTS')}
            <span>$</span>
          </p>
          BTC:
          <p className="price-value">
            {calcBtcPrice(100000000)}
            <span>$</span>
          </p>
          BNB:
          <p className="price-value">
            {calcDollar('BNB')}
            <span>$</span>
          </p>
          Minimum Investment:
          <p className="price-value">
            {calcBtcPrice(500000)}
            <span>$</span>
          </p>
        </div>
      </div>
    </Marquee>
  ) : null
}

export default ChainPriceFeed
