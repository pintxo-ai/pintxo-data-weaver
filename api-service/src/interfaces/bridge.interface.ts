export interface BridgeData {
    id: number;
    name: string;
    displayName: string;
    volumePrevDay: number;
    volumePrev2Day: number;
    lastHourlyVolume: number;
    currentDayVolume: number;
    lastDailyVolume: number;
    dayBeforeLastVolume: number;
    weeklyVolume: number;
    monthlyVolume: number;
    chains: string[];
}