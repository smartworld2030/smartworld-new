const bank = {
  address: {
    56: '0xbBe476b50D857BF41bBd1EB02F777cb9084C1564',
    97: '0x75Bea6460fff60FF789F88f7FE005295B8901455',
  },
  abi: [
    'event Activated(address indexed by, address indexed user)',
    'event Withdraw(address indexed from, address indexed user, uint256 amount)',
    'event Deposit(address indexed by, address indexed user, uint256 satoshi, uint256 amount)',
    'event DepositToken(address indexed token,address indexed by,address indexed user,uint256 amount)',
    'event WithdrawToken(address indexed token,address indexed from,address indexed user,uint256 amount)',
    'function sttPrice() external view returns (uint256)',
    'function STTS() external view returns (address)',
    'function BTCB() external view returns (address)',
    'function totalSupply() external view returns (uint256)',
    'function totalSatoshi() external view returns (uint256 stts,uint256 btc,uint256 bnb)',
    'function totalBalances() external view returns (uint256 stts,uint256 btc,uint256 bnb)',
    'function btcToSatoshi(uint256 value_) external view returns (uint256)',
    'function bnbToSatoshi(uint256 value_) external view returns (uint256)',
    'function sttsToSatoshi(uint256 value_) external view returns (uint256)',
    'function btcToBnbPrice() external view returns (uint256)',
    'function sttsToBnb(uint256 value_) external view returns (uint256)',
    'function sttsToBnbPrice() external view returns (uint256)',
    'function userBalances(address user_, address contract_) external view returns (bool isActive,uint256 bnb,uint256 satoshi)',
    'function userTokens(address token_, address user_,address contract_) external view returns (uint256)',
  ],
}
export default bank
