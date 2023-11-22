export interface NetworkType {
    id: string,
    chainId: string,
    apiAddress: string;
    gatewayAddress: string;
    explorerAddress: string;
    apiTimeout: number;
}

export const networkConfigs: Record<string, NetworkType> = {
    devnet: {
        id: 'devnet',
        chainId: 'D',
        apiAddress: 'https://devnet-api.multiversx.com',
        gatewayAddress: 'https://devnet-gateway.multiversx.com',
        explorerAddress: 'https://devnet-explorer.multiversx.com',
        apiTimeout: 10000,
    },
    
    testnet: {
        id: 'testnet',
        chainId: 'T',
        apiAddress: 'https://testnet-api.multiversx.com',
        gatewayAddress: 'https://testnet-gateway.multiversx.com',
        explorerAddress: 'https://testnet-explorer.multiversx.com',
        apiTimeout: 10000,
    },
    
    mainnet: {
        id: 'mainnet',
        chainId: '1',
        apiAddress: 'https://api.multiversx.com',
        gatewayAddress: 'https://gateway.multiversx.com',
        explorerAddress: 'https://explorer.multiversx.com',
        apiTimeout: 10000,
    },
};
