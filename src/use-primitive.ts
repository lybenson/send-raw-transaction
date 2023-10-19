import { account, rpc_url } from './constant'

// block: eth_getBlockByNumber
// nonce: eth_getTransactionCount
// type: eip1559 | legacy
// 1. eip1559
// 2. legacy
// gas: eth_estimateGas
// eth_sendRawTransaction
const send = async () => {
  console.log(account)

  const response = await fetch(rpc_url, {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getBlockByNumber',
      params: ['latest', false],
      id: 1
    })
  }).then((res) => {
    return res.json()
  })

  console.log(response)
}

send()
