import { EventEmitter } from "events";

export enum LogEvents {
    "onSuccessful" = "onSuccessful",
    "onError" = "onError"
}

export type Owner = {
    avatar?: string;
    userName?: string;
};

export type ValueTrackingExtraOptions = {
    correlationId?: string;
    value?: string;
    custom?: string;
    ip?: string;
    browser?: string;
    user?: string;
    owner?: string;
};

export class ValueTracking extends EventEmitter {
    track(
        eventId: string,
        extraOptions: ValueTrackingExtraOptions
    ): Promise<void>;
}

export type ValueTrackingOptions = {
    apiKey: string;
    apiURL: string;
    bucketId: string;
    appName?: string;
};

export function createValueTrackingClient(
    options: ValueTrackingOptions
): ValueTracking;
