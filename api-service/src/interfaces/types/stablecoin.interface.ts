export interface CirculatingData {
    [key: string]: number;
}

// interface ChainData {
//     current: { [key: string]: CirculatingData }; // Use a map for dynamic chain names with their circulating data
// }

export interface ChainCirculatingData {
    [chainName: string]: {
      current: CirculatingData;
    };
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