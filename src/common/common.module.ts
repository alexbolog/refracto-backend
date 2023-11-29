import { Global, Logger, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ElrondProviderService } from './elrond-provider.service';
import { ElrondApiService } from './elrond-api.service';
import { SupabaseService } from './supabase.service';
import { CrowdfundingScService } from './crowdfunding-sc.service';
import { TransactionProcessorService } from './transaction-processor.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [
    Logger,
    ElrondProviderService,
    ElrondApiService,
    SupabaseService,
    CrowdfundingScService,
    TransactionProcessorService,
  ],
  exports: [
    HttpModule,
    Logger,
    ElrondProviderService,
    ElrondApiService,
    SupabaseService,
    CrowdfundingScService,
    TransactionProcessorService,
  ],
})
export class CommonModule {}
