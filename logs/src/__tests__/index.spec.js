
import { createClient, LogEvents } from "../index";
import { jest } from "@jest/globals";

let dateNowSpy;

beforeAll(() => {
    // Lock Time
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1487076708000);
});

describe('create log client', () => {
    test('create client without params', () => {
        expect(() => createClient()).toThrow("You should provide: apiKey, apiURL, bucketID");
    })

    test('create client without key params 1', () => {
        expect(() => createClient({ apiKey: 'test-api-key', apiURL: 'http://google.com' })).toThrow("You should provide: apiKey, apiURL, bucketID")
    })

    test('create client without key params 2', () => {
        expect(() => createClient({ apiKey: 'test-api-key', bucketId: '234234' })).toThrow("You should provide: apiKey, apiURL, bucketID")
    })

    test('create client without key params 3', () => {
        expect(() => createClient({ apiKey: 'test-api-key', apiURL: '234234' })).toThrow("You should provide: apiKey, apiURL, bucketID")
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
            requestURL: 'http://dev.test.io/v1/logs/bubletea'
        }

        let testClient = createClient(baseParams);

        expect(testClient.getConfiguration()).toEqual(expectedConfiguration)
    })

    test('create client with extra data', () => {
        let baseParams = {
            apiKey: 'thisislongapikey',
            apiURL: 'http://dev.test.io',
            bucketId: 'bubletea',
            machineName: "macbook-test",
            env: 'test-env',
            appName: 'jest-test'
        }

        let expectedConfiguration = {
            baseConfig: {
                apiKey: 'thisislongapikey',
                apiURL: 'http://dev.test.io',
                bucketId: 'bubletea'
            },
            baseGlobalOptions: {
                machineName: 'macbook-test',
                env: 'test-env',
                appName: 'jest-test'
            },
            baseRequestHeaders: {
                'x-api-key': baseParams.apiKey
            },
            requestURL: 'http://dev.test.io/v1/logs/bubletea'
        }

        let testClient = createClient(baseParams);

        expect(testClient.getConfiguration()).toEqual(expectedConfiguration)
    })
})

