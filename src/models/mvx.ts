export interface DelegationType {
  delegation_id: number,
  time: string,
  contract: string,
  userUnBondable: string,
  userActiveStake: string,
  claimableRewards: string,
  userUndelegatedList: {
    amount: string,
    seconds: number,
  }[],
  undelegated: string,
}

export interface NetworkStatsType {
  shards: number,
  blocks: number,
  accounts: number,
  transactions: number,
  refreshRate: number,
  epoch: number,
  roundsPassed: number,
  roundsPerEpoch: number,
}

export interface StakingProviderIdentityType {
  key: string,
  name: string,
  avatar: string,
  description: string,
  location: string,
  url: string,
}

export interface StakingProviderType {
  contract: string,
  identity: StakingProviderIdentityType,
  maxDelegationCap: string,
  withDelegationCap: boolean,
  apr: number,
  totalActiveStake: string,
}
