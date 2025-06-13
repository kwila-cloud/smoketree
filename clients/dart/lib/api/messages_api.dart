//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;


class MessagesApi {
  MessagesApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  final ApiClient apiClient;

  /// Get Message Status
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] messageUuid (required):
  Future<Response> getMessageFetchWithHttpInfo(String messageUuid,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/v1/messages/{messageUuid}'
      .replaceAll('{messageUuid}', messageUuid);

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      path,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Get Message Status
  ///
  /// Parameters:
  ///
  /// * [String] messageUuid (required):
  Future<GetMessageList200ResponseMessagesInner?> getMessageFetch(String messageUuid,) async {
    final response = await getMessageFetchWithHttpInfo(messageUuid,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'GetMessageList200ResponseMessagesInner',) as GetMessageList200ResponseMessagesInner;
    
    }
    return null;
  }

  /// List Messages
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] status:
  ///
  /// * [num] limit:
  ///
  /// * [num] offset:
  Future<Response> getMessageListWithHttpInfo({ String? status, num? limit, num? offset, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/v1/messages';

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    if (status != null) {
      queryParams.addAll(_queryParams('', 'status', status));
    }
    if (limit != null) {
      queryParams.addAll(_queryParams('', 'limit', limit));
    }
    if (offset != null) {
      queryParams.addAll(_queryParams('', 'offset', offset));
    }

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      path,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// List Messages
  ///
  /// Parameters:
  ///
  /// * [String] status:
  ///
  /// * [num] limit:
  ///
  /// * [num] offset:
  Future<GetMessageList200Response?> getMessageList({ String? status, num? limit, num? offset, }) async {
    final response = await getMessageListWithHttpInfo( status: status, limit: limit, offset: offset, );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'GetMessageList200Response',) as GetMessageList200Response;
    
    }
    return null;
  }

  /// Send SMS Message
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [PostMessageCreateRequest] postMessageCreateRequest:
  Future<Response> postMessageCreateWithHttpInfo({ PostMessageCreateRequest? postMessageCreateRequest, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/v1/messages';

    // ignore: prefer_final_locals
    Object? postBody = postMessageCreateRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>['application/json'];


    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Send SMS Message
  ///
  /// Parameters:
  ///
  /// * [PostMessageCreateRequest] postMessageCreateRequest:
  Future<GetMessageList200ResponseMessagesInner?> postMessageCreate({ PostMessageCreateRequest? postMessageCreateRequest, }) async {
    final response = await postMessageCreateWithHttpInfo( postMessageCreateRequest: postMessageCreateRequest, );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'GetMessageList200ResponseMessagesInner',) as GetMessageList200ResponseMessagesInner;
    
    }
    return null;
  }

  /// Retry Message
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] messageUuid (required):
  Future<Response> postMessageRetryWithHttpInfo(String messageUuid,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/v1/messages/{messageUuid}/retry'
      .replaceAll('{messageUuid}', messageUuid);

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Retry Message
  ///
  /// Parameters:
  ///
  /// * [String] messageUuid (required):
  Future<GetMessageList200ResponseMessagesInner?> postMessageRetry(String messageUuid,) async {
    final response = await postMessageRetryWithHttpInfo(messageUuid,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'GetMessageList200ResponseMessagesInner',) as GetMessageList200ResponseMessagesInner;
    
    }
    return null;
  }
}
