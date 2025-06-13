//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class GetLimitsGetAll200ResponseInner {
  /// Returns a new [GetLimitsGetAll200ResponseInner] instance.
  GetLimitsGetAll200ResponseInner({
    required this.month,
    required this.segmentLimit,
    required this.updatedAt,
  });

  String month;

  num segmentLimit;

  String updatedAt;

  @override
  bool operator ==(Object other) => identical(this, other) || other is GetLimitsGetAll200ResponseInner &&
    other.month == month &&
    other.segmentLimit == segmentLimit &&
    other.updatedAt == updatedAt;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (month.hashCode) +
    (segmentLimit.hashCode) +
    (updatedAt.hashCode);

  @override
  String toString() => 'GetLimitsGetAll200ResponseInner[month=$month, segmentLimit=$segmentLimit, updatedAt=$updatedAt]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'month'] = this.month;
      json[r'segmentLimit'] = this.segmentLimit;
      json[r'updatedAt'] = this.updatedAt;
    return json;
  }

  /// Returns a new [GetLimitsGetAll200ResponseInner] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static GetLimitsGetAll200ResponseInner? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "GetLimitsGetAll200ResponseInner[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "GetLimitsGetAll200ResponseInner[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return GetLimitsGetAll200ResponseInner(
        month: mapValueOfType<String>(json, r'month')!,
        segmentLimit: num.parse('${json[r'segmentLimit']}'),
        updatedAt: mapValueOfType<String>(json, r'updatedAt')!,
      );
    }
    return null;
  }

  static List<GetLimitsGetAll200ResponseInner> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <GetLimitsGetAll200ResponseInner>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = GetLimitsGetAll200ResponseInner.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, GetLimitsGetAll200ResponseInner> mapFromJson(dynamic json) {
    final map = <String, GetLimitsGetAll200ResponseInner>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = GetLimitsGetAll200ResponseInner.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of GetLimitsGetAll200ResponseInner-objects as value to a dart map
  static Map<String, List<GetLimitsGetAll200ResponseInner>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<GetLimitsGetAll200ResponseInner>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = GetLimitsGetAll200ResponseInner.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'month',
    'segmentLimit',
    'updatedAt',
  };
}

