import Marquee from 'react-fast-marquee'
import { useBankDollars } from 'state/bank/hooks'
import { useBankBalances, useBankSatoshi } from 'state/bank/hooks'

interface ChainPriceFeedProps {}

type IProps = ChainPriceFeedProps

export const ChainPriceFeed: React.FC<IProps> = () => {
  const { btc: $btc } = useBankDollars()
  const prices = useBankSatoshi()
  const { stts, bnb, btc } = useBankBalances()
  const total = stts + bnb + btc

  const calcBTC = (value) => value / +$btc

  const calcBtcPrice = (value) => Math.round(calcBTC(value) * +$btc).toLocaleString('en')

  const calcDollar = (token) => ((prices[token] / 10 ** 8) * +$btc).toString()

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
            {prices.stt}
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
