//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class PostMessageCreateRequest {
  /// Returns a new [PostMessageCreateRequest] instance.
  PostMessageCreateRequest({
    required this.to,
    required this.content,
  });

  String to;

  String content;

  @override
  bool operator ==(Object other) => identical(this, other) || other is PostMessageCreateRequest &&
    other.to == to &&
    other.content == content;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (to.hashCode) +
    (content.hashCode);

  @override
  String toString() => 'PostMessageCreateRequest[to=$to, content=$content]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'to'] = this.to;
      json[r'content'] = this.content;
    return json;
  }

  /// Returns a new [PostMessageCreateRequest] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static PostMessageCreateRequest? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "PostMessageCreateRequest[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "PostMessageCreateRequest[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return PostMessageCreateRequest(
        to: mapValueOfType<String>(json, r'to')!,
        content: mapValueOfType<String>(json, r'content')!,
      );
    }
    return null;
  }

  static List<PostMessageCreateRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PostMessageCreateRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PostMessageCreateRequest.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PostMessageCreateRequest> mapFromJson(dynamic json) {
    final map = <String, PostMessageCreateRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PostMessageCreateRequest.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of PostMessageCreateRequest-objects as value to a dart map
  static Map<String, List<PostMessageCreateRequest>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<PostMessageCreateRequest>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = PostMessageCreateRequest.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'to',
    'content',
  };
}

