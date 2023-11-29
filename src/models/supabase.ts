export interface ProcessedTransaction {
  tx_hash: string;
  sender: string;
  function: string;
  tx_timestamp: number;
  status: string;
  amount: number;
  transfer_token: string;
  project_id: number;
}
