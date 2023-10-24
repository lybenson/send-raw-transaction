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

const sendTransaction = async () => {
  const to = '0x87114ed56659216E7a1493F2Bdb870b2f2102156'
  const request = await walletClient.prepareTransactionRequest({
    account,
    chain: goerli,
    to,
    value: parseEther('0.000000001'),
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

sendTransaction()
