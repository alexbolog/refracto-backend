import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ElrondProviderService } from 'src/common/elrond-provider.service';
import { REFRACTO_LOAN_SHARE_TOKEN_ID, networkConfig } from 'src/config';
import { CrowdfundingScService } from 'src/common/crowdfunding-sc.service';
import { ElrondApiService } from 'src/common/elrond-api.service';
import { SupabaseService } from 'src/common/supabase.service';
import { TransactionProcessorService } from 'src/common/transaction-processor.service';

@Injectable()
export class CrowdfundingCronService {
  constructor(
    private readonly logger: Logger,
    private readonly supabaseService: SupabaseService,
    private readonly crowdfundingScService: CrowdfundingScService,
    private readonly apiService: ElrondApiService,
    private readonly transactionProcessor: TransactionProcessorService,
  ) {}

  private LOG_PREFIX: string = 'CrowdfundingCronService';

  @Cron('*/3 * * * * *')
  async updateProjects(): Promise<any> {
    this.logger.log(`${this.LOG_PREFIX}/updateCrowdfundingProjects: Start`);
    const projectIds = await this.supabaseService.getProjectIds();
    const projectDetails = await this.crowdfundingScService.getProjectDetails(
      projectIds,
    );

    const existingUiProjects = await this.supabaseService.getUiProjects();

    this.logger.log(
      `${this.LOG_PREFIX}/updateCrowdfundingProjects: updating ${projectDetails.length} projects`,
    );
    for (const project of projectDetails) {
      const holdersCount = await this.apiService.queryTokenHolders(
        REFRACTO_LOAN_SHARE_TOKEN_ID,
        project.share_token_nonce,
      );

      const existingUiProject = existingUiProjects.find(
        (p) => p.projectId === project.project_id,
      );

      if (
        !existingUiProject ||
        existingUiProject.tokenNonce !== project.share_token_nonce ||
        existingUiProject.crowdfundedAmount !== project.cf_progress ||
        existingUiProject.holdersCount !== holdersCount - 1 ||
        existingUiProject.status !== project.status
      ) {
        this.logger.log(
          `${this.LOG_PREFIX}/updateCrowdfundingProjects: updating project ${project.project_id}`,
        );
        await this.supabaseService.updateProjectScProgress(
          project.project_id,
          project.cf_progress,
          holdersCount - 1,
          project.share_token_nonce,
          project.status,
        );
      }
    }

    this.logger.log(`${this.LOG_PREFIX}/updateCrowdfundingProjects: End`);
  }

  @Cron('*/3 * * * * *')
  async processTransactions(): Promise<any> {
    this.logger.log(`${this.LOG_PREFIX}/processTransactions: Start`);
    const lastProcessedTimestamp =
      await this.supabaseService.getLastProcessedTransactionTimestamp();
    this.logger.log(
      `${this.LOG_PREFIX}/processTransactions: last processed timestamp = ${lastProcessedTimestamp}`,
    );

    const newApiTransactions = await this.apiService.getTransactions(
      lastProcessedTimestamp,
    );
    this.logger.log(
      `${this.LOG_PREFIX}/processTransactions: fetched ${newApiTransactions.length} new transactions from API`,
    );
    const unprocessedTransactionHashes =
      await this.supabaseService.getUnprocessedTransactionHashes(
        newApiTransactions.map((transaction) => transaction.txHash),
      );

    const newTransactions = newApiTransactions.filter((transaction) =>
      unprocessedTransactionHashes.includes(transaction.txHash),
    );

    const processedTransactions =
      await this.transactionProcessor.processTransactions(newTransactions);

    await this.supabaseService.addProcessedTransactions(processedTransactions);

    this.logger.log(
      `${this.LOG_PREFIX}/processTransactions: processed ${newTransactions.length} transactions`,
    );

    this.logger.log(`${this.LOG_PREFIX}/processTransactions: End`);
  }
}
