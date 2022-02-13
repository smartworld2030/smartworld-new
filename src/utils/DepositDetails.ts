export function referralPercent(value: number) {
  return value < 1000
    ? value / 1000
    : value < 21000
    ? 1 + (value - 1000) / 20000
    : value < 61000
    ? 2 + (value - 21000) / 40000
    : value < 141000
    ? 3 + (value - 61000) / 80000
    : 4
}

function calcPercent(value: number) {
  return value / 100
}

function totalReward(value: number) {
  return value * 2
}

function monthlyReward(value: number) {
  return (value * rewardPercent(value)) / 100
}

export function hourlyReward(value: number) {
  return monthlyReward(value) / 720
}

export function rewardPeriod(value: number) {
  return totalReward(value) / monthlyReward(value)
}

export function rewardPercent(value: number) {
  if (value < 100) {
    return (value * 5) / 100
  }
  const percent = 5 + calcPercent(value - 100)
  return percent > 14 ? 14 : percent
}
