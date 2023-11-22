import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ElrondProviderService } from 'src/common/elrond-provider.service';
import { REFRACTO_LOAN_SHARE_TOKEN_ID, networkConfig } from 'src/config';
import { CrowdfundingScService } from 'src/common/crowdfunding-sc.service';
import { ElrondApiService } from 'src/common/elrond-api.service';
import { SupabaseService } from 'src/common/supabase.service';

@Injectable()
export class CrowdfundingCronService {
  constructor(
    private readonly logger: Logger,
    private readonly supabaseService: SupabaseService,
    private readonly crowdfundingScService: CrowdfundingScService,
    private readonly apiService: ElrondApiService,
  ) {}

  private LOG_PREFIX: string = 'CrowdfundingCronService';

  @Cron('*/3 * * * * *')
  async updateProjects(): Promise<any> {
    this.logger.log(`${this.LOG_PREFIX}/updateCrowdfundingProjects: Start`);
    const projectIds = await this.supabaseService.getProjectIds();
    const projectDetails = await this.crowdfundingScService.getProjectDetails(
      projectIds,
    );

    this.logger.log(
      `${this.LOG_PREFIX}/updateCrowdfundingProjects: updating ${projectDetails.length} projects`,
    );
    for (const project of projectDetails) {
      const holdersCount = await this.apiService.queryTokenHolders(
        REFRACTO_LOAN_SHARE_TOKEN_ID,
        project.share_token_nonce,
      );
      await this.supabaseService.updateProjectScProgress(
        project.project_id,
        project.cf_progress,
        holdersCount - 1,
        project.share_token_nonce,
      );
    }

    this.logger.log(`${this.LOG_PREFIX}/updateCrowdfundingProjects: End`);
  }
}
