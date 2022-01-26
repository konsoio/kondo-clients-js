# metrics

## Installation

---

`npm i @konso/metrics`

## Example

---

```javascript
import { createMetricsClient, LogEvents } from "@konso/metrics";

const client = createMetricsClient({
  apiURL: 'https://devapis.konso.io',
  bucketId: '1fc41560',
  apiKey: 'REa9xeOvk6fRxAcNEyebk+5nC5LnbeCr+bJTBpoLm5E=',
  appName: 'test'
})

client.on(LogEvents.onSuccessful, (text) => { console.log(text) })
  .on(LogEvents.onError, (text) => console.error(text));


const app = express();

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

app.use(metricExpressMiddleware(client));
```

## createMetricsClient

createMetricsClient - the function takes a parameters object and returns an instance of the Metrics class

```typescript
const client = createMetricsClient({
  apiKey: 'REa9xeOvk6fRxAcNEyebk+5nC5LnbeCr+bJTBpoLm5E=',
  apiURL: 'https://devapis.konso.io',
  bucketId: '1fc41560',
  appName: 'test'
})
```

| Parameter | Type     | Required |
|:----------|----------|:---------|
| apiKey    | string   | true     |
| apiURL    | string   | true     |
| bucketId  | string   | true     |
| appName   | string   | false    |
| tags      | string[] | false    |

## Methods

---

## startMeasure

```typescript
startMeasure(name: string) : (extraOptions: MetricsExtraOptions) => void;
```

###Parameters

| Parameter | Type   | Required | Value |
|-----------|--------|----------|-------|
| name      | string | true     |       |


###Parameters for the returned function

| Parameter    | Type   | Required | Value                                                                              |
|--------------|--------|----------|------------------------------------------------------------------------------------|
| extraOptions | Object | true     | {<br/>tags?: string[],<br/>correlationId?: string,<br/>responseCode?: number<br/>} |


## on

```typescript
on(eventName: LogEvents, callback: (text: string) => void);
```

###Parameters

| Parameter | Type     | Required | Value                                                |
|-----------|----------|----------|------------------------------------------------------|
| eventName | string   | true     | 'onSuccessful', 'onError' or keys of LogEvent object |
| callback  | function | true     | (text: string) => void                               |
