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

  private async parseTransaction(
    transaction: TransactionType,
  ): Promise<ProcessedTransaction> {
    const transferInfo = this.extractTransferInfo(transaction.action);
    const projectId = await this.extractProjectId(
      transaction.action,
      transferInfo.nonce,
    );
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

  private extractTransferInfo(txAction: any): {
    transferToken: string;
    nonce: number;
    amount: number;
  } {
    if (!txAction?.arguments?.transfers.length) {
      return { transferToken: 'N/A', nonce: 0, amount: 0 };
    }
    const transferIn = txAction.arguments.transfers[0];
    const amount = new BigNumber(transferIn.value)
      .shiftedBy(-transferIn.decimals)
      .toNumber();

    switch (transferIn.type) {
      case 'MetaESDT':
        const nonce = parseInt(transferIn.identifier.split('-').pop(), 16);
        const transferToken = transferIn.identifier;
        return {
          transferToken,
          nonce,
          amount,
        };
      case 'FungibleESDT':
        return {
          transferToken: transferIn.token,
          nonce: 0,
          amount,
        };
      default:
        return { transferToken: 'N/A', nonce: 0, amount };
    }
  }

  private async extractProjectId(
    txAction: any,
    nonce: number,
  ): Promise<number | null> {
    switch (txAction?.arguments?.functionName) {
      case 'invest':
        return parseInt(txAction.arguments.functionArgs, 16);
      case 'withdraw':
      case 'claimRefund':
        return this.supabaseService.getProjectIdByShareTokenNonce(nonce);
      default:
        return null;
    }
  }
}
