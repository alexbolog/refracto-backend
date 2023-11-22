import { networkConfigs } from './config.mvx-network';

// load env file
import dotenv = require('dotenv');
dotenv.config();

export const ELROND_NETWORK = 'devnet';
export const networkConfig = networkConfigs[ELROND_NETWORK];

export const IS_DEV = (ELROND_NETWORK as string) != 'mainnet';

//
export const HOT_WALLET_PEM = '/Users/alexbolog/Desktop/walletKey.pem';
export const WALLET_NONCE_UPDATE_PERIOD = 60 * 2000; // 2 min

export const LOAN_CF_SC_ADDRESS = IS_DEV
  ? 'erd1qqqqqqqqqqqqqpgqstmt3l73fyqt087p5cdhtvmc2yhyfsr0yl5sauaw4w'
  : '';
export const REFRACTO_LOAN_SHARE_TOKEN_ID = 'REFRACTO-b25fa1';
