import Updater from 'state/invest/updater'
import { RouteProps } from 'react-router'
import useInvestStates from 'state/invest/hooks'

const MainInvestment: React.FC<RouteProps & { account: string }> = (props) => {
  const data = useInvestStates()
  const time = Date.now() / 1000

  return (
    <div>
      <Updater account={props.account} />
      {Object.keys(data).map((str, i) => {
        return (
          str !== 'maxPercent' &&
          str !== 'calculatePercent' && (
            <div key={i}>
              {str}
              <ul>
                {str === 'userDepositDetails'
                  ? Object.keys(data[str]).map((item, i) => {
                      return (
                        <li key={i}>
                          {item}:
                          {Object.keys(data[str][item]).map((k, l) => {
                            return (
                              <div key={l}>
                                {k === 'endTime' ? (
                                  <p>
                                    startTime: {(720 - (Number(data[str][item][k]) - 1036800 - time) / 86400).toFixed()}
                                  </p>
                                ) : (
                                  <p>reward: {Number(data[str][item][k].toString()) / 10 ** 8}</p>
                                )}
                              </div>
                            )
                          })}
                        </li>
                      )
                    })
                  : Object.keys(data[str]).map((e, i) => {
                      return (
                        <li key={i}>
                          {[e]}:{' '}
                          {e === 'requestTime' || e === 'latestWithdraw'
                            ? ((time - Number(data[str][e])) / 86400).toFixed()
                            : e === 'hourly'
                            ? Number(data[str][e]) / 10 ** 8
                            : e === 'referral'
                            ? Number(data[str][e]) / 10 ** 8
                            : e === 'stts'
                            ? Number(data[str][e]) / 10 ** 8
                            : e === 'refPercent'
                            ? data[str][e] / 250 + '%'
                            : data[str][e]}
                        </li>
                      )
                    })}
              </ul>
            </div>
          )
        )
      })}
    </div>
  )
}

export default MainInvestment
