import { ActiveDirectory } from 'node-ad-tools'

const config = {
  url: process.env.AD_URL', // You can use DNS as well, like domain.local
  base: process.env.AD_BASE
}

const ADPromisses = new ActiveDirectory(config)

export default {
  ADPromisses
}
