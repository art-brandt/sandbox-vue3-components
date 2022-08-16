import { defineComponent, ref, onBeforeUnmount, watch, nextTick } from 'vue';

export default defineComponent({
    name: 'DropdownMenu',
    props: {
        value: Boolean,
        right: Boolean,
        hover: Boolean,
        hover_time: {
            type: Number,
            default: 100,
        },
        hover_timeout: {
            type: Number,
            default: 500,
        },
        styles: {
            type: Object,
            default: () => ({}),
        },
        interactive: {
            type: Boolean,
            default: false,
        },
        transition: {
            type: String,
            default: '',
        },
        closeOnClickOutside: {
            type: Boolean,
            default: true,
        },
    },
    emits: [ 'input' ],
    setup(props, { emit }) {
        const root = ref<HTMLDivElement | null>(null);
        const dropdown = ref<HTMLDivElement | null>(null);

        const hovering = ref(false);
        const top = ref(false);
        const hoverTimer = ref<number | null>(null);
        const hoverOpenTimer = ref<number | null>(null);

        function stopTimer() {
            if (hoverTimer.value) {
                window.clearTimeout(hoverTimer.value);
                hoverTimer.value = null;
            }
        }

        function startTimer() {
            if (!props.interactive) {
                hoverTimer.value = window.setTimeout(closeMenu, props.hover_timeout);
            }
        }

        function mouseLeave () {
            if (!hoverTimer.value) {
                startTimer();
            }

            if (props.hover_time > 0 && props.hover && hoverOpenTimer.value) {
                clearTimeout(hoverOpenTimer.value);
                hoverOpenTimer.value = null;
            }
        }

        const mouseOver = () => stopTimer();

        function toggleMenu () {
            if (hovering.value) return;
            if (props.value && props.hover) return;
            emit('input', !props.value.valueOf());
        }

        function mouseEnter () {
            stopTimer();
            if (props.hover && props.hover_time > 0 && !props.value) {
                hoverOpenTimer.value = window.setTimeout(() => {
                    emit('input', true);
                    hovering.value = true;
                    setTimeout(() => hovering.value = false, props.hover_timeout);
                }, props.hover_time);
            }

            if (props.hover && !props.value && props.hover_time === 0) {
                hovering.value = true;
                setTimeout(() => hovering.value = true, props.hover_timeout);
                emit('input', true);
            }
        }

        function closeMenu(evt: MouseEvent | undefined): void {
            if (!evt || !root.value?.contains(evt.target as Node)) {
                if (props.value && props.closeOnClickOutside) {
                    emit('input', false);
                }
            }
        }

        onBeforeUnmount(() => {
            document.body.removeEventListener('click', closeMenu);
        });

        watch(() => props.value, (value) => {
            if (value) {
                top.value = false;
                nextTick(() => {
                    if (!dropdown.value) throw new Error('dropdown value ref is "null"');
                    const rect = dropdown.value.getBoundingClientRect();
                    const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
                    top.value = (rect.bottom > windowHeight) && (rect.top >= rect.height);
                });
            }
        });

        watch(() => props.interactive, (value) => {
            if (typeof document === 'object') {
                value
                    ? document.body.addEventListener('click', closeMenu)
                    : document.body.removeEventListener('click', closeMenu);
            }
        }, { immediate: true });

        return {
            props,
            top,
            root,
            dropdown,
            startTimer,
            stopTimer,
            mouseLeave,
            mouseOver,
            mouseEnter,
            toggleMenu,
        };
    }
})

defineComponent({
    name: 'DropdownMenu',
    props: {
        value: Boolean,
        right: Boolean,
        hover: Boolean,
        hover_time: {
            type: Number,
            default: 100,
        },
        hover_timeout: {
            type: Number,
            default: 500,
        },
        styles: {
            type: Object,
            default: () => ({}),
        },
        interactive: {
            type: Boolean,
            default: false,
        },
        transition: {
            type: String,
            default: '',
        },
        closeOnClickOutside: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            hovering: false,
            top: false,
            hoverTimer: null as number | null,
            hoverOpenTimer: null as number | null,
        };
    },
    destroyed() {
        document.body.removeEventListener('click', this.closeMenu);
    },
    methods: {
        mouseEnter () {
            this.stopTimer()
            if (this.hover && this.hover_time > 0 && !this.value) {
                this.hoverOpenTimer = window.setTimeout(() => {
                    this.$emit('input', true);
                    this.hovering = true;
                    setTimeout(() => { this.hovering = false}, this.hover_timeout);
                }, this.hover_time);
            }

            if (this.hover && !this.value && this.hover_time === 0) {
                this.hovering = true;
                setTimeout(() => { this.hovering = false }, this.hover_timeout);
                this.$emit('input', true);
            }
        },
        mouseLeave () {
            if (!this.hoverTimer) {
                this.startTimer();
            }

            if (this.hover_time > 0 && this.hover && this.hoverOpenTimer) {
                clearTimeout(this.hoverOpenTimer);
                this.hoverOpenTimer = null;
            }
        },
        mouseOver () {
            this.stopTimer()
        },
        closeMenu ($event: MouseEvent): void {
            if (!$event.target || !this.$el.contains($event.target as Node)) {
                if (this.value && this.closeOnClickOutside) {
                    this.$emit('input', false);
                }
            }
        },
        toggleMenu () {
            if (this.hovering) return;
            if (this.value && this.hover) return;
            this.$emit('input', !this.value);
        },
        stopTimer() {
            if (this.hoverTimer) {
                clearTimeout(this.hoverTimer);
                this.hoverTimer = null;
            }
        },
        startTimer() {
            if (!this.interactive) {
                this.hoverTimer = setTimeout(this.closeMenu, this.hover_timeout);
            }
        },
    },
});