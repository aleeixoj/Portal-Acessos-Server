import { ActiveDirectory } from 'node-ad-tools'

const config = {
  url: 'ldap://redecorp.br', // You can use DNS as well, like domain.local
  base: 'dc=redecorp,dc=br'
}

const ADPromisses = new ActiveDirectory(config)

export default {
  ADPromisses
}
