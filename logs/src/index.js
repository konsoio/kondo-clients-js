//TODO: add types

import fetch from "node-fetch";
import { EventEmitter } from "events";
import { isError } from "./helpers.js";

export function createClient (options) {
    return new Logs(options)
}

export const LogEvents = {
    'onSuccessful': 'onSuccessful',
    'onError': 'onError'
}

export const LogLevel = {
    "Trace": 0,
    "Debug": 1,
    "Information": 2,
    "Warning": 3,
    "Error": 4,
    "Critical": 5,
    "None": 6
}


class Logs extends EventEmitter {
    baseConfig = {};
    baseGlobalOptions = {};
    baseRequestHeaders = {};
    requestURL;
    
    constructor(config) {
        if(!config ||!config.apiKey || !config.apiURL || !config.bucketId) {
            throw new Error("You should provide: apiKey, apiURL, bucketID");
        }

        super();

        for(let configEntry of ['apiKey', 'apiURL', 'bucketId']) {
            this.baseConfig[configEntry] = config[configEntry]
        }

        for(let extraOption of ['machineName', 'env', 'appName' ]) {
            if(extraOption in config) {
                this.baseGlobalOptions[extraOption] = config[extraOption]
            }
        }

        this.requestURL = [this.baseConfig.apiURL, "v1/logs", this.baseConfig.bucketId ].join("/");
        this.baseRequestHeaders = {
            'x-api-key': this.baseConfig.apiKey
        }

        return this;
    }

    getConfiguration() {
        return {
            baseConfig: {...this.baseConfig},
            baseGlobalOptions: {...this.baseGlobalOptions},
            baseRequestHeaders: {...this.baseRequestHeaders},
            requestURL: this.requestURL
        }
    }

    prepareMessage(message) {
        if(typeof message === 'object') {

            if(isError(message)) {
                return `ERROR: ${message.message}`
            }

            return JSON.stringify(message)
        }
        if(typeof message === 'string' || typeof message === "number") {
            return message;
        }
    }

    async log(message, logLevel = "trace", extraOptions = {}) {
        if(typeof logLevel === "object") {
            extraOptions = logLevel;
            logLevel = 'trace';
        }
        let preparedMessage = this.prepareMessage(message);
        let preparedExtraOptions = {};

        for(let extra of ['eventId', 'correlationId']) {
            if(extra in extraOptions) {
                preparedExtraOptions[extra] = extraOptions[extra]
            }
        }
        
        let logRequestBody = {
            message: preparedMessage,
            level: logLevel,
            timeStamp: Math.round(+new Date()/1000),
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
            //TODO: add function for building log request
            this.emit(LogEvents.onSuccessful, `${new Date(logRequestBody.timeStamp).toISOString()} - ${logRequestBody.level} - ${logRequestBody.message}`)
        } catch (error) {
            //TODO: add custom Error function for describe errors
            this.emit(LogEvents.onError, `ERROR: ${error.message} / ${error.response}`)
        }
        
    }

    async callAPIGateway(requestURL, requestOptions) {
        try {
            let res = await fetch(requestURL, requestOptions);
            if(!res.ok) {
                let error = new Error(res.statusText);
                error.response = res;
                throw error;
            }
        } catch (error) {
            throw error;
        }
    }
}
