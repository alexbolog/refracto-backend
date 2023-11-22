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

  //   @Get('/projects/:id')
  //   async getProjectById(@Param('id') id: number): Promise<any> {
  //     const projects = await this.getProjects();
  //     console.log('Fetching project with id', id);
  //     const foundProject = projects.find(
  //       (p: any) => p.project_id.toNumber() === id,
  //     );
  //     console.log(projects, foundProject);
  //     return foundProject;
  //   }

  @Post('/projects/update')
  async updateProjects(): Promise<any> {
    const projectIds = await this.supabaseService.getProjectIds();
    const projectDetails = await this.crowdfundingScService.getProjectDetails(
      projectIds,
    );

    for (const project of projectDetails) {
      const holdersCount = await this.apiService.queryTokenHolders(
        REFRACTO_LOAN_SHARE_TOKEN_ID,
        project.share_token_nonce.toNumber(),
      );
      await this.supabaseService.updateProjectScProgress(
        project.project_id.toNumber(),
        project.cf_progress.shiftedBy(-6).toNumber(),
        holdersCount - 1,
      );
    }
  }
}
