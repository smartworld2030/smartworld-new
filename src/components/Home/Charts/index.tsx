import useDataChart from 'hooks/useDataChart'
import CardChartJS from './CardChartJS'

export default function MarketSection() {
  const tokenData = [useDataChart()]

  return (
    <>
      <section className="relative block">
        <div className="bg-blueGray-900 py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap mt-12 justify-center">
              {tokenData.map((prop, key) => {
                return (
                  <div className="w-full xl:w-8/12 px-4" key={key}>
                    {/* <CardChartJS {...prop} /> */}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
