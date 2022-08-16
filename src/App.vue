<template>
  <div class="container">
    <div class="d-flex m-4 align-items-center">
      <dropdown-menu
        :value="showDropdown"
        @input="value => showDropdown = value"
        class="btn-dropdown"
      >
        <button class="btn btn-primary dropdown-toggle">Choose</button>
        <template v-slot:dropdown>
          <div>
            <button
                v-for="item in items"
                :key="item"
                class="dropdown-item"
                type="button" 
                @click="onClickItem(item)"
            >{{ item }}</button>
          </div>
        </template>
      </dropdown-menu>
      <span
        class="badge m-4 fs-6"
        :style="{ 'background-color': currentValue }">{{ currentValue }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import DropdownMenu from './components/dropdown-menu/index.vue';

export default defineComponent({
  name: 'App',
  components: {
    DropdownMenu,
  },
  setup() {
    const items = [ 'orange', 'crimson', 'tomato', 'paleGreen', 'violet', 'teal', 'lime' ];
    const showDropdown = ref(false);
    const currentValue = ref(items[0]);
    const onClickItem = (value: string) => currentValue.value = value;
    return {
      showDropdown,
      currentValue,
      items,
      onClickItem,
    }
  }
});
</script>
