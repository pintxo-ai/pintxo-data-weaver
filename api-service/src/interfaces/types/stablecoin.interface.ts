export interface CirculatingData {
    [key: string]: number;
}

export interface ChainCirculatingDetails {
    current: CirculatingData;
    circulatingPrevDay: CirculatingData;
    circulatingPrevWeek: CirculatingData;
    circulatingPrevMonth: CirculatingData;
}

export interface ChainCirculatingData {
    [chainName: string]: ChainCirculatingDetails;
}

/**
 * @description Represents the data structure for a stablecoin.
 */
export interface StablecoinData {
    id: string;
    name: string;
    symbol: string;
    gecko_id: string;
    pegType: string;
    priceSource: string;
    pegMechanism: string;
    circulating: CirculatingData;
    circulatingPrevDay: CirculatingData;
    circulatingPrevWeek: CirculatingData;
    circulatingPrevMonth: CirculatingData;
    chainCirculating: ChainCirculatingData;
    chains: string[];
    price: number;
}