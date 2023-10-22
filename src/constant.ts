import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'

// const privateKey = generatePrivateKey()

export const privateKey =
  '0x5b91188c221aee8a277de6150e769b161aadb5983d084e83e4f336ceb8049285'

// 0x2557D0d204a51CF37A0474b814Afa6f942f522cc
export const account = privateKeyToAccount(privateKey)

export const rpc_url = 'https://rpc.ankr.com/eth_goerli'
