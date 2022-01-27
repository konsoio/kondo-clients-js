import { EventEmitter } from 'events';

export type LogOptions = {
    apiKey: string;
    apiURL: string;
    bucketId: string;
    machineName?: string;
    env?: string;
    appName?: string;
}

export type ExtraOptions = {
    eventId?: string;
    correlationId?: string;
}

export enum LogEvents {
    "onSuccessful" = "onSuccessful",
    "onError" = "onError"
}

export type MessageTypes = string | number | Array<string> | Object | Error;

export enum LogLevel {
    "Trace" = 'trace',
    "Debug" = 'debug',
    "Information" = 'information',
    "Warning" = 'warning',
    "Error" = 'error',
    "Critical" = 'critical',
    "None" = 'none'
}

export class Logging extends EventEmitter {
    constructor(options: LogOptions);
    log(message: MessageTypes, logLevel?: LogLevel | MessageTypes, extraOptions?: ExtraOptions): PromiseLike<void>;
    on(eventName: LogEvents, callback: (text: string) => void);
}

export function createClient(options: LogOptions): Logging
