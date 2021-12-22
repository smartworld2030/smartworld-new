import { InvestLogo } from './InvestLogo'
import { SwapLogo } from './SwapLogo'
import { SttLogo } from './SttLogo'

export const sizeCalculator = (width: number) => {
  const half = width / 2
  let quarter = half / 2
  let eighth = quarter / 2
  const height = 170
  let fristHeight = height - 120
  let secondHeight = height - 85
  let querylimiter = true
  if (width < 600) {
    quarter = half / 1.2
    eighth = quarter / 1.6
    fristHeight = height - 70
    secondHeight = height - 55
    querylimiter = false
  }
  const linkArray = [
    {
      positionX: half - quarter,
      positionY: fristHeight,
      size: 'md',
      link: '/info',
      text: 'Info',
      textPos: fristHeight - 69,
      number: 0,
      icon: (w) => <div></div>,
    },
    {
      positionX: half - eighth - 30,
      positionY: secondHeight - 70,
      size: 'lg',
      link: '/pool',
      text: '',
      textPos: secondHeight - 55,
      number: 2,
      icon: (w) => <SttLogo width={w} />,
    },
    {
      positionX: half - 46,
      positionY: -42,
      size: 'ml',
      link: '/invest',
      text: '',
      textPos: 35,
      number: 1,
      icon: (w) => <InvestLogo width={w} />,
    },
    {
      positionX: half + eighth - 36,
      positionY: secondHeight - 70,
      size: 'lg',
      link: '/swap',
      text: '',
      textPos: secondHeight - 55,
      number: 2,
      icon: (w) => <SwapLogo width={w} />,
    },
    {
      positionX: half + quarter - 50,
      positionY: fristHeight,
      size: 'md',
      link: '/stb',
      text: 'STB',
      number: 0,
      textPos: fristHeight - 69,
      icon: (w) => <div></div>,
    },
  ]
  return { half, quarter, linkArray, eighth, height, querylimiter }
}
