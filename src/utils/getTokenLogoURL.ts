const getTokenLogoURL = (address: string) =>
  `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${address}/logo.png`

export const getTokenLogoPath = (address: string) => `./assets/images/tokens/${address}.png`

export default getTokenLogoURL
