export type ColorProp = {
    checked?: string;
    unchecked?: string;
    disabled?: string;
} | string;

export type SwitchColorProp = {
    checked?: string;
    unchecked?: string;
    disabled?: string;
} | string;

export type LabelsProp = {
    checked?: string;
    unchecked?: string;
} | boolean;

export type ChangeToggleEvent = {
    value: boolean,
    tag?: string,
    srcEvent: Event,
}