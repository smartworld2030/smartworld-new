import { MenuEntry } from '@smartworld-libs/uikit'
import { ContextApi } from 'contexts/Localization/types'

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: t('Home'),
    icon: 'HomeIcon',
    path: ['/'],
  },
  {
    label: t('Trade'),
    icon: 'TradeIcon',
    path: ['/swap'],
  },
  {
    label: t('Pools'),
    icon: 'PoolIcon',
    path: ['/pools'],
  },
  {
    label: t('Info'),
    icon: 'InfoIcon',
    path: ['https://pancakeswap.info'],
  },
]

export default config
