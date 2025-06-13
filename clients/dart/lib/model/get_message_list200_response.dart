//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class GetMessageList200Response {
  /// Returns a new [GetMessageList200Response] instance.
  GetMessageList200Response({
    this.messages = const [],
    required this.total,
    required this.limit,
    required this.offset,
  });

  List<GetMessageList200ResponseMessagesInner> messages;

  num total;

  num limit;

  num offset;

  @override
  bool operator ==(Object other) => identical(this, other) || other is GetMessageList200Response &&
    _deepEquality.equals(other.messages, messages) &&
    other.total == total &&
    other.limit == limit &&
    other.offset == offset;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (messages.hashCode) +
    (total.hashCode) +
    (limit.hashCode) +
    (offset.hashCode);

  @override
  String toString() => 'GetMessageList200Response[messages=$messages, total=$total, limit=$limit, offset=$offset]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'messages'] = this.messages;
      json[r'total'] = this.total;
      json[r'limit'] = this.limit;
      json[r'offset'] = this.offset;
    return json;
  }

  /// Returns a new [GetMessageList200Response] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static GetMessageList200Response? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "GetMessageList200Response[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "GetMessageList200Response[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return GetMessageList200Response(
        messages: GetMessageList200ResponseMessagesInner.listFromJson(json[r'messages']),
        total: num.parse('${json[r'total']}'),
        limit: num.parse('${json[r'limit']}'),
        offset: num.parse('${json[r'offset']}'),
      );
    }
    return null;
  }

  static List<GetMessageList200Response> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <GetMessageList200Response>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = GetMessageList200Response.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, GetMessageList200Response> mapFromJson(dynamic json) {
    final map = <String, GetMessageList200Response>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = GetMessageList200Response.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of GetMessageList200Response-objects as value to a dart map
  static Map<String, List<GetMessageList200Response>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<GetMessageList200Response>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = GetMessageList200Response.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'messages',
    'total',
    'limit',
    'offset',
  };
}

