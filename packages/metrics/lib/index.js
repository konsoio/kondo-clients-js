const { hrtime } = require("process");
const { EventEmitter } = require("events");
const fetch = require("node-fetch");
const BigNumber = require('bignumber.js');
const { nanoid } =  require("nanoid");

function createMetricsClient(options) {
    return new Metrics(options)
}

const LogEvents = {
    'onSuccessful': 'onSuccessful',
    'onError': 'onError'
}

class Measurement {
    name;
    startTime;
    endTime;
    hrtimeDuration;
    duration;

    constructor(name) {
        this.name = name;
    }

    start() {
        this.startTime = BigNumber(hrtime.bigint());
    }

    end() {
        this.endTime = BigNumber(hrtime.bigint());
        this.hrtimeDuration = this.endTime.minus(this.startTime);
        this.duration = this.hrtimeDuration.dividedBy(1e6)
        return this;
    }

    toJSON() {
        return {
            name: this.name,
            startTime: this.startTime.toNumber(),
            endTime: this.endTime.toNumber(),
            hrtimeDuration: this.hrtimeDuration.toNumber(),
            duration: this.duration.toNumber()
        }
    }

}


class Metrics extends EventEmitter{
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

        for (let extraOption of ['tags', 'appName']) {
            if (extraOption in config) {
                this.baseGlobalOptions[extraOption] = config[extraOption]
            }
        }

        this.requestURL = [this.baseConfig.apiURL, "v1/metrics", this.baseConfig.bucketId].join("/");
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

    get measurementsCount () {
        return Object.keys(this.measurements).length;
    }


    startMeasure(name) {
        if(!name) throw new Error('You should specify the name of measurement');
        let id = nanoid(4);
        this.measurements[id] = new Measurement(name);
        this.measurements[id].start();

        return (extraOptions) => {
            this.endMeasure(id, extraOptions);
        }
    }

    endMeasure(name, extraOptions) {
        if(!name) throw new Error('You should specify the name of measurement');
        if(!(name in this.measurements)) {
            throw new Error('You should run startMeasure at first');
        }

        let measure = this.measurements[name].end()
        this.sendMeasure(measure.toJSON(), extraOptions);
    }

    getMeasure(name) {
        if(!name) throw new Error('You should specify the name of measurement');
        return this.measurements[name];
    }

    async sendMeasure(measure, extraOptions = {}) {
        let preparedExtraOptions = {};
        // add validator

        for(let extra of ['tags', 'correlationId', 'responseCode']) {
            if(extra in extraOptions) {
                preparedExtraOptions[extra] = extraOptions[extra]
            }
        }

        let logRequestBody = {
            name: measure.name,
            duration: measure.duration,
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
            delete this.measurements[measure.name];
            //TODO: add function for building log request
            this.emit(LogEvents.onSuccessful, `${new Date(logRequestBody.timeStamp * 1000).toISOString()} - ${logRequestBody.name} - ${logRequestBody.duration}ms with ${logRequestBody.responseCode}`)
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
    createMetricsClient,
    LogEvents
}