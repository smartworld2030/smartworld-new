import React, { useState } from 'react'
import { usePollBlockNumber } from 'state/block/hooks'
import useEagerConnect from 'hooks/useEagerConnect'
import GlobalStyle from 'style/Global'
import MainInvestment from 'components/Invest'
import { useERC20 } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import holders from '../holderaccounts'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Flex } from '@smartworld-libs/uikit'

interface IProps {
  isMobile: boolean
  height: number
  width: number
}

type AppRouterProps = IProps

export const AppRouter: React.FC<AppRouterProps> = ({ width }) => {
  usePollBlockNumber()
  useEagerConnect()
  const { account } = useActiveWeb3React()

  const STTS = useERC20('0x88469567A9e6b2daE2d8ea7D8C77872d9A0d43EC')
  const [address, setAccount] = useState('0x2dcfccc54e8bf3bb6117ceae53cc2595488e89d3')
  const [inputData, setInputData] = useState('')
  const [value, setValue] = useState(0)
  const [check, setCheck] = useState({})

  const sendStts = () => STTS.functions.transfer(address, value * 10 ** 8)

  return account ? (
    <Flex width="100%" height="100%" flexDirection="column">
      <GlobalStyle />
      <Flex width="100%" height="25px">
        <input
          type="text"
          style={{ width: '70%' }}
          onInput={(d) => setInputData(d.currentTarget.value)}
          defaultValue={inputData}
        />
        <button onClick={() => setAccount(inputData)}>Search</button>
        <input
          type="number"
          style={{ width: '30%' }}
          onInput={(d) => setValue(d.currentTarget.valueAsNumber)}
          defaultValue={value.toString()}
        />
        <button onClick={sendStts}>Send</button>
      </Flex>
      <Flex>
        <Flex width="50%" height="93vh" overflowY="scroll" flexDirection="column">
          <MainInvestment exact strict path={['/investment', '/invest']} account={address} />
        </Flex>
        <Flex width="50%" height="93vh" overflowY="scroll" flexDirection="column" borderLeft="2px solid white">
          {holders.map((h, i) => (
            <Flex alignItems="baseline" key={i}>
              {i}-
              <input
                type="checkbox"
                value={check[i]}
                onClick={() => setCheck((prev) => ({ ...prev, [i]: !prev[i] }))}
              />{' '}
              <p
                onClick={() => {
                  setAccount(h)
                  setInputData(h)
                }}
                style={{ cursor: 'pointer' }}
              >
                {h}
              </p>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Flex>
  ) : (
    <ConnectWalletButton />
  )
}

export default AppRouter
