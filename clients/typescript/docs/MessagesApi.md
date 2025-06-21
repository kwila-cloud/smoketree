# MessagesApi

All URIs are relative to *https://smoketree.kwila.cloud/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getMessageFetch**](#getmessagefetch) | **GET** /api/v1/messages/{messageUuid} | Get Message Status|
|[**getMessageList**](#getmessagelist) | **GET** /api/v1/messages | List Messages|
|[**postMessageCreate**](#postmessagecreate) | **POST** /api/v1/messages | Send SMS Messages|
|[**postMessageRetry**](#postmessageretry) | **POST** /api/v1/messages/{messageUuid}/retry | Retry Message|

# **getMessageFetch**
> GetMessageList200ResponseMessagesInner getMessageFetch()


### Example

```typescript
import {
    MessagesApi,
    Configuration
} from 'smoketree';

const configuration = new Configuration();
const apiInstance = new MessagesApi(configuration);

let messageUuid: string; // (default to undefined)

const { status, data } = await apiInstance.getMessageFetch(
    messageUuid
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **messageUuid** | [**string**] |  | defaults to undefined|


### Return type

**GetMessageList200ResponseMessagesInner**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Message status |  -  |
|**404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMessageList**
> GetMessageList200Response getMessageList()


### Example

```typescript
import {
    MessagesApi,
    Configuration
} from 'smoketree';

const configuration = new Configuration();
const apiInstance = new MessagesApi(configuration);

let status: string; // (optional) (default to undefined)
let limit: number; // (optional) (default to 50)
let offset: number; // (optional) (default to 0)

const { status, data } = await apiInstance.getMessageList(
    status,
    limit,
    offset
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **status** | [**string**] |  | (optional) defaults to undefined|
| **limit** | [**number**] |  | (optional) defaults to 50|
| **offset** | [**number**] |  | (optional) defaults to 0|


### Return type

**GetMessageList200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of messages |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **postMessageCreate**
> PostMessageCreate200Response postMessageCreate()


### Example

```typescript
import {
    MessagesApi,
    Configuration,
    PostMessageCreateRequest
} from 'smoketree';

const configuration = new Configuration();
const apiInstance = new MessagesApi(configuration);

let postMessageCreateRequest: PostMessageCreateRequest; // (optional)

const { status, data } = await apiInstance.postMessageCreate(
    postMessageCreateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postMessageCreateRequest** | **PostMessageCreateRequest**|  | |


### Return type

**PostMessageCreate200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Messages created |  -  |
|**429** | Rate limited |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **postMessageRetry**
> GetMessageList200ResponseMessagesInner postMessageRetry()


### Example

```typescript
import {
    MessagesApi,
    Configuration
} from 'smoketree';

const configuration = new Configuration();
const apiInstance = new MessagesApi(configuration);

let messageUuid: string; // (default to undefined)

const { status, data } = await apiInstance.postMessageRetry(
    messageUuid
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **messageUuid** | [**string**] |  | defaults to undefined|


### Return type

**GetMessageList200ResponseMessagesInner**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Message retried |  -  |
|**404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

