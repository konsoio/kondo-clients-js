import { createClient, LogEvents } from "../lib/index.mjs";

let client = createClient({
    apiURL: 'https://devapis.konso.io',
    bucketId: '1fc41560',
    apiKey: 'REa9xeOvk6fRxAcNEyebk+5nC5LnbeCr+bJTBpoLm5E=',
    appName: 'test'
})

client.on(LogEvents.onSuccessful, (text) => { console.log(text) })
    .on(LogEvents.onError, (text) => console.error(text));

client.log('message', 'error')
