<template>
  <div
    class="row q-pa-md q-my-sm q-mt-lg rounded-borders"
    :class="$q.dark.isActive ? ['bg-grey-10'] : ['bg-grey-2']"
  >
    <q-btn
      v-if="showDelete"
      :label="$t('general.delete')"
      type="button"
      color="red"
      class="q-ml-sm"
      @click="$emit('delete')"
    />
    <q-space/>
    <q-btn
      :label="$t('general.save')"
      :disable="saveDisabled"
      type="submit"
      color="primary"
      @click="$emit('save')"
    />
  </div>
</template>

<script setup>
defineProps({
  saveDisabled: {
    type: Boolean,
    default: false,
    required: false,
  },
  showDelete: {
    type: Boolean,
    default: true,
    required: false,
  },
})
</script>
