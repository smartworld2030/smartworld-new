import { HistoryIcon, Button, useModal } from '@smartworld-libs/uikit'
import TransactionsModal from './TransactionsModal'

const Transactions = () => {
  const [onPresentTransactionsModal] = useModal(<TransactionsModal />)
  return (
    <>
      <Button variant="text" p={0} onClick={onPresentTransactionsModal}>
        <HistoryIcon color="textSubtle" width="24px" />
      </Button>
    </>
  )
}

export default Transactions
