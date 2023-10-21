import {
  createPublicClient,
  createWalletClient,
  encodeFunctionData,
  http,
  parseEther
} from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { goerli } from 'viem/chains'
import { account, rpc_url } from './constant'
import { erc20ABI } from '@wagmi/core'
import { SignTransactionParameters } from 'viem/actions'

const publicClient = createPublicClient({
  chain: goerli,
  transport: http(rpc_url)
})

const walletClient = createWalletClient({
  account,
  chain: goerli,
  transport: http(rpc_url)
})

const send = async () => {
  const to = '0x87114ed56659216E7a1493F2Bdb870b2f2102156'
  const request = await walletClient.prepareTransactionRequest({
    to,
    value: parseEther('0.01'),
    type: 'eip1559'
  })
  console.log(request)
  const signature = await walletClient.signTransaction(request)
  console.log(signature)

  const hash = await walletClient.sendRawTransaction({
    serializedTransaction: signature
  })

  console.log(hash)
}

const signTransaction = async () => {
  const request: SignTransactionParameters = {
    account,
    chain: walletClient.chain,
    to: '0x87114ed56659216E7a1493F2Bdb870b2f2102156',
    value: 10000000000000000n,
    type: 'eip1559',
    nonce: 2,
    maxPriorityFeePerGas: 1036n,
    maxFeePerGas: 1049n,
    gas: 21000n
  }
  const signature = await walletClient.signTransaction(request)
  console.log(signature)
}

signTransaction()
