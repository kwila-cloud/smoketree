## smoketree@0.0.1

This generator creates TypeScript/JavaScript client that utilizes [axios](https://github.com/axios/axios). The generated Node module can be used in the following environments:

Environment
* Node.js
* Webpack
* Browserify

Language level
* ES5 - you must have a Promises/A+ library installed
* ES6

Module system
* CommonJS
* ES6 module system

It can be used in both TypeScript and JavaScript. In TypeScript, the definition will be automatically resolved via `package.json`. ([Reference](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html))

### Building

To build and compile the typescript sources to javascript use:
```
npm install
npm run build
```

### Publishing

First build the package then run `npm publish`

### Consuming

navigate to the folder of your consuming project and run one of the following commands.

_published:_

```
npm install smoketree@0.0.1 --save
```

_unPublished (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE --save
```

### Documentation for API Endpoints

All URIs are relative to *https://smoketree.kwila.cloud/api/v1*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*LimitsApi* | [**getLimitsGetAll**](docs/LimitsApi.md#getlimitsgetall) | **GET** /api/v1/limits | Get All Monthly Limits
*LimitsApi* | [**getLimitsGetByMonth**](docs/LimitsApi.md#getlimitsgetbymonth) | **GET** /api/v1/limits/{month} | Get Monthly Limit by Month
*LimitsApi* | [**putLimitsPut**](docs/LimitsApi.md#putlimitsput) | **PUT** /api/v1/limits/{month} | Set Monthly Limit (Admin Only)
*MessagesApi* | [**getMessageFetch**](docs/MessagesApi.md#getmessagefetch) | **GET** /api/v1/messages/{messageUuid} | Get Message Status
*MessagesApi* | [**getMessageList**](docs/MessagesApi.md#getmessagelist) | **GET** /api/v1/messages | List Messages
*MessagesApi* | [**postMessageCreate**](docs/MessagesApi.md#postmessagecreate) | **POST** /api/v1/messages | Send SMS Messages
*MessagesApi* | [**postMessageRetry**](docs/MessagesApi.md#postmessageretry) | **POST** /api/v1/messages/{messageUuid}/retry | Retry Message
*UsageApi* | [**getUsageStatsGetAll**](docs/UsageApi.md#getusagestatsgetall) | **GET** /api/v1/usage | Get All Usage Statistics
*UsageApi* | [**getUsageStatsGetByMonth**](docs/UsageApi.md#getusagestatsgetbymonth) | **GET** /api/v1/usage/{month} | Get Usage Statistics by Month


### Documentation For Models

 - [GetLimitsGetAll200ResponseInner](docs/GetLimitsGetAll200ResponseInner.md)
 - [GetMessageFetch404Response](docs/GetMessageFetch404Response.md)
 - [GetMessageList200Response](docs/GetMessageList200Response.md)
 - [GetMessageList200ResponseMessagesInner](docs/GetMessageList200ResponseMessagesInner.md)
 - [GetUsageStatsGetAll200ResponseInner](docs/GetUsageStatsGetAll200ResponseInner.md)
 - [PostMessageCreate200Response](docs/PostMessageCreate200Response.md)
 - [PostMessageCreate200ResponseResultsInner](docs/PostMessageCreate200ResponseResultsInner.md)
 - [PostMessageCreate429Response](docs/PostMessageCreate429Response.md)
 - [PostMessageCreateRequest](docs/PostMessageCreateRequest.md)
 - [PostMessageCreateRequestMessagesInner](docs/PostMessageCreateRequestMessagesInner.md)
 - [PutLimitsPutRequest](docs/PutLimitsPutRequest.md)


<a id="documentation-for-authorization"></a>
## Documentation For Authorization

Endpoints do not require authorization.

