import React from 'react'
import PropTypes from 'prop-types'
import { Chart, registerables } from 'chart.js'
import { Line } from 'react-chartjs-2'

Chart.register(...registerables)

export default function CardChartJS({ tokenId, title, subtitle, color, chart, dayProfit, children }) {
  const chartRef = React.useRef(null)

  React.useEffect(() => {
    chartRef.current.setDatasetVisibility(1, false)
    chartRef.current.setDatasetVisibility(2, false)
    chartRef.current.update()
  }, [chartRef])

  const cardColors = {
    white: 'bg-white',
    light: 'bg-blueGray-200',
    blueGray: 'bg-blueGray-800',
    red: 'bg-red-900',
    orange: 'bg-orange-900',
    amber: 'bg-amber-900',
    emerald: 'bg-emerald-900',
    teal: 'bg-teal-900',
    lightBlue: 'bg-lightBlue-900',
    indigo: 'bg-indigo-900',
    purple: 'bg-purple-900',
    pink: 'bg-pink-900',
  }
  const subtitleColors = {
    white: 'text-blueGray-500',
    light: 'text-blueGray-500',
    blueGray: 'text-blueGray-200',
    red: 'text-blueGray-200',
    orange: 'text-blueGray-200',
    amber: 'text-blueGray-200',
    emerald: 'text-blueGray-200',
    teal: 'text-blueGray-200',
    lightBlue: 'text-blueGray-200',
    indigo: 'text-blueGray-200',
    purple: 'text-blueGray-200',
    pink: 'text-blueGray-200',
  }
  const titleColors = {
    white: 'text-blueGray-800',
    light: 'text-blueGray-800',
    blueGray: 'text-white',
    red: 'text-white',
    orange: 'text-white',
    amber: 'text-white',
    emerald: 'text-white',
    teal: 'text-white',
    lightBlue: 'text-white',
    indigo: 'text-white',
    purple: 'text-white',
    pink: 'text-white',
  }

  return (
    <>
      <div
        className={'relative flex flex-col min-w-0 break-words w-full mb-8 shadow-lg rounded-lg ' + cardColors[color]}
      >
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full max-w-full flex-grow flex-1">
                <h6 className={'uppercase mb-1 text-xs font-semibold ' + subtitleColors[color]}>{subtitle}</h6>
                <h2 className={'text-xl font-semibold ' + titleColors[color]}>{title}</h2>
              </div>
            </div>
            <div className="flex flex-wrap items-center">
              <div className="relative w-full max-w-full flex-grow flex-1">
                <p className="flex flex-col text-right text-sm text-blueGray-500 mt-4">
                  <span className={`mr-2 ${dayProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    <i className={`fas ${dayProfit >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                    {dayProfit}%
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={'relative p-4 flex-auto'}>
          <div className={'w-full h-full bg-token-pic bg-' + tokenId} />
          <div className="relative h-350-px">
            <Line ref={chartRef} data={chart?.data} options={chart?.options} />
          </div>
        </div>
      </div>
    </>
  )
}

CardChartJS.defaultProps = {
  chart: {},
  color: 'white',
  children: null,
}

CardChartJS.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  color: PropTypes.oneOf([
    'white',
    'light',
    'blueGray',
    'red',
    'orange',
    'amber',
    'emerald',
    'teal',
    'lightBlue',
    'indigo',
    'purple',
    'pink',
  ]),
  // this is the chart config object
  // for more information, please check https://www.chartjs.org/?ref=creativetim
  chart: PropTypes.object,
  // this will appear at the bottom of the Table, for example,
  // you can use this to add a button that changes something inside the chart
  children: PropTypes.node,
}
