// @ts-nocheck
import { formatEther } from 'ethers/lib/utils'
import React, { useEffect, useState } from 'react'
import { roundDecimalsString, truncate } from '../../_helpers/api'
import Marquee from 'react-fast-marquee'
import axios from 'axios'

interface PriceFeedProps {}

let timer
let interval

export const PriceFeed: React.FC<PriceFeedProps> = () => {
  const [prices, setPrices] = useState()
  const [bankTotal, setBankTotal] = useState()

  const requestPrice = async () => {
    let apiPrices: any = {},
      bank = {
        total: 0,
        balance: [{}],
      }
    await axios
      .get(
        `https://api.nomics.com/v1/currencies/ticker?key=${process.env.REACT_APP_NOMICS_API}&ids=BTC,BNB&interval=1h`,
      )
      .then(
        ({ data }) =>
          (apiPrices = data.reduce(
            (items, item) => ({
              ...items,
              [item.currency]: {
                token: item.currency,
                price: truncate(item.price, 2),
                isUp: Number(item['1h']?.price_change) > 0,
              },
            }),
            apiPrices,
          )),
      )
      .then(() =>
        axios.get(`https://api.pancakeswap.info/api/v2/tokens/0x88469567a9e6b2dae2d8ea7d8c77872d9a0d43ec`).then(
          ({ data }) =>
            (apiPrices = {
              ...apiPrices,
              STTS: {
                token: data.data.symbol,
                price: truncate(data.data.price, 2),
              },
            }),
        ),
      )
      .then(() =>
        axios
          .get(
            `https://api.bscscan.com/api?module=account&action=balance&address=0xbbe476b50d857bf41bbd1eb02f777cb9084c1564&tag=latest&apikey=${process.env.REACT_APP_BSCSCAN_API}`,
          )
          .then(({ data }) => {
            const balance = truncate(formatEther(data.result), 2)
            const price = Number(balance) * Number(apiPrices.BNB.price)
            bank.total = bank.total + price
            bank.balance = [
              ...bank.balance,
              {
                token: 'BNB',
                balance,
                price: truncate(price + '', 2),
              },
            ]
          }),
      )
      .then(() =>
        axios
          .get(
            `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&address=0xbbe476b50d857bf41bbd1eb02f777cb9084c1564&tag=latest&apikey=${process.env.REACT_APP_BSCSCAN_API}`,
          )
          .then(({ data }) => {
            const balance = truncate(formatEther(data.result), 2)
            const price = Number(balance) * Number(apiPrices.BTC.price)
            bank.total = bank.total + price
            bank.balance = [
              ...bank.balance,
              {
                token: 'BTC',
                balance,
                price: truncate(price + '', 2),
              },
            ]
          }),
      )
      .then(() =>
        axios
          .get(
            `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0x88469567a9e6b2dae2d8ea7d8c77872d9a0d43ec&address=0xbbe476b50d857bf41bbd1eb02f777cb9084c1564&tag=latest&apikey=${process.env.REACT_APP_BSCSCAN_API}`,
          )
          .then(({ data }) => {
            const balance = truncate(roundDecimalsString(data.result, 8), 2)
            const price = Number(balance) * Number(apiPrices.STTS.price)
            bank.total = truncate(bank.total + price + '', 2)
            bank.balance = [
              ...bank.balance,
              {
                token: 'STTS',
                balance,
                price: truncate(price + '', 2),
              },
            ]
            apiPrices = {
              ...apiPrices,
              STT: {
                token: 'STT',
                price: truncate(
                  (Number(apiPrices.BTC.price) / 10 ** 8) *
                    Math.floor(Number(bank.total) / Number(apiPrices.BTC.price)) +
                    '',
                  5,
                ),
              },
            }
          }),
      )

    setBankTotal(bank)
    setPrices(apiPrices)
    console.log(bank, apiPrices)
  }

  useEffect(() => {
    clearTimeout(timer)
    clearInterval(interval)
    timer = setTimeout(() => {
      requestPrice()
      interval = setInterval(() => {
        requestPrice()
      }, 60000)
    }, 1000)
    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [])

  return prices && bankTotal ? (
    <Marquee gradient={false}>
      <div style={{ display: 'inline-flex', padding: '0 10' }}>
        <p>
          Smart World Balance(BTC):
          <span className="price-value">
            {truncate(Number(bankTotal.total / prices.BTC.price) + '', 2)}
            BTC
          </span>
          Smart World Balance(Dollar):
          <span className="price-value">{bankTotal.total}$</span>
        </p>
        {Object.keys(prices)
          .reverse()
          .reduce(
            (items, item) => (
              <>
                {items}
                <p>
                  {item} :<span className="price-value">{prices[item].price}$</span>
                </p>
              </>
            ),
            [],
          )}
      </div>
    </Marquee>
  ) : null
}
