export interface CirculatingData {
  [key: string]: number;
}

export interface ChainCurrentData {
  current: CirculatingData;
}

export interface ChainCirculatingData {
  [chainName: string]: ChainCurrentData;
}

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