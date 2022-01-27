# Logging

## Installation

---

`npm i @konso/logging`

## Example

---

```javascript
import { createClient, LogEvents } from "@konso/logging";

let client = createClient({
  apiURL: 'https://devapis.konso.io',
  bucketId: '1fc41560',
  apiKey: 'REa9xeOvk6fRxAcNEyebk+5nC5LnbeCr+bJTBpoLm5E=',
  appName: 'test'
})

client.on(LogEvents.onSuccessful, (text) => { console.log(text) })
  .on(LogEvents.onError, (text) => console.error(text));

client.log('message', 'error')
```

## createClient

createClient - the function takes a parameters object and returns an instance of the Logging class

```typescript
const client = createClient({
  apiKey: 'REa9xeOvk6fRxAcNEyebk+5nC5LnbeCr+bJTBpoLm5E=',
  apiURL: 'https://devapis.konso.io',
  bucketId: '1fc41560',
  appName: 'test'
})
```

| Parameter   | Type   | Required |
|:------------|--------|:---------|
| apiKey      | string | true     |
| apiURL      | string | true     |
| bucketId    | string | true     |
| machineName | string | false    |
| env         | string | false    |
| appName     | string | false    |

## Methods

---

## on

```typescript
on(eventName: LogEvents, callback: (text: string) => void);
```

### Parameters

| Parameter | Type     | Required | Value                                                |
|-----------|----------|----------|------------------------------------------------------|
| eventName | string   | true     | 'onSuccessful', 'onError' or keys of LogEvent object |
| callback  | function | true     | (text: string) => void                               |

## log

```typescript
log(message: MessageTypes, logLevel?: LogLevel | MessageTypes, extraOptions?: ExtraOptions): PromiseLike<void>;
```

### Parameters

| Parameter    | Type                                         | Default | Required | Value                                        |
|--------------|----------------------------------------------|---------|----------|----------------------------------------------|
| message      | string, number, Array<string>, Object, Error |         | true     |                                              |
| logLevel     | string, number, Array<string>, Object, Error |         | false    |                                              |
| extraOptions | Object                                       |         | false    | { eventId?: string, correlationId?: string } |
