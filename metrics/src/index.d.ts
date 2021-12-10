import { EventEmitter } from 'events';


export type MetricsOptions = {
    apiKey: string;
    apiURL: string;
    bucketId: string;
    appName?: string;
    tags?: string[];
}

export type MetricsExtraOptions = {
    tags?: string[];
    correlationId?: string;
    responseCode?: number;
}

export class Metrics extends EventEmitter {
    constructor(options: MetricsOptions);
    startMeasure(name: string) : (extraOptions: MetricsExtraOptions) => void;
    on(eventName: LogEvents, callback: (text: string) => void);
}

export function createMetricsClient(options: MetricsOptions) : Metrics;