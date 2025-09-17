import React from 'react';
import { Icon } from '../ui/icon';
import { IconName } from '../../lib/asset-types';

interface BlockchainFilterOption {
  id: string;
  name: string;
  icon: IconName;
  description: string;
}

const mockBlockchainFilters: BlockchainFilterOption[] = [
  { id: 'all-chains', name: 'All Chains', icon: 'all-chains', description: 'Show all supported blockchains' },
  { id: 'evm', name: 'EVM', icon: 'evm', description: 'Ethereum Virtual Machine compatible chains' },
  { id: 'layer-2', name: 'Layer 2', icon: 'layer-2', description: 'Layer 2 scaling solutions' },
  { id: 'non-evm', name: 'Non-EVM', icon: 'non-evm', description: 'Non-EVM compatible chains' },
  { id: 'popular', name: 'Popular', icon: 'popular', description: 'Most popular blockchains' },
  { id: 'promo', name: 'Promo', icon: 'promo', description: 'Promotional offers' },
];

interface BlockchainFilterProps {
  onSelectFilter: (filterId: string) => void;
  selectedFilterId?: string;
}

const BlockchainFilter: React.FC<BlockchainFilterProps> = ({ onSelectFilter, selectedFilterId }) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Filter by Blockchain</h3>
      <div className="grid grid-cols-2 gap-4">
        {mockBlockchainFilters.map((filter) => (
          <button
            key={filter.id}
            className={`flex items-center justify-center p-3 rounded-md border transition-all duration-200
              ${selectedFilterId === filter.id
                ? 'border-primary-500 bg-primary-900'
                : 'border-gray-700 hover:border-gray-600 hover:bg-gray-700'
              }`}
            onClick={() => onSelectFilter(filter.id)}
          >
            <Icon name={filter.icon} size={32} className="mr-2" />
            <span className="text-white text-sm">{filter.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export { BlockchainFilter };
