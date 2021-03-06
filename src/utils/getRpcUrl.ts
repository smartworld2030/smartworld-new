import sample from 'lodash/sample'

// Array of available nodes to connect to
export const nodes = [process.env.REACT_APP_NODE_1, process.env.REACT_APP_NODE_2, process.env.REACT_APP_NODE_3]
export const testNodes = [
  process.env.REACT_APP_TEST_NODE_1,
  process.env.REACT_APP_TEST_NODE_2,
  process.env.REACT_APP_TEST_NODE_3,
]

const getNodeUrl = () => {
  return process.env.REACT_APP_CHAIN_ID === '56' ? sample(nodes) : sample(testNodes)
}

export default getNodeUrl
