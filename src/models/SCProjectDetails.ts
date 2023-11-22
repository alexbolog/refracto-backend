export interface SCProjectDetails {
  project_id: number;
  project_name: string;
  project_payment_token: string;
  daily_interest_rate: number;
  daily_penalty_fee_rate: number;
  developer_wallet_address: string;
  share_token_nonce: number;
  share_price_per_unit: number;
  cf_start_timestamp: number;
  cf_end_timestamp: number;
  cf_target_min: number;
  cf_target_max: number;
  cf_progress: number;
  loan_duration: number;
  loan_start_timestamp: number;
  repayment_contract_address: string;
  is_cancelled: boolean;
  is_loan_active: boolean;
  is_repaid: boolean;
}
