import { EventEmitter } from 'events';

export enum LogEvents {
    "onSuccessful" = "onSuccessful",
    "onError" = "onError"
}

export enum MessageTypes {
    Email = 1,
    SMS = 2,
    Push = 3
}

export type MessagingExtraOptions = {
    recepients: Array<string>;
    messageType: MessageTypes
    subject?: string;
    plainBase64Body?: string;
    htmlBase64Body?: string;
    delay?: number;
    tags?: Array<string>;
    correlationId?: string;
}

export class Messaging extends EventEmitter{
    sendMessage(extraOptions: MessagingExtraOptions): Promise<void>
}


export type MessagingOptions = {
    apiKey: string;
    apiURL: string;
    bucketId: string;
    appName?: string;
    env?: string;
    tags?: Array<string>;
}

export function createMessagingClient(options: MessagingOptions) : Messaging;