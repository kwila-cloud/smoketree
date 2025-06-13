//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class GetUsageStatsGetAll200ResponseInner {
  /// Returns a new [GetUsageStatsGetAll200ResponseInner] instance.
  GetUsageStatsGetAll200ResponseInner({
    required this.month,
    required this.totalMessages,
    required this.totalSegments,
    required this.segmentLimit,
    required this.isLimitExceeded,
    required this.remainingSegments,
  });

  String month;

  num totalMessages;

  num totalSegments;

  num segmentLimit;

  bool isLimitExceeded;

  num remainingSegments;

  @override
  bool operator ==(Object other) => identical(this, other) || other is GetUsageStatsGetAll200ResponseInner &&
    other.month == month &&
    other.totalMessages == totalMessages &&
    other.totalSegments == totalSegments &&
    other.segmentLimit == segmentLimit &&
    other.isLimitExceeded == isLimitExceeded &&
    other.remainingSegments == remainingSegments;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (month.hashCode) +
    (totalMessages.hashCode) +
    (totalSegments.hashCode) +
    (segmentLimit.hashCode) +
    (isLimitExceeded.hashCode) +
    (remainingSegments.hashCode);

  @override
  String toString() => 'GetUsageStatsGetAll200ResponseInner[month=$month, totalMessages=$totalMessages, totalSegments=$totalSegments, segmentLimit=$segmentLimit, isLimitExceeded=$isLimitExceeded, remainingSegments=$remainingSegments]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'month'] = this.month;
      json[r'totalMessages'] = this.totalMessages;
      json[r'totalSegments'] = this.totalSegments;
      json[r'segmentLimit'] = this.segmentLimit;
      json[r'isLimitExceeded'] = this.isLimitExceeded;
      json[r'remainingSegments'] = this.remainingSegments;
    return json;
  }

  /// Returns a new [GetUsageStatsGetAll200ResponseInner] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static GetUsageStatsGetAll200ResponseInner? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "GetUsageStatsGetAll200ResponseInner[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "GetUsageStatsGetAll200ResponseInner[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return GetUsageStatsGetAll200ResponseInner(
        month: mapValueOfType<String>(json, r'month')!,
        totalMessages: num.parse('${json[r'totalMessages']}'),
        totalSegments: num.parse('${json[r'totalSegments']}'),
        segmentLimit: num.parse('${json[r'segmentLimit']}'),
        isLimitExceeded: mapValueOfType<bool>(json, r'isLimitExceeded')!,
        remainingSegments: num.parse('${json[r'remainingSegments']}'),
      );
    }
    return null;
  }

  static List<GetUsageStatsGetAll200ResponseInner> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <GetUsageStatsGetAll200ResponseInner>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = GetUsageStatsGetAll200ResponseInner.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, GetUsageStatsGetAll200ResponseInner> mapFromJson(dynamic json) {
    final map = <String, GetUsageStatsGetAll200ResponseInner>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = GetUsageStatsGetAll200ResponseInner.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of GetUsageStatsGetAll200ResponseInner-objects as value to a dart map
  static Map<String, List<GetUsageStatsGetAll200ResponseInner>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<GetUsageStatsGetAll200ResponseInner>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = GetUsageStatsGetAll200ResponseInner.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'month',
    'totalMessages',
    'totalSegments',
    'segmentLimit',
    'isLimitExceeded',
    'remainingSegments',
  };
}