describe('log client', () => {
    describe('create simple logs', () => {
        beforeAll(() => {
            // Lock Time
            dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1487076708000);
        });

        test('test request parameters', async () => {
            let baseParams = {
                apiKey: '7ssM82TsSUA2AMCBnNl64If6pfxRrihtKVpmvfZz0mI=',
                apiURL: 'https://konso-apim-dev.azure-api.net',
                bucketId: '9cdcfbcd'
            }

            let testClient = createClient(baseParams)

            let spyOncallAPIGateway = jest.spyOn(testClient, 'callAPIGateway').mockResolvedValue("ok");

            await testClient.log("hey from tests!");

            expect(spyOncallAPIGateway).lastCalledWith("https://konso-apim-dev.azure-api.net/v1/logs/9cdcfbcd", {
                headers: {
                    'x-api-key': "7ssM82TsSUA2AMCBnNl64If6pfxRrihtKVpmvfZz0mI="
                },
                method: "POST",
                body: JSON.stringify({ message: "hey from tests!", level: 'trace', timeStamp: 1487076708000 })
            })


            spyOncallAPIGateway.mockRestore();
        })
        test('test successful event', async () => {
            let baseParams = {
                apiKey: '7ssM82TsSUA2AMCBnNl64If6pfxRrihtKVpmvfZz0mI=',
                apiURL: 'https://konso-apim-dev.azure-api.net',
                bucketId: '9cdcfbcd'
            }
            let coolCallback = jest.fn();

            let testClient = createClient(baseParams)
                .on(LogEvents.onSuccessful, coolCallback);

            let spyOncallAPIGateway = jest.spyOn(testClient, 'callAPIGateway').mockResolvedValue("ok");

            await testClient.log("hey from tests!");

            expect(coolCallback).toHaveBeenCalled();
            expect(coolCallback).toHaveBeenCalledWith(`${new Date(1487076708000).toISOString()} - trace - hey from tests!`)

            spyOncallAPIGateway.mockRestore();
        })

        test('test unsuccessful event', async () => {
            let baseParams = {
                apiKey: '7ssM82TsSUA2AMCBnNl64If6pfxRrihtKVpmvfZz0mI=',
                apiURL: 'https://konso-apim-dev.azure-api.net',
                bucketId: '9cdcfbcd'
            }
            let badCallback = jest.fn();

            let testClient = createClient(baseParams)
                .on(LogEvents.onError, badCallback);

            let spyOncallAPIGateway = jest.spyOn(testClient, 'callAPIGateway').mockRejectedValue(new Error("Something went wrong"));

            await testClient.log("hey from tests!");

            expect(badCallback).toHaveBeenCalled();
            expect(badCallback).toHaveBeenCalledWith("Something went wrong")

            spyOncallAPIGateway.mockRestore();
        })
    })

    describe('create logs with complex data', () => {
        beforeAll(() => {
            // Lock Time
            dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1487076708000);
        });

        test('with simple json', async () => {
            let baseParams = {
                apiKey: '7ssM82TsSUA2AMCBnNl64If6pfxRrihtKVpmvfZz0mI=',
                apiURL: 'https://konso-apim-dev.azure-api.net',
                bucketId: '9cdcfbcd'
            }

            let testClient = createClient(baseParams)

            let spyOncallAPIGateway = jest.spyOn(testClient, 'callAPIGateway').mockResolvedValue("ok");

            await testClient.log({ testData: { testInfo: 'data' } });

            expect(spyOncallAPIGateway).lastCalledWith("https://konso-apim-dev.azure-api.net/v1/logs/9cdcfbcd", {
                headers: {
                    'x-api-key': "7ssM82TsSUA2AMCBnNl64If6pfxRrihtKVpmvfZz0mI="
                },
                method: "POST",
                body: JSON.stringify({ message: JSON.stringify({ testData: { testInfo: 'data' } }), level: 'trace', timeStamp: 1487076708000 })
            })


            spyOncallAPIGateway.mockRestore();
        })
        test('with array', async () => {
            let baseParams = {
                apiKey: '7ssM82TsSUA2AMCBnNl64If6pfxRrihtKVpmvfZz0mI=',
                apiURL: 'https://konso-apim-dev.azure-api.net',
                bucketId: '9cdcfbcd'
            }
            let coolCallback = jest.fn();

            let testClient = createClient(baseParams);

            let spyOncallAPIGateway = jest.spyOn(testClient, 'callAPIGateway').mockResolvedValue("ok");

            const testData = ['some_data', 1, { key: 12 }];


            await testClient.log(testData);


            expect(spyOncallAPIGateway).lastCalledWith("https://konso-apim-dev.azure-api.net/v1/logs/9cdcfbcd", {
                headers: {
                    'x-api-key': "7ssM82TsSUA2AMCBnNl64If6pfxRrihtKVpmvfZz0mI="
                },
                method: "POST",
                body: JSON.stringify({ message: JSON.stringify(testData), level: 'trace', timeStamp: 1487076708000 })
            })

            spyOncallAPIGateway.mockRestore();
        })

        test('with error', async () => {
            let baseParams = {
                apiKey: '7ssM82TsSUA2AMCBnNl64If6pfxRrihtKVpmvfZz0mI=',
                apiURL: 'https://konso-apim-dev.azure-api.net',
                bucketId: '9cdcfbcd'
            }
            let badCallback = jest.fn();

            let testClient = createClient(baseParams)

            let spyOncallAPIGateway = jest.spyOn(testClient, 'callAPIGateway').mockRejectedValue(new Error("Something went wrong"));

            await testClient.log(new Error("Something went wrong"));

            expect(spyOncallAPIGateway).lastCalledWith("https://konso-apim-dev.azure-api.net/v1/logs/9cdcfbcd", {
                headers: {
                    'x-api-key': "7ssM82TsSUA2AMCBnNl64If6pfxRrihtKVpmvfZz0mI="
                },
                method: "POST",
                body: JSON.stringify({ message: 'ERROR: Something went wrong', level: 'trace', timeStamp: 1487076708000 })
            })

            spyOncallAPIGateway.mockRestore();
        })
    })

    describe('create logs with extra parameters', () => {
        test('with needed paramaters', async () => {
            let baseParams = {
                apiKey: '7ssM82TsSUA2AMCBnNl64If6pfxRrihtKVpmvfZz0mI=',
                apiURL: 'https://konso-apim-dev.azure-api.net',
                bucketId: '9cdcfbcd'
            }

            let testClient = createClient(baseParams)

            let spyOncallAPIGateway = jest.spyOn(testClient, 'callAPIGateway').mockResolvedValue("ok");

            await testClient.log("it's me, danny", { eventId: 123, correlationId: 12 });

            expect(spyOncallAPIGateway).lastCalledWith("https://konso-apim-dev.azure-api.net/v1/logs/9cdcfbcd", {
                headers: {
                    'x-api-key': "7ssM82TsSUA2AMCBnNl64If6pfxRrihtKVpmvfZz0mI="
                },
                method: "POST",
                body: JSON.stringify({
                    message: "it's me, danny",
                    level: 'trace',
                    timeStamp: 1487076708000,
                    eventId: 123,
                    correlationId: 12
                })
            })


            spyOncallAPIGateway.mockRestore();

        })

        test('with unnecessary paramaters', async () => {
            let baseParams = {
                apiKey: '7ssM82TsSUA2AMCBnNl64If6pfxRrihtKVpmvfZz0mI=',
                apiURL: 'https://konso-apim-dev.azure-api.net',
                bucketId: '9cdcfbcd'
            }

            let testClient = createClient(baseParams)

            let spyOncallAPIGateway = jest.spyOn(testClient, 'callAPIGateway').mockResolvedValue("ok");

            await testClient.log("it's me, danny", { eventId: 123, correlationId: 12, bossName: 'alex', myAge: 23 });

            expect(spyOncallAPIGateway).lastCalledWith("https://konso-apim-dev.azure-api.net/v1/logs/9cdcfbcd", {
                headers: {
                    'x-api-key': "7ssM82TsSUA2AMCBnNl64If6pfxRrihtKVpmvfZz0mI="
                },
                method: "POST",
                body: JSON.stringify({ 
                    message: "it's me, danny", 
                    level: 'trace', 
                    timeStamp: 1487076708000, 
                    eventId: 123, 
                    correlationId: 12 })
            })


            spyOncallAPIGateway.mockRestore();

        })
    });
});

afterAll(() => {
    // Unlock Time
    dateNowSpy.mockRestore();
});