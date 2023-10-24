import { ethers, parseEther } from 'ethers'
import { privateKey, rpc_url } from './constant'

const provider = new ethers.JsonRpcProvider(rpc_url)
const wallet = new ethers.Wallet(privateKey)
const signer = wallet.connect(provider)

const sendTransaction = async () => {
  console.log(await signer.getAddress())

  const to = '0x87114ed56659216E7a1493F2Bdb870b2f2102156'
  const request = await signer.populateTransaction({
    to,
    value: parseEther('0.000000001'),
    type: 2
  })
  console.log(request)
  // {
  //   to: "0x87114ed56659216E7a1493F2Bdb870b2f2102156",
  //   value: 10000000000000000n,
  //   type: 2,
  //   from: "0x2557D0d204a51CF37A0474b814Afa6f942f522cc",
  //   nonce: 9,
  //   gasLimit: 21000n,
  //   chainId: 5n,
  //   maxFeePerGas: 1000000032n,
  //   maxPriorityFeePerGas: 1000000000n
  // }
}

sendTransaction()
