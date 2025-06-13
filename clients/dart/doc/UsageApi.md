# openapi.api.UsageApi

## Load the API package
```dart
import 'package:openapi/api.dart';
```

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getUsageStatsGetAll**](UsageApi.md#getusagestatsgetall) | **GET** /api/v1/usage | Get All Usage Statistics
[**getUsageStatsGetByMonth**](UsageApi.md#getusagestatsgetbymonth) | **GET** /api/v1/usage/{month} | Get Usage Statistics by Month


# **getUsageStatsGetAll**
> List<GetUsageStatsGetAll200ResponseInner> getUsageStatsGetAll()

Get All Usage Statistics

### Example
```dart
import 'package:openapi/api.dart';

final api_instance = UsageApi();

try {
    final result = api_instance.getUsageStatsGetAll();
    print(result);
} catch (e) {
    print('Exception when calling UsageApi->getUsageStatsGetAll: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**List<GetUsageStatsGetAll200ResponseInner>**](GetUsageStatsGetAll200ResponseInner.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUsageStatsGetByMonth**
> GetUsageStatsGetAll200ResponseInner getUsageStatsGetByMonth(month)

Get Usage Statistics by Month

### Example
```dart
import 'package:openapi/api.dart';

final api_instance = UsageApi();
final month = month_example; // String | 

try {
    final result = api_instance.getUsageStatsGetByMonth(month);
    print(result);
} catch (e) {
    print('Exception when calling UsageApi->getUsageStatsGetByMonth: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **month** | **String**|  | 

### Return type

[**GetUsageStatsGetAll200ResponseInner**](GetUsageStatsGetAll200ResponseInner.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

