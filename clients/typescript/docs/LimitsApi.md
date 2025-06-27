# LimitsApi

All URIs are relative to *https://smoketree.kwila.cloud*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getLimitsGetAll**](#getlimitsgetall) | **GET** /api/v1/limits | Get All Monthly Limits|
|[**getLimitsGetByMonth**](#getlimitsgetbymonth) | **GET** /api/v1/limits/{month} | Get Monthly Limit by Month|
|[**putLimitsPut**](#putlimitsput) | **PUT** /api/v1/limits/{month} | Set Monthly Limit (Admin Only)|

# **getLimitsGetAll**
> Array<GetLimitsGetAll200ResponseInner> getLimitsGetAll()


### Example

```typescript
import {
    LimitsApi,
    Configuration
} from 'smoketree-ts';

const configuration = new Configuration();
const apiInstance = new LimitsApi(configuration);

const { status, data } = await apiInstance.getLimitsGetAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<GetLimitsGetAll200ResponseInner>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Monthly limits |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getLimitsGetByMonth**
> GetLimitsGetAll200ResponseInner getLimitsGetByMonth()


### Example

```typescript
import {
    LimitsApi,
    Configuration
} from 'smoketree-ts';

const configuration = new Configuration();
const apiInstance = new LimitsApi(configuration);

let month: string; // (default to undefined)

const { status, data } = await apiInstance.getLimitsGetByMonth(
    month
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **month** | [**string**] |  | defaults to undefined|


### Return type

**GetLimitsGetAll200ResponseInner**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Monthly limit |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **putLimitsPut**
> GetLimitsGetAll200ResponseInner putLimitsPut()


### Example

```typescript
import {
    LimitsApi,
    Configuration,
    PutLimitsPutRequest
} from 'smoketree-ts';

const configuration = new Configuration();
const apiInstance = new LimitsApi(configuration);

let month: string; // (default to undefined)
let putLimitsPutRequest: PutLimitsPutRequest; // (optional)

const { status, data } = await apiInstance.putLimitsPut(
    month,
    putLimitsPutRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **putLimitsPutRequest** | **PutLimitsPutRequest**|  | |
| **month** | [**string**] |  | defaults to undefined|


### Return type

**GetLimitsGetAll200ResponseInner**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Limit updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

