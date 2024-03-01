export interface ProtocolEntry {
    id: string;
    name: string;
    description?: string;
    address?: string;
    symbol?: string;
    url?: string;
    chain?: string;
    gecko_id?: string;
    cmcId?: string;
    category?: string;
    chains?: string[];
    treasury?: string;
    twitter?: string;
    oracles?: string[];
    github?: string[];
    tvl?: number;
    chainTvls?: object;
    change_1h?: number;
    change_1d?: number;
    change_7d?: number;
    tokenBreakdowns?: object;
    mcap?: number;
  }