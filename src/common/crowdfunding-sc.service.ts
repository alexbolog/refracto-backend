import {
  AbiRegistry,
  Address,
  ResultsParser,
  SmartContract,
} from '@multiversx/sdk-core/out';
import { Injectable } from '@nestjs/common';
import { LOAN_CF_SC_ADDRESS } from 'src/config';
import { ElrondProviderService } from './elrond-provider.service';

import LOAN_CF_SC_ABI from 'src/abi/loan-crowdfund-sc.abi.json';

const loanCrowdfundAbiRegistry = AbiRegistry.create(LOAN_CF_SC_ABI);
const loanCrowdfundSmartContract = new SmartContract({
  address: new Address(LOAN_CF_SC_ADDRESS),
  abi: loanCrowdfundAbiRegistry,
});

@Injectable()
export class CrowdfundingScService {
  constructor(private readonly elrondProviderService: ElrondProviderService) {}

  async getProjectDetails(projectIds: number[]): Promise<any[]> {
    const interaction =
      loanCrowdfundSmartContract.methods.getProjectDetails(projectIds);
    const query = interaction.check().buildQuery();
    const queryResponse =
      await this.elrondProviderService.proxyProvider.queryContract(query);
    const endpointDefinition = interaction.getEndpoint();
    const { firstValue, returnCode, returnMessage } =
      new ResultsParser().parseQueryResponse(queryResponse, endpointDefinition);

    if (!returnCode.isSuccess()) {
      console.error(
        'Error getting project details:',
        returnCode,
        returnMessage,
      );
      return [];
    }

    return firstValue.valueOf();
  }

  // async viewCommonContext(
  //   elrondProviderService: ElrondProviderService,
  // ): Promise<OuroFactoryCommonContext | undefined> {
  //   try {
  //     const interaction =
  //       jewelHatomFarmSmartContract.methodsExplicit.viewCommonContext();
  //     const query = interaction.check().buildQuery();
  //     const queryResponse =
  //       await elrondProviderService.proxyProvider.queryContract(query);
  //     const endpointDefinition = interaction.getEndpoint();
  //     const { firstValue, returnCode, returnMessage } =
  //       new ResultsParser().parseQueryResponse(
  //         queryResponse,
  //         endpointDefinition,
  //       );

  //     if (!firstValue || !returnCode.isSuccess()) {
  //       throw Error(returnMessage);
  //     }

  //     const value = firstValue.valueOf();
  //     const decoded = {
  //       snake_coil_address: value.snake_coil_address.toString(),
  //       snake_vesting_address: value.snake_vesting_address.toString(),
  //       ouro_token_id: value.ouro_token_id.toString(),
  //       ouro_supply: value.ouro_supply.toFixed(0),

  //       distribution_addresses: value.distribution_addresses.map((v) =>
  //         v.toString(),
  //       ),
  //       distribution_percents: value.distribution_percents.map((v) =>
  //         v.toNumber(),
  //       ),

  //       current_epoch: value.current_epoch.toNumber(),
  //       today_emission_amount: value.today_emission_amount.toFixed(0),
  //       is_today_emission_distributed: value.is_today_emission_distributed,
  //     };
  //     console.log('OuroFactoryScService.viewCommonContext', decoded);

  //     return decoded;
  //   } catch (e) {
  //     console.error('OuroFactoryScService.viewCommonContext:', e);
  //     return undefined;
  //   }
  // }

  // async distribute(
  //   elrondProviderService: ElrondProviderService,
  // ): Promise<string | undefined> {
  //   try {
  //     const data = new TransactionPayload(`distribute`);

  //     const tx = new Transaction({
  //       nonce: elrondProviderService.getHotWalletNonceAndIncrease(),
  //       value: '0',
  //       sender: elrondProviderService.account.address,
  //       receiver: new Address(OURO_FACTORY_SC_ADDRESS),
  //       gasLimit: 60_000_000,
  //       chainID: networkConfig.chainId,
  //       data,
  //     });

  //     const serialized: Buffer = tx.serializeForSigning();
  //     const signature: Buffer = await elrondProviderService.signer.sign(
  //       serialized,
  //     );
  //     tx.applySignature(signature);
  //     await elrondProviderService.proxyProvider.sendTransaction(tx);

  //     return tx.getHash().hex();
  //   } catch (e) {
  //     console.error('OuroFactoryScService.distribute:', e);
  //     return undefined;
  //   }
  // }
}
