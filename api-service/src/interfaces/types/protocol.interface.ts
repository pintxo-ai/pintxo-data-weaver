/**
 * @description Represents the data structure for a single protocol.
 */
export interface ProtocolData {
    id: string;
    name: string;
    address?: string;
    symbol?: string;
    url?: string;
    description?: string;
    chain?: string;
    gecko_id?: string;
    cmcId?: string;
    category?: string;
    chains?: string[];
    twitter?: string;
    tvl?: number;
    chainTvls?: object;
    change_1h?: number;
    change_1d?: number;
    change_7d?: number;
    mcap?: number;
  }