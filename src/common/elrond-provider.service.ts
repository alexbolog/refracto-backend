import * as fs from 'fs';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { UserSigner } from '@multiversx/sdk-wallet/out';
import { Injectable } from '@nestjs/common';
import { HOT_WALLET_PEM, networkConfig, WALLET_NONCE_UPDATE_PERIOD } from 'src/config';
import { INetworkProvider } from '@multiversx/sdk-network-providers/out/interface';
import { Account } from '@multiversx/sdk-core/out';

// load env file
import dotenv = require('dotenv');
dotenv.config();

@Injectable()
export class ElrondProviderService {
    public proxyProvider: INetworkProvider;
    public signer: UserSigner;
    public account: Account;
    public hotWalletNonce: number;
    public lastUpdatedTimestamp: number;
    
    constructor() {
        this.proxyProvider = new ProxyNetworkProvider(networkConfig.gatewayAddress, {
            timeout: networkConfig.apiTimeout,
        });

        const pem = fs.readFileSync(HOT_WALLET_PEM, { encoding: 'utf-8' }).trim();
        this.signer = UserSigner.fromPem(pem);
        // this.signer = UserSigner.fromPem(process.env.HOT_WALLET_PEM.replace(/\\n/g, '\n').trim());

        this.account = new Account(this.signer.getAddress());
        this.hotWalletNonce = 1;
        this.lastUpdatedTimestamp = 0;
    }

    async syncAccount() {
        const accountOnNetwork = await this.proxyProvider.getAccount(this.account.address);
        this.account.update(accountOnNetwork);
        const currentTimestamp = Date.now();
        if (
            this.hotWalletNonce < accountOnNetwork.nonce
            || currentTimestamp >= this.lastUpdatedTimestamp + WALLET_NONCE_UPDATE_PERIOD
        ) {
            this.hotWalletNonce = accountOnNetwork.nonce;
            this.lastUpdatedTimestamp = currentTimestamp;
        }
    }

    getHotWalletNonceAndIncrease() {
        return this.hotWalletNonce++;
    }
}
