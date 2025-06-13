//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class PostMessageCreate429Response {
  /// Returns a new [PostMessageCreate429Response] instance.
  PostMessageCreate429Response({
    required this.error,
    required this.messageUuid,
    required this.currentUsage,
    required this.monthlyLimit,
  });

  String error;

  String messageUuid;

  num currentUsage;

  num monthlyLimit;

  @override
  bool operator ==(Object other) => identical(this, other) || other is PostMessageCreate429Response &&
    other.error == error &&
    other.messageUuid == messageUuid &&
    other.currentUsage == currentUsage &&
    other.monthlyLimit == monthlyLimit;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (error.hashCode) +
    (messageUuid.hashCode) +
    (currentUsage.hashCode) +
    (monthlyLimit.hashCode);

  @override
  String toString() => 'PostMessageCreate429Response[error=$error, messageUuid=$messageUuid, currentUsage=$currentUsage, monthlyLimit=$monthlyLimit]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'error'] = this.error;
      json[r'messageUuid'] = this.messageUuid;
      json[r'currentUsage'] = this.currentUsage;
      json[r'monthlyLimit'] = this.monthlyLimit;
    return json;
  }

  /// Returns a new [PostMessageCreate429Response] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static PostMessageCreate429Response? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "PostMessageCreate429Response[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "PostMessageCreate429Response[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return PostMessageCreate429Response(
        error: mapValueOfType<String>(json, r'error')!,
        messageUuid: mapValueOfType<String>(json, r'messageUuid')!,
        currentUsage: num.parse('${json[r'currentUsage']}'),
        monthlyLimit: num.parse('${json[r'monthlyLimit']}'),
      );
    }
    return null;
  }

  static List<PostMessageCreate429Response> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PostMessageCreate429Response>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PostMessageCreate429Response.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PostMessageCreate429Response> mapFromJson(dynamic json) {
    final map = <String, PostMessageCreate429Response>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PostMessageCreate429Response.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of PostMessageCreate429Response-objects as value to a dart map
  static Map<String, List<PostMessageCreate429Response>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<PostMessageCreate429Response>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = PostMessageCreate429Response.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'error',
    'messageUuid',
    'currentUsage',
    'monthlyLimit',
  };
}

