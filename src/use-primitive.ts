import axios from 'axios'
import { account, rpc_url } from './constant'
import { hexToBigInt, keccak256 } from 'viem'
import RLP from 'rlp'

// block: eth_getBlockByNumber
// nonce: eth_getTransactionCount
// type: eip1559 | legacy
// 1. eip1559
// 2. legacy
// gas: eth_estimateGas
// eth_sendRawTransaction

// {
//   to: "0x87114ed56659216E7a1493F2Bdb870b2f2102156",
//   value: 100000000000000n,
//   from: "0x2557D0d204a51CF37A0474b814Afa6f942f522cc",
//   nonce: 0,
//   type: "eip1559",
//   maxPriorityFeePerGas: 1049n,
//   maxFeePerGas: 1064n,
//   gas: 21000n
// }

const prepareTransactionRequest = async () => {
  const nonce = await getNonce()
  const block = await getBlock()
  const maxPriorityFeePerGas = await getMaxPriorityFeePerGas()

  console.log(maxPriorityFeePerGas)
  console.log(hexToBigInt(maxPriorityFeePerGas))

  const request = {
    form: account.address,
    to: '0x87114ed56659216E7a1493F2Bdb870b2f2102156',
    nonce,
    type: '2',
    maxPriorityFeePerGas: maxPriorityFeePerGas,
    maxFeePerGas:
      hexToBigInt(block.baseFeePerGas) * 2n + hexToBigInt(maxPriorityFeePerGas)
  }
}

const getNonce = async () => {
  const response = await axios.post(rpc_url, {
    jsonrpc: '2.0',
    method: 'eth_getTransactionCount',
    params: [account.address, 'pending'],
    id: 1
  })
  return response.data.result
}

const getBlock = async () => {
  const response = await axios.post(rpc_url, {
    jsonrpc: '2.0',
    method: 'eth_getBlockByNumber',
    params: ['latest', false],
    id: 1
  })
  return response.data.result
}

const getMaxPriorityFeePerGas = async () => {
  const response = await axios.post(rpc_url, {
    jsonrpc: '2.0',
    method: 'eth_maxPriorityFeePerGas',
    params: [],
    id: 1
  })
  return response.data.result
}

const sendRawTransaction = async () => {
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
}

const signTransaction = async () => {
  const request = {
    from: '0x2557D0d204a51CF37A0474b814Afa6f942f522cc',
    to: '0x87114ed56659216E7a1493F2Bdb870b2f2102156',
    value: 10000000000000000n,
    type: 'eip1559',
    nonce: 2,
    maxPriorityFeePerGas: 1036n,
    maxFeePerGas: 1049n,
    gas: 21000n
  }

  const bytes = [
    '0x5',
    '0x2',
    '0x40c',
    '0x419',
    '0x5208',
    '0x87114ed56659216E7a1493F2Bdb870b2f2102156',
    '0x2386f26fc10000',
    '0x',
    []
  ]
  console.log(RLP.encode(bytes))
  console.log(RLP.decode(RLP.encode(bytes)))

  // 0x02f86d050282040c8204198252089487114ed56659216e7a1493f2bdb870b2f2102156872386f26fc1000080c080a0d22bcfd8b50976e53a2c0a7e53f1d7a59881095041866a4318b84b8f6feb9cb9a0429d1f66770faf8cc027a95a48b578e645eb570bab0671a57d7da2beb1458ddc
}

signTransaction()
