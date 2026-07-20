export type ConfigFieldType =
    | 'text'
    | 'toggle'
    | 'tristate'
    | 'password'
    | 'email'
    | 'number'
    | 'tel'
    | 'url'
    | 'search'
    | 'chips'
    | 'checkbox'
    | 'radio'
    | 'color'
    | 'range'
    | 'select'
    | 'multiselect'
    | 'date'
    | 'time'
    | 'datetime-local'
    | 'month'
    | 'week'
    | 'file'
    | 'json';

export type ConfigOptionValue = string | number | boolean;

export interface ConfigRequires {
    [key: string]:
        | ConfigOptionValue
        | ConfigOptionValue[]
        | {
              equals?: ConfigOptionValue;
              not?: ConfigOptionValue;
              in?: ConfigOptionValue[];
              notIn?: ConfigOptionValue[];
              filled?: boolean;
              empty?: boolean;
              regex?: string;
          };
}

export interface ConfigOption {
    id?: string;
    value: ConfigOptionValue;
    label: string;
    includes?: string[];
    excludes?: string[];
    excludedFromProfiles?: string[];
    requires?: ConfigRequires;
    children?: ConfigOption[];
    disabled?: boolean;
}

export interface ConfigTab {
    id: string;
    label: string;
    parentId?: string | null;
    includes?: string[];
    excludes?: string[];
    meta?: Record<string, any>;
    excludedFromProfiles?: string[];
}

export interface ConfigField {
    name: string;
    label: string;
    type?: ConfigFieldType;
    required?: boolean;
    secret?: boolean;
    rules?: string[];
    default?: any;
    helpText?: string | null;
    options?: ConfigOption[];
    sandbox?: boolean;
    meta?: Record<string, any>;
    group?: string | null;
    tabs?: string[];
    isButton?: boolean;
    includes?: string[];
    excludes?: string[];
    excludedFromProfiles?: string[];
    requires?: ConfigRequires;
}

export interface ConfigGroup {
    type: 'group';
    label: string;
    required?: boolean;
    meta?: Record<string, any>;
    tabs?: string[];
    includes?: string[];
    excludes?: string[];
    excludedFromProfiles?: string[];
    requires?: ConfigRequires;
    children: Record<string, ConfigNode>;
}

export type ConfigNode = ConfigField | ConfigGroup;

export interface UiConfigSchemaPayload {
    settings: Record<string, ConfigNode>;
    tabs?: ConfigTab[];
}

export interface FlattenedField {
    path: string;
    fieldName: string;
    key: string;
    node: ConfigField;
}

export interface VisibilityContext {
    activeTokens: Set<string>;
    optionIncludes: Set<string>;
    optionExcludes: Set<string>;
}

export interface SettingsProfile {
    id: number;
    profile: string;
    label: string;
    is_default: boolean;
    is_sandbox: boolean;
    validated_at?: string | null;
    updated_at?: string | null;
}

export interface ProfileCreateOption {
    label: string;
    value: string;
}

export interface ConfigValidationErrorDetail {
    field: string;
    message: string;
    code: string | null;
}

export interface ConfigValidationResult {
    ok: boolean;
    errors?: Record<string, ConfigValidationErrorDetail[]>;
}
