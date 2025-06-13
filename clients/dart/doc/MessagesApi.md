# openapi.api.MessagesApi

## Load the API package
```dart
import 'package:openapi/api.dart';
```

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getMessageFetch**](MessagesApi.md#getmessagefetch) | **GET** /api/v1/messages/{messageUuid} | Get Message Status
[**getMessageList**](MessagesApi.md#getmessagelist) | **GET** /api/v1/messages | List Messages
[**postMessageCreate**](MessagesApi.md#postmessagecreate) | **POST** /api/v1/messages | Send SMS Message
[**postMessageRetry**](MessagesApi.md#postmessageretry) | **POST** /api/v1/messages/{messageUuid}/retry | Retry Message


# **getMessageFetch**
> GetMessageList200ResponseMessagesInner getMessageFetch(messageUuid)

Get Message Status

### Example
```dart
import 'package:openapi/api.dart';

final api_instance = MessagesApi();
final messageUuid = messageUuid_example; // String | 

try {
    final result = api_instance.getMessageFetch(messageUuid);
    print(result);
} catch (e) {
    print('Exception when calling MessagesApi->getMessageFetch: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **messageUuid** | **String**|  | 

### Return type

[**GetMessageList200ResponseMessagesInner**](GetMessageList200ResponseMessagesInner.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMessageList**
> GetMessageList200Response getMessageList(status, limit, offset)

List Messages

### Example
```dart
import 'package:openapi/api.dart';

final api_instance = MessagesApi();
final status = status_example; // String | 
final limit = 8.14; // num | 
final offset = 8.14; // num | 

try {
    final result = api_instance.getMessageList(status, limit, offset);
    print(result);
} catch (e) {
    print('Exception when calling MessagesApi->getMessageList: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **status** | **String**|  | [optional] 
 **limit** | **num**|  | [optional] [default to 50]
 **offset** | **num**|  | [optional] [default to 0]

### Return type

[**GetMessageList200Response**](GetMessageList200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **postMessageCreate**
> GetMessageList200ResponseMessagesInner postMessageCreate(postMessageCreateRequest)

Send SMS Message

### Example
```dart
import 'package:openapi/api.dart';

final api_instance = MessagesApi();
final postMessageCreateRequest = PostMessageCreateRequest(); // PostMessageCreateRequest | 

try {
    final result = api_instance.postMessageCreate(postMessageCreateRequest);
    print(result);
} catch (e) {
    print('Exception when calling MessagesApi->postMessageCreate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **postMessageCreateRequest** | [**PostMessageCreateRequest**](PostMessageCreateRequest.md)|  | [optional] 

### Return type

[**GetMessageList200ResponseMessagesInner**](GetMessageList200ResponseMessagesInner.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **postMessageRetry**
> GetMessageList200ResponseMessagesInner postMessageRetry(messageUuid)

Retry Message

### Example
```dart
import 'package:openapi/api.dart';

final api_instance = MessagesApi();
final messageUuid = messageUuid_example; // String | 

try {
    final result = api_instance.postMessageRetry(messageUuid);
    print(result);
} catch (e) {
    print('Exception when calling MessagesApi->postMessageRetry: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **messageUuid** | **String**|  | 

### Return type

[**GetMessageList200ResponseMessagesInner**](GetMessageList200ResponseMessagesInner.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

