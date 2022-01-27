# value-tracking

## Installation

---

`npm i @konso/value-tracking`

## Example

---

```javascript
import { createValueTrackingClient, LogEvents } from "@konso/value-tracking";

const tracker = createValueTrackingClient({
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

app.use(trackerMiddleware(tracker));
```

## createValueTrackingClient

createValueTrackingClient - the function takes a parameters object and returns an instance of the ValueTracking class

```typescript
const tracker = createValueTrackingClient({
  apiURL: 'https://devapis.konso.io',
  bucketId: '1fc41560',
  apiKey: 'REa9xeOvk6fRxAcNEyebk+5nC5LnbeCr+bJTBpoLm5E=',
  appName: 'test',
})
```

| Parameter | Type     | Required |
|:----------|----------|:---------|
| apiKey    | string   | true     |
| apiURL    | string   | true     |
| bucketId  | string   | true     |
| appName   | string   | false    |

## Methods

---

## track

```typescript
track(eventId: string, extraOptions: ValueTrackingExtraOptions)
```

### Parameters

| Parameter    | Type   | Required | Value                                                                                                                                                     |
|--------------|--------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| eventId      | string | true     |                                                                                                                                                           |
| extraOptions | Object | true     | {<br/>correlationId?: string,<br/>value?: string,<br/>custom?: string,<br/>ip?: string,<br/>browser?: string,<br/>user?: string,<br/>owner?: string<br/>} |

## on

```typescript
on(eventName: LogEvents, callback: (text: string) => void);
```

### Parameters

| Parameter | Type     | Required | Value                                                |
|-----------|----------|----------|------------------------------------------------------|
| eventName | string   | true     | 'onSuccessful', 'onError' or keys of LogEvent object |
| callback  | function | true     | (text: string) => void                               |
