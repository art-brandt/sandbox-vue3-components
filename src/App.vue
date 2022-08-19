<template>
  <div class="container">
    <div class="row">
      <form class="form d-flex align-items-center m-2">
        <toggle-button
          v-for="color in colors"
          :key="color"
          :color="{ checked: color, unchecked: 'lightGray' }"
          :tag="color"
          v-model="togglesValue[color]"
          :id="color"
          :name="color"
          :disabled="isDisabledToggle(color)"
          @change="onChangeToggle"
        />
      </form>
    </div>
    <div class="row">
      <form class="form d-flex align-items-center m-2">
        <dropdown-menu
          :value="showDropdown"
          @input="value => showDropdown = value"
          class="btn-dropdown"
        >
          <button type="button" class="btn btn-primary dropdown-toggle">Choose</button>
          <template v-slot:dropdown>
            <div>
              <button
                  type="button"
                  v-for="item in dropdownItems"
                  :key="item"
                  class="dropdown-item"
                  @click="onClickDropdownItem(item)"
              >{{ item }}</button>
            </div>
          </template>
        </dropdown-menu>
        <span
          class="badge m-4 fs-6"
          :style="{ 'background-color': currentValue }"
        >{{ currentValue }}</span>
      </form>
    </div>
    <div class="row">
      <div class="form m-2">
        <textarea
          class="form-control"
          v-model="textareaValue"
          id="log"
          readonly
          style="min-height: 600px"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import DropdownMenu from './components/dropdown-menu/index.vue';
import ToggleButton from './components/toggle-button/index.vue';
import { ChangeToggleEvent } from './components/toggle-button/types';

export default defineComponent({
  name: 'App',
  components: {
    DropdownMenu,
    ToggleButton,
  },
  setup() {
    const colors = [ 'orange', 'crimson', 'tomato', 'paleGreen', 'violet', 'teal', 'lime' ];
    const initialCurrentValue = colors[0];
    const initialTogglesValue = colors.reduce(
      (obj, color) => ({ ...obj, [color]: true}),
      {} as Record<string, boolean>,
    );
    const showDropdown = ref(false);
    const currentValue = ref(initialCurrentValue);
    const togglesValue = ref(initialTogglesValue);
    const logs = ref([] as string[]);

    const onClickDropdownItem = (value: string) => {
      currentValue.value = value;
      logs.value.push(`Disable ${value} color toggle and active ${currentValue.value} color toggle`);
    };
    const onChangeToggle = (event: ChangeToggleEvent) => {
      const action = event.value ? 'Add' : 'Remove'
      logs.value.push(`${action} ${event.tag} color for choise`);
    };
    const isDisabledToggle = (value: string) =>
      currentValue.value === value;

    const dropdownItems = computed(() => {
      return Object.entries(togglesValue.value).reduce((acc, [ color, isToggled ]) => {
        return isToggled ?  [ ...acc, color ] : acc;
      }, [] as string[]);
    });

    const textareaValue = computed(() => logs.value.join('\n'));

    return {
      showDropdown,
      currentValue,
      togglesValue,
      dropdownItems,
      onClickDropdownItem,
      onChangeToggle,
      isDisabledToggle,
      textareaValue,
      colors,
    }
  }
});
</script>
