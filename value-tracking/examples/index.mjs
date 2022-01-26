import express from 'express';
import { createValueTrackingClient, LogEvents } from "../../value-tracking/src/index.js";

let tracker = createValueTrackingClient({
    apiURL: 'https://devapis.konso.io',
    bucketId: '1fc41560',
    apiKey: 'REa9xeOvk6fRxAcNEyebk+5nC5LnbeCr+bJTBpoLm5E=',
    appName: 'test',
})

tracker.on(LogEvents.onError, (error) => console.log(error));
tracker.on(LogEvents.onSuccessful, (message) => console.log(message));


function trackerMiddleware(client) {
  if (!client) {
    throw new Error('you should provide client for value-tracking')
  }

  return function (req, res, next) {
    client.track(10, { ip: req.ip, browser: req.headers['user-agent']})
    next();
  }
}

const app = express();
const port = 3000;

app.use(trackerMiddleware(tracker));

app.get('/', async (req, res) => {
  // await sleep(1200);
  res.send('Hello World!')
})

app.get('/get-data', async (req, res) => {
  // await sleep(Math.ceil(Math.random() + 1 * 1000))
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
