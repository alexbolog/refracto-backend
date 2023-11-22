import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrowdfundingScService } from './common/crowdfunding-sc.service';
import { CrowdfundingCronModule } from './crons/crowdfunding/crowdfunding.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    CrowdfundingCronModule,
    // CrowdfundingScService,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
