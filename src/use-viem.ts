import { createPublicClient, createWalletClient, http, parseEther } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { goerli } from 'viem/chains'
import { account, rpc_url } from './constant'

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
    value: parseEther('0.0001')
  })

  console.log(request)

  const signature = await walletClient.signTransaction(request)

  console.log(signature)
}

send()
