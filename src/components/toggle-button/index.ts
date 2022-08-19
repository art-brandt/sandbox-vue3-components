import { computed, defineComponent, PropType, ref, watch } from 'vue';
import { ColorProp, LabelsProp, SwitchColorProp } from './types';
import { px, translate } from './utils';

const DEFAULT_COLOR_CHECKED = 'var(--color-green)';
const DEFAULT_COLOR_UNCHECKED = 'var(--color-gray)';
const DEFAULT_LABEL_CHECKED = 'Вкл';
const DEFAULT_LABEL_UNCHECKED = 'Выкл';
const DEFAULT_SWITCH_COLOR = '#fff';

export default defineComponent({
    name: 'ToggleButton',
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        name: {
            type: String,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        tag: {
            type: String,
        },
        sync: {
            type: Boolean,
            default: true,
        },
        speed: {
            type: Number,
            default: 300,
        },
        color: {
            type: [String, Object] as PropType<ColorProp | undefined>,
        },
        switchColor: {
            type: [String, Object] as PropType<SwitchColorProp | undefined>,
        },
        cssColors: {
            type: Boolean,
            default: false,
        },
        labels: {
            type: [Boolean, Object] as PropType<LabelsProp>,
            default: true,
        },
        height: {
            type: Number,
            default: 30,
        },
        width: {
            type: Number,
            default: 60,
        },
        margin: {
            type: Number,
            default: 6,
        },
        fontSize: {
            type: Number,
            default: 12,
        },
    },
    emits: [ 'change', 'update:modelValue' ],
    setup(props, { emit }) {
        const toggled = ref(!!props.modelValue.valueOf());

        const className = computed(() => ([
            'vue-js-switch',
            { toggled: toggled.value, disabled: props.disabled },
        ]));

        const colorChecked = computed(() => {
            return typeof props.color === 'object'
                ? props.color.checked || DEFAULT_COLOR_CHECKED
                : props.color || DEFAULT_COLOR_CHECKED;
        });

        const colorUnchecked = computed(() => {
            return typeof props.color === 'object'
                ? props.color.unchecked || DEFAULT_COLOR_UNCHECKED
                : DEFAULT_COLOR_UNCHECKED;
        });

        const colorCurrent = computed(() => {
            return toggled.value ? colorChecked.value : colorUnchecked.value;
        });

        const colorDisabled = computed(() => {
            return typeof props.color === 'object'
                ? props.color.disabled || colorCurrent.value
                : colorCurrent.value;
        });

        const coreStyle = computed(() => ({
            width: px(props.width),
            height: px(props.height),
            backgroundColor: props.cssColors
                ? null
                : props.disabled
                    ? colorDisabled.value
                    : colorCurrent.value,
            borderRadius: px(Math.round(props.height / 2)),
        }));

        const buttonRadius = computed(() => {
            return props.height - props.margin * 2;
        });

        const distance = computed(() => {
            return px(props.width - props.height + props.margin);
        });

        const labelStyle = computed(() => ({
            lineHeight: px(props.height),
            fontSize: props.fontSize ? px(props.fontSize) : null,
        }));

        const labelChecked = computed(() => {
            return typeof props.labels === 'object'
                ? props.labels.checked || DEFAULT_LABEL_CHECKED
                : DEFAULT_LABEL_CHECKED;
        });

        const labelUnchecked = computed(() => {
            return typeof props.labels === 'object'
                ? props.labels.unchecked || DEFAULT_LABEL_UNCHECKED
                : DEFAULT_LABEL_UNCHECKED;
        });

        const switchColorChecked = computed(() => {
            return typeof props.switchColor === 'object'
                ? props.switchColor.checked || DEFAULT_SWITCH_COLOR
                : DEFAULT_SWITCH_COLOR;
        });

        const switchColorUnchecked = computed(() => {
            return typeof props.switchColor === 'object'
                ? props.switchColor.unchecked || DEFAULT_SWITCH_COLOR
                : DEFAULT_SWITCH_COLOR;
        });

        const switchColorCurrent = computed(() => {
            return typeof props.switchColor !== 'object'
                ? props.switchColor || DEFAULT_SWITCH_COLOR
                : toggled.value ? switchColorChecked.value : switchColorUnchecked.value;
        });

        const buttonStyle = computed(() => {
            const transition = `transform ${props.speed}ms`;
            const margin = px(props.margin);

            const transform = toggled.value
                ? translate(distance.value, margin)
                : translate(margin, margin);

            const background = props.switchColor
                ? switchColorCurrent.value
                : null;

            return {
                width: px(buttonRadius.value),
                height: px(buttonRadius.value),
                transition,
                transform,
                background,
            };
        });

        watch(() => props.modelValue, (value) => {
            if (props.sync) {
                toggled.value = value; 
            }
        });

        function toggle(event: Event) {
            const newToggledState = !toggled.value;

            if (!props.sync) {
                toggled.value = newToggledState;
            }

            emit('update:modelValue', newToggledState);
            emit('change', {
                value: newToggledState,
                tag: props.tag,
                srcEvent: event,
            });
        }

        function keyToggle(event: Event) {
            if (props.disabled) return;
            toggle(event);
        }

        return {
            props,
            toggled,
            labelChecked,
            labelUnchecked,
            className,
            coreStyle,
            buttonStyle,
            labelStyle,
            toggle,
            keyToggle,
        };
    },
});
