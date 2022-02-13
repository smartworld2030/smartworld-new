import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import ReferralButton from '../../Layout/ReferralButton'
import copy from 'copy-to-clipboard'
import QRCode from 'react-qr-code'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useUserPoolInfo } from 'state/pool/hooks'
import useToast from 'hooks/useToast'
import useTheme from 'hooks/useTheme'
import { ReverseFlex, MainComp, Skeleton } from '@smartworld-libs/uikit'

export const MainDetailSection = ({ toggle }) => {
  const { account } = useActiveWeb3React()
  const { liquidity } = useUserPoolInfo()

  const {
    theme: { colors },
  } = useTheme()

  const [percent, setPercent] = useState(100)
  const { toastSuccess } = useToast()
  const [done, setDone] = useState(false)
  const { pathname } = useLocation()
  const link = `${window.location.origin}${pathname}?percent=${percent}&ref=${account}`

  const copyHandler = () => {
    if (!done) {
      copy(link)
      toastSuccess('Reffral Link Copied!')
      setDone(true)
    }
  }

  return (
    <ReverseFlex>
      <MainComp
        tip="Long Press Button"
        flex={done ? (toggle ? 8 : 6) : 5.5}
        justifyContent="space-around"
        alignItems="center"
        tipSize={2}
        demo={<Skeleton size={80} />}
      >
        {done ? (
          <QRCode
            size={200}
            value={link}
            bgColor={colors.background}
            fgColor={colors.text}
            onClick={() => setDone(false)}
            style={{ position: 'relative' }}
          />
        ) : (
          <ReferralButton width={90} onClick={copyHandler} setPercent={setPercent} disable={liquidity === '0'} slider />
        )}
      </MainComp>
    </ReverseFlex>
  )
}

export default MainDetailSection
