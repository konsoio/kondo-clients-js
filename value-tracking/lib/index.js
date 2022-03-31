const { EventEmitter  } = require("events");
const fetch = require("node-fetch");

function createValueTrackingClient(options) {
    return new ValueTracking(options)
}

const LogEvents = {
    'onSuccessful': 'onSuccessful',
    'onError': 'onError'
}


class ValueTracking extends EventEmitter {
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

        for (let extraOption of ['currency', 'custom', 'appName']) {
            if (extraOption in config) {
                this.baseGlobalOptions[extraOption] = config[extraOption]
            }
        }

        this.requestURL = [this.baseConfig.apiURL, "v1/value_tracking", this.baseConfig.bucketId].join("/");
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

    async track(eventId, extraOptions = {}) {
        let preparedExtraOptions = {};
        // add validator

        for(let extra of ['correlationId', 'value', 'custom', 'ip', 'browser', 'owner']) {
            if(extra in extraOptions) {
                preparedExtraOptions[extra] = extraOptions[extra]
            }
        }

        let logRequestBody = {
            eventId,
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
            // delete this.measurements[measure.name];
            //TODO: add function for building log request
            this.emit(LogEvents.onSuccessful, `${new Date(logRequestBody.timeStamp * 1000).toISOString()} - ${logRequestBody.eventId}`)
        } catch (error) {
            //TODO: add custom Error function for describe errors
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

module.exports = {
    createValueTrackingClient,
    LogEvents
}
