import { Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { SupabaseService } from './common/supabase.service';
import { CrowdfundingScService } from './common/crowdfunding-sc.service';
import { ElrondApiService } from './common/elrond-api.service';
import { REFRACTO_LOAN_SHARE_TOKEN_ID } from './config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly supabaseService: SupabaseService,
    private readonly crowdfundingScService: CrowdfundingScService,
    private readonly apiService: ElrondApiService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/projects')
  async getProjects(): Promise<any> {
    const projectIds = await this.supabaseService.getProjectIds();
    return await this.crowdfundingScService.getProjectDetails(projectIds);
  }
}
