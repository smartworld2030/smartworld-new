import { Elements } from 'components/Fiber'
import Fiber from 'components/Fiber/Fiber'
import useTheme from 'hooks/useTheme'
import { useWindowSize } from 'hooks/useWindowsSize'

const pexel = (id: number): string =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`

const elements1: Elements[] = [
  {
    name: 'ITEM0',
    rotation: [-3.141592653589793, -0.8975979081621641, -3.141592653589793],
    position: [3.9091575145721436, 0, 3.1174490451812744],
    element: (props, styles) => (
      <div {...props} style={{ background: 'white', color: 'black', ...styles }}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam doloribus dolores cupiditate culpa? Voluptatem
        cum aspernatur, quo nostrum, tempore ex, accusamus sit vel esse ipsa nemo error non corporis at.
      </div>
    ),
  },
  {
    name: 'ITEM1',
    rotation: [0, -1.3463968594046645, 0],
    position: [4.874639511108398, 0, -1.1126046180725098],
    element: (props, styles) => <img {...props} style={styles} src={pexel(325185)} />,
  },
  {
    name: 'ITEM2',
    rotation: [0, -0.4487989845410365, 0],
    position: [2.1694188117980957, 0, -4.5048441886901855],
    element: (props, styles) => <img {...props} style={styles} src={pexel(310452)} />,
  },
  {
    name: 'ITEM3',
    rotation: [0, 0.4487989845410365, 0],
    position: [-2.1694188117980957, 0, -4.5048441886901855],
    element: (props, styles) => <img {...props} style={styles} src={pexel(358574)} />,
  },
  {
    name: 'ITEM4',
    rotation: [0, 1.3463968594046645, 0],
    position: [-4.874639511108398, 0, -1.1126046180725098],
    element: (props, styles) => <img {...props} style={styles} src={pexel(327482)} />,
  },
  {
    name: 'ITEM5',
    rotation: [-3.141592653589793, 0.8975979081621641, -3.141592653589793],
    position: [-3.9091575145721436, 0, 3.1174490451812744],
    element: (props, styles) => <img {...props} style={styles} src={pexel(416430)} />,
  },
  {
    name: 'ITEM6',
    rotation: [0, -3.141592653589793, 0],
    position: [0, 0, 5],
    element: (props, styles) => <img {...props} style={styles} src={pexel(310452)} />,
  },
]

export default function Home() {
  const {
    theme: {
      colors: { background },
    },
  } = useTheme()
  const { width, height } = useWindowSize()
  console.log(height)
  return <Fiber elements={elements1} width={width} height={height} backgroundColor={background} />
}
