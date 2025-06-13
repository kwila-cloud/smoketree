# UsageApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getUsageStatsGetAll**](#getusagestatsgetall) | **GET** /api/v1/usage | Get All Usage Statistics|
|[**getUsageStatsGetByMonth**](#getusagestatsgetbymonth) | **GET** /api/v1/usage/{month} | Get Usage Statistics by Month|

# **getUsageStatsGetAll**
> Array<GetUsageStatsGetAll200ResponseInner> getUsageStatsGetAll()


### Example

```typescript
import {
    UsageApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsageApi(configuration);

const { status, data } = await apiInstance.getUsageStatsGetAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<GetUsageStatsGetAll200ResponseInner>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | All usage stats |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUsageStatsGetByMonth**
> GetUsageStatsGetAll200ResponseInner getUsageStatsGetByMonth()


### Example

```typescript
import {
    UsageApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsageApi(configuration);

let month: string; // (default to undefined)

const { status, data } = await apiInstance.getUsageStatsGetByMonth(
    month
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **month** | [**string**] |  | defaults to undefined|


### Return type

**GetUsageStatsGetAll200ResponseInner**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Usage stats for a specific month |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

