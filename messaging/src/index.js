import { EventEmitter  } from "events";
import fetch from "node-fetch";

export function createMessagingClient(options) {
    return new Messaging(options)
}

export const LogEvents = {
    'onSuccessful': 'onSuccessful',
    'onError': 'onError'
}

class Messaging extends EventEmitter {
    baseConfig = {};
    baseGlobalOptions = {};
    baseRequestHeaders = {};
    requestURL;
    measurements = {};

    constructor(config) {

        super();
        if (!config || !config.apiKey || !config.apiURL || !config.bucketId) {
            throw new Error("You should provide: apiKey, apiURL, bucketID");
        }

        for (let configEntry of ['apiKey', 'apiURL', 'bucketId']) {
            this.baseConfig[configEntry] = config[configEntry]
        }

        for (let extraOption of ['tags', 'env', 'appName']) {
            if (extraOption in config) {
                this.baseGlobalOptions[extraOption] = config[extraOption]
            }
        }

        this.requestURL = [this.baseConfig.apiURL, "v1/messaging", this.baseConfig.bucketId].join("/");
        this.baseRequestHeaders = {
            'x-api-key': this.baseConfig.apiKey
        }

        return this;

    }

    getConfiguration() {
        return {
            baseConfig: { ...this.baseConfig },
            baseGlobalOptions: { ...this.baseGlobalOptions },
            baseRequestHeaders: { ...this.baseRequestHeaders },
            requestURL: this.requestURL
        }
    }

    async sendMessage(extraOptions = {}) {
        let preparedExtraOptions = {};

        for(let extra of ['recipients', 'messageType', 'subject', 'plainBase64Body', 'htmlBase64Body', 'delay', 'tags', 'correlationId']) {
            if(extra in extraOptions) {
                preparedExtraOptions[extra] = extraOptions[extra]
            }
        }

        let logRequestBody = {
            timeStamp: Math.floor(Date.now() / 1000),
            ...this.baseGlobalOptions,
            ...preparedExtraOptions,
        }

        let requestOptions = {
            headers: this.baseRequestHeaders,
            method: 'POST',
            body: JSON.stringify(logRequestBody)
        }

        try {
            await this.callAPIGateway(this.requestURL, requestOptions);
            this.emit(LogEvents.onSuccessful, `${new Date(logRequestBody.timeStamp * 1000).toISOString()} message ${logRequestBody.messageType} sent`)
        } catch (error) {
            this.emit(LogEvents.onError, `ERROR: ${error.message} / ${error.response ? error.response : ""}`)
        }


    }

    async callAPIGateway(requestURL, requestOptions) {
        try {
            let res = await fetch(requestURL, requestOptions);
            if(!res.ok) {
                let error = new Error(res.statusText);
                if(res.headers.get('content-type') && res.headers.get('content-type').includes('application/json')) {
                    let resJSON = await res.json();
                    let errorsFromServer = [...resJSON['errors'], ...resJSON['validationErrors']].map(err => err.message).join('\n');
                    error.response = errorsFromServer;
                }
                
                throw error;
            }
        } catch (error) {
            throw error;
        }
    }
}