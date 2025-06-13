# openapi.api.LimitsApi

## Load the API package
```dart
import 'package:openapi/api.dart';
```

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getLimitsGetAll**](LimitsApi.md#getlimitsgetall) | **GET** /api/v1/limits | Get All Monthly Limits
[**getLimitsGetByMonth**](LimitsApi.md#getlimitsgetbymonth) | **GET** /api/v1/limits/{month} | Get Monthly Limit by Month
[**putLimitsPut**](LimitsApi.md#putlimitsput) | **PUT** /api/v1/limits/{month} | Set Monthly Limit (Admin Only)


# **getLimitsGetAll**
> List<GetLimitsGetAll200ResponseInner> getLimitsGetAll()

Get All Monthly Limits

### Example
```dart
import 'package:openapi/api.dart';

final api_instance = LimitsApi();

try {
    final result = api_instance.getLimitsGetAll();
    print(result);
} catch (e) {
    print('Exception when calling LimitsApi->getLimitsGetAll: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**List<GetLimitsGetAll200ResponseInner>**](GetLimitsGetAll200ResponseInner.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getLimitsGetByMonth**
> GetLimitsGetAll200ResponseInner getLimitsGetByMonth(month)

Get Monthly Limit by Month

### Example
```dart
import 'package:openapi/api.dart';

final api_instance = LimitsApi();
final month = month_example; // String | 

try {
    final result = api_instance.getLimitsGetByMonth(month);
    print(result);
} catch (e) {
    print('Exception when calling LimitsApi->getLimitsGetByMonth: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **month** | **String**|  | 

### Return type

[**GetLimitsGetAll200ResponseInner**](GetLimitsGetAll200ResponseInner.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **putLimitsPut**
> GetLimitsGetAll200ResponseInner putLimitsPut(month, putLimitsPutRequest)

Set Monthly Limit (Admin Only)

### Example
```dart
import 'package:openapi/api.dart';

final api_instance = LimitsApi();
final month = month_example; // String | 
final putLimitsPutRequest = PutLimitsPutRequest(); // PutLimitsPutRequest | 

try {
    final result = api_instance.putLimitsPut(month, putLimitsPutRequest);
    print(result);
} catch (e) {
    print('Exception when calling LimitsApi->putLimitsPut: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **month** | **String**|  | 
 **putLimitsPutRequest** | [**PutLimitsPutRequest**](PutLimitsPutRequest.md)|  | [optional] 

### Return type

[**GetLimitsGetAll200ResponseInner**](GetLimitsGetAll200ResponseInner.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

