import { expect, jest } from "@jest/globals";
import { createMetricsClient } from "./index";

describe("client", () => {
    test('create client without params', () => {
        expect(() => createMetricsClient()).toThrow('You should provide: apiKey, apiURL, bucketID')
    })

    test('create client without key params 1', () => {
        expect(() => createMetricsClient({ apiKey: 'test-api-key', apiURL: 'http://google.com' })).toThrow("You should provide: apiKey, apiURL, bucketID")
    })

    test('create client without key params 2', () => {
        expect(() => createMetricsClient({ apiKey: 'test-api-key', bucketId: '234234' })).toThrow("You should provide: apiKey, apiURL, bucketID")
    })

    test('create client without key params 3', () => {
        expect(() => createMetricsClient({ apiKey: 'test-api-key', apiURL: '234234' })).toThrow("You should provide: apiKey, apiURL, bucketID")
    })

    test('create client with base params', () => {
        let baseParams = {
            apiKey: 'thisislongapikey',
            apiURL: 'http://dev.test.io',
            bucketId: 'bubletea'
        }

        let expectedConfiguration = {
            baseConfig: { ...baseParams },
            baseGlobalOptions: {},
            baseRequestHeaders: {
                'x-api-key': baseParams.apiKey
            },
            requestURL: 'http://dev.test.io/v1/metrics/bubletea'
        }

        let testClient = createMetricsClient(baseParams);

        expect(testClient.getConfiguration()).toEqual(expectedConfiguration)
    })

    test('create client with extra data', () => {
        let baseParams = {
            apiKey: 'thisislongapikey',
            apiURL: 'http://dev.test.io',
            bucketId: 'bubletea',
            appName: 'jest-test',
            tags: ['test']
        }

        let expectedConfiguration = {
            baseConfig: {
                apiKey: 'thisislongapikey',
                apiURL: 'http://dev.test.io',
                bucketId: 'bubletea'
            },
            baseGlobalOptions: {
                appName: 'jest-test',
                tags: ['test']
            },
            baseRequestHeaders: {
                'x-api-key': baseParams.apiKey
            },
            requestURL: 'http://dev.test.io/v1/metrics/bubletea'
        }

        let testClient = createMetricsClient(baseParams);

        expect(testClient.getConfiguration()).toEqual(expectedConfiguration)
    })
})

describe("measurements", () => {
    test('test measurements save', () => {
        let client = createMetricsClient({
            apiKey: 'thisislongapikey',
            apiURL: 'http://dev.test.io',
            bucketId: 'bubletea'
        });

        let expectedMeasure = {
            name: 'test-measure',
            duration: 0.01,
            hrtimeDuration: 0,
            startTime: 13400000,
            endTime: 1350000
        }

        client.startMeasure('test-measure');
        client.endMeasure('test-measure');

        let realMeasure = client.getMeasure('test-measure').toJSON();
        let realMeasureKeys = Object.keys(realMeasure);
        let expectedMeasureKeys = Object.keys(expectedMeasure);

        expect(client.measurementsCount).toBe(1)
        expect(realMeasureKeys.sort()).toMatchObject(expectedMeasureKeys.sort());
        expect(realMeasure.name).toEqual("test-measure");
    })
})