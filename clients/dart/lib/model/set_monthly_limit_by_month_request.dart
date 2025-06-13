//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class SetMonthlyLimitByMonthRequest {
  /// Returns a new [SetMonthlyLimitByMonthRequest] instance.
  SetMonthlyLimitByMonthRequest({
    required this.segmentLimit,
  });

  num segmentLimit;

  @override
  bool operator ==(Object other) => identical(this, other) || other is SetMonthlyLimitByMonthRequest &&
    other.segmentLimit == segmentLimit;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (segmentLimit.hashCode);

  @override
  String toString() => 'SetMonthlyLimitByMonthRequest[segmentLimit=$segmentLimit]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'segmentLimit'] = this.segmentLimit;
    return json;
  }

  /// Returns a new [SetMonthlyLimitByMonthRequest] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static SetMonthlyLimitByMonthRequest? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "SetMonthlyLimitByMonthRequest[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "SetMonthlyLimitByMonthRequest[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return SetMonthlyLimitByMonthRequest(
        segmentLimit: num.parse('${json[r'segmentLimit']}'),
      );
    }
    return null;
  }

  static List<SetMonthlyLimitByMonthRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <SetMonthlyLimitByMonthRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = SetMonthlyLimitByMonthRequest.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, SetMonthlyLimitByMonthRequest> mapFromJson(dynamic json) {
    final map = <String, SetMonthlyLimitByMonthRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = SetMonthlyLimitByMonthRequest.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of SetMonthlyLimitByMonthRequest-objects as value to a dart map
  static Map<String, List<SetMonthlyLimitByMonthRequest>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<SetMonthlyLimitByMonthRequest>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = SetMonthlyLimitByMonthRequest.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'segmentLimit',
  };
}

