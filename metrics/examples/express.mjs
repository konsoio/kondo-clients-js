import express from 'express';
import { createMetricsClient, LogEvents } from "../";

const client = createMetricsClient({
    apiURL: 'https://devapis.konso.io',
    bucketId: '1fc41560',
    apiKey: 'REa9xeOvk6fRxAcNEyebk+5nC5LnbeCr+bJTBpoLm5E=',
    appName: 'test'
})

client.on(LogEvents.onSuccessful, (text) => { console.log(text) })
    .on(LogEvents.onError, (text) => console.error(text));


const app = express();
const port = 3000;

function metricExpressMiddleware(client) {
    if (!client) {
        throw new Error('you should provide client for metrics')
    }

    return function (req, res, next) {
        let endMeasure = client.startMeasure(`${req.method} ${req.path}`);

        res.on("finish", () => {
            endMeasure({ responseCode: res.statusCode, tags: ['client'] });
        });

        next();
    }
}


function sleep(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
    })
}

app.use(metricExpressMiddleware(client));

app.get('/', async (req, res) => {
    // await sleep(1200);
    res.send('Hello World!')
})

app.get('/randomSleep', async (req, res) => {
    await sleep(Math.ceil(Math.random() + 1 * 1000))
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})