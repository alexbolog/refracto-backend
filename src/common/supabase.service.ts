import { Injectable, Logger } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import BigNumber from 'bignumber.js';

import dotenv = require('dotenv');
import { ProcessedTransaction } from 'src/models';
dotenv.config();

@Injectable()
export class SupabaseService {
  private supabase: any;

  constructor(private readonly logger: Logger) {}

  onModuleInit() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Key must be provided!');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getProjectIds(): Promise<number[]> {
    const { data, error } = await this.supabase.rpc('read_update_project_data');
    if (error) {
      console.log('Error getting project ids', error);
      return [];
    }

    return data.map((project: any) => project.id);
  }

  async updateProjectScProgress(
    projectId: number,
    crowdfundedAmount: number,
    holdersCount: number,
    shareTokenNonce: number,
  ): Promise<void> {
    const { error } = await this.supabase.rpc('update_project_sc_data', {
      _projectid: projectId,
      _amount: crowdfundedAmount,
      _holderscount: holdersCount,
      _sharetokennonce: shareTokenNonce,
    });
    if (error) {
      console.log(
        `Error setting crowdfunded amount for projectId = ${projectId}`,
        error,
      );
    }
  }

  async getLastProcessedTransactionTimestamp(): Promise<number> {
    const { data, error } = await this.supabase.rpc(
      'get_last_processed_tx_timestamp',
    );

    if (error) {
      console.log('Error getting last processed transaction timestamp', error);
      return 0;
    }

    return data === null || data[0].length === 0 ? 0 : data[0];
  }

  async addProcessedTransactions(
    transactions: ProcessedTransaction[],
  ): Promise<void> {
    const { error } = await this.supabase.rpc('add_processed_transactions', {
      transactions: transactions,
    });

    if (error) {
      console.log('Error adding processed transactions', error);
    }
  }
}
