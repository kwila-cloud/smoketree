//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class GetMessageList200ResponseMessagesInner {
  /// Returns a new [GetMessageList200ResponseMessagesInner] instance.
  GetMessageList200ResponseMessagesInner({
    required this.uuid,
    required this.organizationUuid,
    required this.to,
    required this.content,
    required this.segments,
    required this.currentStatus,
    required this.createdAt,
    required this.updatedAt,
  });

  String uuid;

  String organizationUuid;

  String to;

  String content;

  num? segments;

  String currentStatus;

  String createdAt;

  String updatedAt;

  @override
  bool operator ==(Object other) => identical(this, other) || other is GetMessageList200ResponseMessagesInner &&
    other.uuid == uuid &&
    other.organizationUuid == organizationUuid &&
    other.to == to &&
    other.content == content &&
    other.segments == segments &&
    other.currentStatus == currentStatus &&
    other.createdAt == createdAt &&
    other.updatedAt == updatedAt;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (uuid.hashCode) +
    (organizationUuid.hashCode) +
    (to.hashCode) +
    (content.hashCode) +
    (segments == null ? 0 : segments!.hashCode) +
    (currentStatus.hashCode) +
    (createdAt.hashCode) +
    (updatedAt.hashCode);

  @override
  String toString() => 'GetMessageList200ResponseMessagesInner[uuid=$uuid, organizationUuid=$organizationUuid, to=$to, content=$content, segments=$segments, currentStatus=$currentStatus, createdAt=$createdAt, updatedAt=$updatedAt]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'uuid'] = this.uuid;
      json[r'organizationUuid'] = this.organizationUuid;
      json[r'to'] = this.to;
      json[r'content'] = this.content;
    if (this.segments != null) {
      json[r'segments'] = this.segments;
    } else {
      json[r'segments'] = null;
    }
      json[r'currentStatus'] = this.currentStatus;
      json[r'createdAt'] = this.createdAt;
      json[r'updatedAt'] = this.updatedAt;
    return json;
  }

  /// Returns a new [GetMessageList200ResponseMessagesInner] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static GetMessageList200ResponseMessagesInner? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "GetMessageList200ResponseMessagesInner[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "GetMessageList200ResponseMessagesInner[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return GetMessageList200ResponseMessagesInner(
        uuid: mapValueOfType<String>(json, r'uuid')!,
        organizationUuid: mapValueOfType<String>(json, r'organizationUuid')!,
        to: mapValueOfType<String>(json, r'to')!,
        content: mapValueOfType<String>(json, r'content')!,
        segments: json[r'segments'] == null
            ? null
            : num.parse('${json[r'segments']}'),
        currentStatus: mapValueOfType<String>(json, r'currentStatus')!,
        createdAt: mapValueOfType<String>(json, r'createdAt')!,
        updatedAt: mapValueOfType<String>(json, r'updatedAt')!,
      );
    }
    return null;
  }

  static List<GetMessageList200ResponseMessagesInner> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <GetMessageList200ResponseMessagesInner>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = GetMessageList200ResponseMessagesInner.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, GetMessageList200ResponseMessagesInner> mapFromJson(dynamic json) {
    final map = <String, GetMessageList200ResponseMessagesInner>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = GetMessageList200ResponseMessagesInner.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of GetMessageList200ResponseMessagesInner-objects as value to a dart map
  static Map<String, List<GetMessageList200ResponseMessagesInner>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<GetMessageList200ResponseMessagesInner>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = GetMessageList200ResponseMessagesInner.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'uuid',
    'organizationUuid',
    'to',
    'content',
    'segments',
    'currentStatus',
    'createdAt',
    'updatedAt',
  };
}

