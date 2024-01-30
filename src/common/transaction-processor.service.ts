import { Injectable, Logger } from '@nestjs/common';
import BigNumber from 'bignumber.js';

import dotenv = require('dotenv');
import { ProcessedTransaction, TransactionType } from 'src/models';
import { SupabaseService } from './supabase.service';

dotenv.config();

@Injectable()
export class TransactionProcessorService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async processTransactions(
    transactions: TransactionType[],
  ): Promise<ProcessedTransaction[]> {
    const processedTransactions = [];

    for (const transaction of transactions) {
      const processedTransaction = await this.parseTransaction(transaction);
      processedTransactions.push(processedTransaction);
    }

    return processedTransactions;
  }

  private extractTransferInfo(
    txAction: any,
    targetTicker: string,
  ): { amount: number; transferToken: string } {
    const transferIn = txAction.arguments.transfers.find((t) =>
      t.ticker.includes(targetTicker),
    );
    if (!transferIn) {
      return { amount: 0, transferToken: 'N/A' };
    }
    return {
      amount: new BigNumber(transferIn.value).shiftedBy(-6).toNumber(),
      transferToken: transferIn.token,
    };
  }

  private extractProjectId(txAction: any): number | null {
    if (txAction?.arguments?.functionName !== 'invest') {
      return null;
    }
    return parseInt(txAction.arguments.functionArgs, 16);
  }

  private async parseTransaction(
    transaction: TransactionType,
  ): Promise<ProcessedTransaction> {
    const projectId = this.extractProjectId(transaction.action);
    const transferInfo =
      transaction.function === 'invest'
        ? this.extractTransferInfo(transaction.action, 'USDC')
        : null;
    return {
      tx_hash: transaction.txHash,
      sender: transaction.sender,
      function: transaction.function,
      tx_timestamp: transaction.timestamp,
      status: transaction.status,
      amount: transferInfo?.amount ?? 0,
      transfer_token: transferInfo?.transferToken ?? 'N/A',
      project_id: projectId,
    };
  }
}
