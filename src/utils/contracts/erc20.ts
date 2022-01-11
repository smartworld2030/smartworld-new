const erc20 = {
  address: {
    56: {
      stt: '0xbBe476b50D857BF41bBd1EB02F777cb9084C1564',
      stts: '0x88469567A9e6b2daE2d8ea7D8C77872d9A0d43EC',
      btcb: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
      lptoken: '0x45Ee99347E4E3946bE250fEC8172401965E2DFB3',
    },
    97: {
      stt: '0x75Bea6460fff60FF789F88f7FE005295B8901455',
      stts: '0xBFd0Ac6cD15712E0a697bDA40897CDc54b06D7Ef',
      btcb: '0x3c26729bb1Cf37d18EFdF3bb957f5e0de5c2Cb12',
      lptoken: '0x3403db5EDd2541Aaa3793De4C0FFb31463A3D1cF',
    },
  },
  decimals: {
    bnb: 18,
    stt: 8,
    stts: 8,
    btcb: 18,
    btc: 18,
    BNB: 18,
    STT: 8,
    STTS: 8,
    BTCB: 18,
    BTC: 18,
    'STTS-BNB': 18,
    totalStts: 8,
    liquidity: 18,
  },
  abi: [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function totalSupply() view returns (uint)',
    'function balanceOf(address) view returns (uint)',
    'function transfer(address to, uint amount)',
    'function approve(address spender, uint256 amount)',
    'function allowance(address owner, address spender) public view returns (uint256)',
    'event Transfer(address indexed from, address indexed to, uint amount)',
  ],
}

export default erc20
