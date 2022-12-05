<template>
  <div
    class="row q-pa-sm bg-soft"
  >
    <q-input
      v-model="searchPhrase"
      :label="$t('general.search')"
      debounce="300"
      color="primary"
      outlined
      dense
      hide-hint
      clearable
      @update:model-value="$emit('search-input', searchPhrase)"
    >
      <template v-slot:append>
        <q-icon name="search"/>
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'

const searchPhrase = ref('')
</script>
