import Home from 'components/Home'
import useQuery from 'hooks/useQuery'
import { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'

export const Test = () => {
  const q = useQuery()
  console.log(q)
  return (
    <Switch>
      <Suspense fallback={<div>Loading..</div>}>
        <Route path="/">
          <Home />
        </Route>
      </Suspense>
    </Switch>
  )
}
