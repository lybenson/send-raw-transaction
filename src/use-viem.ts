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
  // 0x02f86d050282040c8204198252089487114ed56659216e7a1493f2bdb870b2f2102156872386f26fc1000080c080a0d22bcfd8b50976e53a2c0a7e53f1d7a59881095041866a4318b84b8f6feb9cb9a0429d1f66770faf8cc027a95a48b578e645eb570bab0671a57d7da2beb1458ddc

  const signature = await walletClient.signTransaction(request)
  console.log(signature)
}

signTransaction()
// send()
