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
      this.logger.error('Error getting project ids', error);
      return [];
    }

    return data.map((project: any) => project.id);
  }

  async getUiProjects(): Promise<any[]> {
    const { data, error } = await this.supabase.rpc('read_project_data');
    if (error) {
      this.logger.error('Error getting project data', error);
      return []; // return an empty array in case of an error
    }
    return data.map((r: any) => ({
      projectId: r.id,
      projectTitle: r.title,
      returnPercentage: r.returnpercentage,
      riskRatingLevel: r.riskratinglevel,
      crowdfundingDeadline: r.crowdfundingdeadline,
      crowdfundingTarget: r.crowdfundingtarget,
      crowdfundedAmount: r.crowdfundedamount,
      colorCodeHex: r.colorcodehex,
      thumbnailSrc: r.thumbnailsrc,
      tokenNonce: r.sharetokennonce,
      holdersCount: r.holders,
      status: r.status,
    }));
  }

  async updateProjectScProgress(
    projectId: number,
    crowdfundedAmount: number,
    holdersCount: number,
    shareTokenNonce: number,
    status: number,
  ): Promise<void> {
    const { error } = await this.supabase.rpc('update_project_sc_data', {
      _projectid: projectId,
      _amount: crowdfundedAmount,
      _holderscount: holdersCount,
      _sharetokennonce: shareTokenNonce,
      _status: status,
    });
    if (error) {
      this.logger.error(
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
      this.logger.error(
        'Error getting last processed transaction timestamp',
        error,
      );
      return 0;
    }

    return data === null ? 0 : Math.floor(new Date(data).getTime() / 1000);
  }

  async addProcessedTransactions(
    transactions: ProcessedTransaction[],
  ): Promise<void> {
    if (transactions.length === 0) {
      return;
    }
    const { error } = await this.supabase.rpc('add_processed_transactions', {
      transactions: transactions,
    });

    if (error) {
      this.logger.error('Error adding processed transactions', error);
    }
  }

  async getUnprocessedTransactionHashes(hashes: string[]): Promise<string[]> {
    if (hashes.length === 0) {
      return [];
    }
    const { data, error } = await this.supabase.rpc(
      'get_unprocessed_transaction_hashes',
      {
        tx_hashes: hashes,
      },
    );

    if (error) {
      this.logger.error('Error getting unprocessed transaction hashes', error);
      return [];
    }

    return data.map((d: { tx_hash: string }) => d.tx_hash);
  }

  async getProjectIdByShareTokenNonce(
    shareTokenNonce: number,
  ): Promise<number> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('id')
      .eq('ShareTokenNonce', shareTokenNonce);

    if (error) {
      this.logger.error('Error getting project id by share token nonce', error);
      return 0;
    }

    return data === null ? 0 : data.id;
  }
}
