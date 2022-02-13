// @ts-nocheck
import { useEffect, useMemo, useState } from 'react'
import { startCase } from 'lodash'

interface DataChart {
  state: number[]
}

const useDataChart = () => {
  const [data, setData] = useState<DataChart>({ state: [] })

  useEffect(() => {
    fetch('https://www.coingecko.com/market_cap/total_charts_data?duration=7&locale=en&vs_currency=usd')
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        setData(result)
      })
      .catch((err) => {})
    return () => {}
  }, [])

  const options = useMemo(
    () =>
      ({
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      } as const),
    [],
  )

  function percentage(partialValue: number, totalValue: number) {
    return ((100 * partialValue) / totalValue - 100).toFixed(2)
  }
  const textProps = useMemo(
    () => ({
      title: 'Total Chart',
      subtitle: 'Last Month',
      color: 'blueGray',
      dayProfit: percentage(data?.state?.[data?.state?.length - 1]?.[1], data?.state?.[data?.state?.length - 2]?.[1]),
      chart: {
        data: {
          labels: data?.state?.map(([i]) => new Date(i).toLocaleString('en-US', options)),
          datasets: [
            {
              label: 'Total MarketCap',
              backgroundColor: '#4c51bf',
              borderColor: '#4c51bf',
              data: data?.state?.map(([_, i]) => i.toFixed(15)),
              fill: false,
              tension: 0.4,
            },
          ],
        },

        options: {
          maintainAspectRatio: false,
          responsive: true,
          interaction: {
            intersect: false,
            mode: 'index',
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || ''

                  if (label) {
                    label += ': '
                  }
                  if (context.raw !== null) {
                    label +=
                      context.raw > 0.1
                        ? new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(context.raw)
                        : '$' + context.raw
                  }
                  return label
                },
              },
            },
            legend: {
              labels: {
                color: '#FFF',
              },
              align: 'end',
              position: 'bottom',
            },
            tooltips: {
              position: 'average',
            },
          },
          scales: {
            x: {
              display: true,
              ticks: {
                color: 'rgba(255,255,255)',
              },
              grid: {
                display: false,
              },
            },
            y: {
              display: true,
              ticks: {
                color: 'rgba(255,255,255)',
                callback: function (value) {
                  // for a value (tick) equals to 8
                  return value > 0.1 ? value.toFixed(3) : value.toFixed(10)
                  // 'junior-dev' will be returned instead and displayed on your chart
                },
              },
              grid: {
                drawBorder: false,
                borderWidth: 2,
                borderDash: [3],
                borderDashOffset: [3],
                color: 'rgba(255, 255, 255, 0.15)',
              },
            },
          },
        },
      },
    }),
    [data?.market_caps, data?.state, data?.total_volumes, options],
  )
  return textProps
}
export default useDataChart
