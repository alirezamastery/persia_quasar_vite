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
      v-if="showSave"
      :label="$t('general.save')"
      :disable="saveDisabled"
      type="submit"
      color="primary"
      @click="$emit('save')"
    />
    <q-btn
      v-if="showBack"
      :label="$t('general.back')"
      @click="$emit('go-back')"
    />
  </div>
</template>

<script setup lang="ts">
export interface FormActionProps {
  saveDisabled?: boolean
  showDelete?: boolean
  showSave?: boolean,
    showBack?: boolean
}

withDefaults(defineProps<FormActionProps>(), {
  saveDisabled: false,
  showDelete: true,
  showSave: true,
  showBack: false,
})
</script>
