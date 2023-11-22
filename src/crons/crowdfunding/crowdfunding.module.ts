import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CommonModule } from 'src/common/common.module';
import { CrowdfundingCronService } from './crowdfunding.service';

@Module({
  imports: [ScheduleModule.forRoot(), CommonModule],
  providers: [CrowdfundingCronService],
})
export class CrowdfundingCronModule {}
