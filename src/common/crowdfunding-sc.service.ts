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
import { SCProjectDetails } from 'src/models';

const loanCrowdfundAbiRegistry = AbiRegistry.create(LOAN_CF_SC_ABI);
const loanCrowdfundSmartContract = new SmartContract({
  address: new Address(LOAN_CF_SC_ADDRESS),
  abi: loanCrowdfundAbiRegistry,
});

@Injectable()
export class CrowdfundingScService {
  constructor(private readonly elrondProviderService: ElrondProviderService) {}

  async getProjectDetails(projectIds: number[]): Promise<SCProjectDetails[]> {
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

    const valueArr = firstValue.valueOf();
    const decoded: SCProjectDetails[] = valueArr.map((value: any) => ({
      project_id: value.project_id.toNumber(),
      project_name: value.project_name.toString(),
      project_payment_token: value.project_payment_token.toString(),
      daily_interest_rate: value.daily_interest_rate.toNumber(),
      daily_penalty_fee_rate: value.daily_penalty_fee_rate.toNumber(),
      developer_wallet_address: value.developer_wallet.bech32(),
      share_token_nonce: value.share_token_nonce.toNumber(),
      share_price_per_unit: value.share_price_per_unit.toNumber(),
      cf_start_timestamp: value.cf_start_timestamp.toNumber(),
      cf_end_timestamp: value.cf_end_timestamp.toNumber(),
      cf_target_min: value.cf_target_min.shiftedBy(-6).toNumber(),
      cf_target_max: value.cf_target_max.shiftedBy(-6).toNumber(),
      cf_progress: value.cf_progress.shiftedBy(-6).toNumber(),
      loan_duration: value.loan_duration.toNumber(),
      loan_start_timestamp: value.loan_start_timestamp.toNumber(),
      repayment_contract_address: value.repayment_contract_address.bech32(),
      is_cancelled: value.is_cancelled,
      is_loan_active: value.is_loan_active,
      is_repaid: value.is_repayed,
    }));

    return decoded;
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
