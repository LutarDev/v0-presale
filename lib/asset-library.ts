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
      'ethereum',
      'bnb',
      'solana',
      'ton',
      'tron',
      'lutar',
      'lutar-white',
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
