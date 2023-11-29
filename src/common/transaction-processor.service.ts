import { Injectable, Logger } from '@nestjs/common';
import BigNumber from 'bignumber.js';

import dotenv = require('dotenv');
import { ProcessedTransaction, TransactionType } from 'src/models';

dotenv.config();

@Injectable()
export class TransactionProcessorService {
  constructor(private readonly logger: Logger) {}

  async processTransactions(
    transactions: TransactionType[],
  ): Promise<ProcessedTransaction[]> {
    const processedTransaction = transactions.map((transaction) => ({
      tx_hash: transaction.txHash,
      sender: transaction.sender,
      function: transaction.function,
      tx_timestamp: transaction.timestamp,
    }));

    return processedTransaction;
  }
}
