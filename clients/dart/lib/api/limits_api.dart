//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;


class LimitsApi {
  LimitsApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  final ApiClient apiClient;

  /// Get All Monthly Limits
  ///
  /// Note: This method returns the HTTP [Response].
  Future<Response> getLimitsGetAllWithHttpInfo() async {
    // ignore: prefer_const_declarations
    final path = r'/api/v1/limits';

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

  /// Get All Monthly Limits
  Future<List<GetLimitsGetAll200ResponseInner>?> getLimitsGetAll() async {
    final response = await getLimitsGetAllWithHttpInfo();
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      final responseBody = await _decodeBodyBytes(response);
      return (await apiClient.deserializeAsync(responseBody, 'List<GetLimitsGetAll200ResponseInner>') as List)
        .cast<GetLimitsGetAll200ResponseInner>()
        .toList(growable: false);

    }
    return null;
  }

  /// Get Monthly Limit by Month
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] month (required):
  Future<Response> getLimitsGetByMonthWithHttpInfo(String month,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/v1/limits/{month}'
      .replaceAll('{month}', month);

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

  /// Get Monthly Limit by Month
  ///
  /// Parameters:
  ///
  /// * [String] month (required):
  Future<GetLimitsGetAll200ResponseInner?> getLimitsGetByMonth(String month,) async {
    final response = await getLimitsGetByMonthWithHttpInfo(month,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'GetLimitsGetAll200ResponseInner',) as GetLimitsGetAll200ResponseInner;
    
    }
    return null;
  }

  /// Set Monthly Limit (Admin Only)
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] month (required):
  ///
  /// * [PutLimitsPutRequest] putLimitsPutRequest:
  Future<Response> putLimitsPutWithHttpInfo(String month, { PutLimitsPutRequest? putLimitsPutRequest, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/v1/limits/{month}'
      .replaceAll('{month}', month);

    // ignore: prefer_final_locals
    Object? postBody = putLimitsPutRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>['application/json'];


    return apiClient.invokeAPI(
      path,
      'PUT',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Set Monthly Limit (Admin Only)
  ///
  /// Parameters:
  ///
  /// * [String] month (required):
  ///
  /// * [PutLimitsPutRequest] putLimitsPutRequest:
  Future<GetLimitsGetAll200ResponseInner?> putLimitsPut(String month, { PutLimitsPutRequest? putLimitsPutRequest, }) async {
    final response = await putLimitsPutWithHttpInfo(month,  putLimitsPutRequest: putLimitsPutRequest, );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'GetLimitsGetAll200ResponseInner',) as GetLimitsGetAll200ResponseInner;
    
    }
    return null;
  }
}
