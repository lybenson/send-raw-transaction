import axios from 'axios'
import { account, rpc_url } from './constant'
import { hexToBigInt, keccak256, toHex } from 'viem'
import RLP from 'rlp'
import { keccak_256 } from '@noble/hashes/sha3'
import { secp256k1 } from '@noble/curves/secp256k1'

const prepareTransactionRequest = async () => {
  const nonce = await getNonce()
  const block = await getBlock()
  const maxPriorityFeePerGas = await getMaxPriorityFeePerGas()

  const originRequest = {
    form: account.address,
    to: '0x87114ed56659216E7a1493F2Bdb870b2f2102156',
    nonce,
    type: toHex(2),
    value: toHex(10000000000000000n),
    maxPriorityFeePerGas: maxPriorityFeePerGas,
    maxFeePerGas: toHex(
      (hexToBigInt(block.baseFeePerGas) * 12n) / 10n +
        hexToBigInt(maxPriorityFeePerGas)
    )
  }

  const response = await axios.post(rpc_url, {
    jsonrpc: '2.0',
    method: 'eth_estimateGas',
    params: [originRequest],
    id: 1
  })

  // @ts-ignore
  originRequest.gas = response.data.result

  return originRequest
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

const sendRawTransaction = async (signedTransaction) => {
  const response = await axios.post(rpc_url, {
    jsonrpc: '2.0',
    method: 'eth_sendRawTransaction',
    params: [signedTransaction],
    id: 1
  })
  console.log(response.data)
}

const signTransaction = async (request) => {
  const serializedTransaction = serializeTransaction({
    chainId: 5,
    ...request
  })
  const rlp = toRlp(serializedTransaction)

  const hash = toHex(keccak_256(rlp))

  const { r, s, recovery } = secp256k1.sign(
    hash.slice(2),
    '5b91188c221aee8a277de6150e769b161aadb5983d084e83e4f336ceb8049285'
  )

  const signature = {
    r,
    s,
    v: recovery ? 28n : 27n
  }

  serializedTransaction.push(
    signature.v === 27n ? '0x' : toHex(1), // yParity
    r,
    s
  )
  const lastSignature = toRlp(serializedTransaction)

  const hexes = /*#__PURE__*/ Array.from({ length: 256 }, (_v, i) =>
    i.toString(16).padStart(2, '0')
  )

  return (
    '0x' +
    lastSignature.reduce((prev, current) => {
      return prev + hexes[current]
    }, '')
  )
}

const serializeTransaction = (transaction) => {
  const {
    chainId,
    gas,
    nonce,
    to,
    value,
    maxFeePerGas,
    maxPriorityFeePerGas,
    accessList,
    data
  } = transaction

  return [
    toHex(chainId),
    nonce ? nonce : '0x',
    maxPriorityFeePerGas ? maxPriorityFeePerGas : '0x',
    maxFeePerGas ? maxFeePerGas : '0x',
    gas ? gas : '0x',
    to ?? '0x',
    value ? value : '0x',
    data ?? '0x',
    accessList ?? []
  ]
}

const toRlp = (serializedTransaction) => {
  return new Uint8Array([2, ...RLP.encode(serializedTransaction)])
}

const main = async () => {
  const request = await prepareTransactionRequest()
  console.log(request)
  const signedTransaction = await signTransaction(request)
  console.log(signedTransaction)

  await sendRawTransaction(signedTransaction)
}

main()
