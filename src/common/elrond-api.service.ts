import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { networkConfig } from 'src/config';
import {
  DelegationType,
  NetworkStatsType,
  StakingProviderType,
} from 'src/models';

@Injectable()
export class ElrondApiService {
  constructor(private readonly httpService: HttpService) {}

  async getAccountDelegations(address: string): Promise<DelegationType[]> {
    try {
      const url = `${networkConfig.apiAddress}/accounts/${address}/delegation`;
      const res = await firstValueFrom(
        this.httpService.get<DelegationType[]>(url).pipe(),
      );
      return res.data;
    } catch (e) {
      return [];
    }
  }

  async getStakingProviders(): Promise<StakingProviderType[]> {
    try {
      const url = `${networkConfig.apiAddress}/providers`;
      const res = await firstValueFrom(
        this.httpService.get<StakingProviderType[]>(url).pipe(),
      );
      return res.data;
    } catch (e) {
      return [];
    }
  }

  async getStakingProvider(
    contract: string,
  ): Promise<StakingProviderType | undefined> {
    try {
      const url = `${networkConfig.apiAddress}/providers/${contract}`;
      const res = await firstValueFrom(
        this.httpService.get<StakingProviderType>(url).pipe(),
      );
      return res.data;
    } catch (e) {
      return undefined;
    }
  }

  async queryElrondNetworkStats(): Promise<NetworkStatsType> {
    const url = `${networkConfig.apiAddress}/stats`;
    const res = await firstValueFrom(
      this.httpService.get<NetworkStatsType>(url).pipe(),
    );
    return res.data;
  }

  async queryTokenHolders(
    tokenIdentifier: string,
    nonce: number,
  ): Promise<number> {
    let hexNonce = nonce.toString(16);
    if (hexNonce.length % 2 === 1) {
      hexNonce = '0' + hexNonce;
    }
    const url = `${networkConfig.apiAddress}/nfts/${tokenIdentifier}-${hexNonce}/accounts/count`;
    const res = await firstValueFrom(this.httpService.get<number>(url).pipe());
    return res.data;
  }
}
