import { createMessagingClient, LogEvents } from "../../messaging/src/index.js";

let client = createMessagingClient({
    apiURL: 'https://devapis.konso.io',
    bucketId: '1fc41560',
    apiKey: 'REa9xeOvk6fRxAcNEyebk+5nC5LnbeCr+bJTBpoLm5E=',
    appName: 'test'
})

client.on(LogEvents.onSuccessful, (text) => { console.log(text) })
    .on(LogEvents.onError, (text) => console.error(text));

client.sendMessage({ 
    recepients: [ 'alex.lvovich@indevalbs.de'],
    messageType: 1
})