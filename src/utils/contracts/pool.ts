const pool = {
  address: {
    56: '0x4056E842Db38cc348aD152DF03e7f01dde8e125a',
    97: '0x04887Fe05b40Cd2C62AD2783eD901f3bD0a9ea49',
  },
  abi: [
    'event WithdrawInterest(address indexed user, uint256 daily, uint256 referrals)',
    'event Freeze(address indexed user, address indexed referrer, uint256 amount)',
    'event Unfreeze(address indexed user, uint256 sttsAmount, uint256 bnbAmount)',
    'function owner()view returns(address)',
    'function sttsToBnbPrice()view returns(uint256)',
    'function calculateBnb(uint256)view returns(uint256)',
    'function calculateLiquidityValue(uint256)view returns(uint256 stts,uint256 bnb,uint256 total)',
    'function users(address)view returns(address referrer,uint256 refPercent,uint256 refAmounts,uint256 liquidity,uint256 latestWithdraw)',
    'function freezeInfo(uint256 stts, uint256 percent)view returns(uint256 reward,uint256 bnb,uint256 minStts,uint256 minBnb,uint256 slippage)',
    'function unfreezeInfo(address user, uint256 percent)view returns(uint256 stts,uint256 bnb,uint256 minStts,uint256 minBnb,uint256 slippage)',
    'function freeze(address referrer,uint256 refPercent,uint256 sttsAmount,uint256 amountSTTSMin,uint256 amountBNBMin,uint256 deadline) payable',
    'function updateFreeze(uint256 sttsAmount,uint256 amountSTTSMin,uint256 amountBNBMin,uint256 deadline) payable',
    'function unfreeze(uint256 amountSTTSMin,uint256 amountBNBMin,uint256 deadline)',
    'function freezeLP(address referrer,uint256 refPercent,uint256 lpAmount)',
    'function updateFreezeLP(uint256 lpAmount)',
    'function unfreezeLP()',
    'function calulateBnb(uint256 stts)view returns(uint256 bnb)',
    'function withdrawInterest() returns(bool)',
    'function calculateInterest(address user)view returns(uint256 daily,uint256 referral,uint256 referrer,uint256 requestTime)',
    'function calculateDaily(address user,uint256 time)view returns(uint256 daily)',
    'function userDepositNumber(address user)view returns(uint256)',
    'function userDepositDetails(address user, uint256 index) view returns (uint256 startTime,uint256 reward)',
  ],
}

export default pool
