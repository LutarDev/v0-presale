import { IconName } from './asset-types';

export interface AssetLibrary {
  icons: {
    coins: IconName[];
    wallets: IconName[];
    arrows: IconName[];
    checkmarks: IconName[];
    blockchainFilters: IconName[];
  };
}

export const assetLibrary: AssetLibrary = {
  icons: {
    coins: [
      'bitcoin',
      'eth-contrast',
      'bnb',
      'solana',
      'polygon',
      'tether',
      'usd-coin',
      'usdt-ton',
      'usdc-ton',
      'usdt-tron',
      'usdc-tron',
      'usdt-solana',
      'usdc-solana',
      'usdt-polygon',
      'usdc-polygon',
      'usdt-erc20',
      'usdc-erc20',
      'usdt-bep20',
      'usdc-bep20',
      'ton',
      'tron',
      'usdt',
      'usdc',
      'lutar',
    ],
    wallets: [
      'metamask',
      'phantom',
      'tronlink',
      'tonconnect',
      'walletconnect',
    ],
    arrows: [
      'arrow-down-green',
      'arrow-down-grey',
      'arrow-down-white',
      'arrow-up-green',
      'arrow-right-green',
      'arrow-right-white',
      'long-arrow-right-grey',
      'long-arrow-left-black',
    ],
    checkmarks: [
      'checkmark-bold-black',
      'checkmark-thin-black',
      'checkmark-thin-white',
      'failed-checkmark',
    ],
    blockchainFilters: [
      'all-chains',
      'evm',
      'layer-2',
      'non-evm',
      'popular',
      'promo',
    ],
  },
};
