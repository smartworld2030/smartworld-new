import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import ReferralButton from '../../Layout/ReferralButton'
import copy from 'copy-to-clipboard'
import QRCode from 'react-qr-code'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useUserInvestDetails } from 'state/invest/hooks'
import useToast from 'hooks/useToast'
import useTheme from 'hooks/useTheme'
import { MainComp, MainFlex, Skeleton, useWindowSize } from '@smartworld-libs/uikit'

export const MainDetailSection = () => {
  const { flexSize, isMobile, isTablet } = useWindowSize()
  const { account } = useActiveWeb3React()
  const {
    userBalances: { satoshi },
  } = useUserInvestDetails()

  const {
    theme: { colors },
  } = useTheme()

  const { toastSuccess } = useToast()
  const [done, setDone] = useState(false)
  const { pathname } = useLocation()
  const link = `${window.location.origin}${pathname}?ref=${account}`

  const copyHandler = () => {
    if (!done) {
      copy(link)
      toastSuccess('Reffral Link Copied!')
      setDone(true)
    }
  }

  return (
    <MainFlex {...{ flex: 3, md: 6, sm: 4, xs: 4 }}>
      <MainComp
        tip="Long Press Button"
        flex={12}
        justifyContent="space-around"
        alignItems="center"
        tipSize={3}
        demo={<Skeleton size={80} />}
      >
        {done ? (
          <QRCode
            size={isMobile ? flexSize * 4 : isTablet ? flexSize * 3 : flexSize * 2}
            value={link}
            bgColor={colors.background}
            fgColor="white"
            onClick={() => setDone(false)}
            style={{ position: 'relative' }}
          />
        ) : (
          <ReferralButton width={90} onClick={copyHandler} disable={satoshi === '0'} />
        )}
      </MainComp>
    </MainFlex>
  )
}

export default MainDetailSection
