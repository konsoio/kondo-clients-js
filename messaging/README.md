# messaging

## Installation

---

`npm i @konso/messaging`

## Example

---

```javascript
import { createMessagingClient } from "@konso/messaging";

let client = createMessagingClient({
  apiURL: 'https://devapis.konso.io',
  bucketId: '1fc41560',
  apiKey: 'REa9xeOvk6fRxAcNEyebk+5nC5LnbeCr+bJTBpoLm5E=',
  appName: 'test'
})

client.sendMessage({
  recepients: [ 'alex.lvovich@indevalbs.de'],
  messageType: 1
})
```

## createMessagingClient

createMessagingClient - the function takes a parameters object and returns an instance of the Messaging class

```typescript
const client = createMessagingClient({
  apiKey: 'REa9xeOvk6fRxAcNEyebk+5nC5LnbeCr+bJTBpoLm5E=',
  apiURL: 'https://devapis.konso.io',
  bucketId: '1fc41560',
  appName: 'test'
})
```

| Parameter | Type          | Required |
|:----------|---------------|:---------|
| apiKey    | string        | true     |
| apiURL    | string        | true     |
| bucketId  | string        | true     |
| appName   | string        | false    |
| env       | string        | false    |
| tags      | Array<string> | false    |

## Methods

---

## sendMessage

```typescript
sendMessage(extraOptions: MessagingExtraOptions)
```

###params

| Parameter    | Type   | Required | Value                                                                                                                                                                                                                                                        |
|--------------|--------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| extraOptions | Object | true     | {<br/>recepients: Array\<string\>,<br/>messageType: number (1 = Email, 2 = SMS, 3 = Push),<br/>subject?: string,<br/>plainBase64Body?: string,<br/>htmlBase64Body?: string,<br/>delay?: number,<br/>tags?: Array\<string\>,<br/>correlationId?: string<br/>} |
