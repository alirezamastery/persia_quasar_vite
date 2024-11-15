<script setup lang="ts">
import {computed} from 'vue'
import QInputCommaSeparated from 'components/form/QInputCommaSeparated.vue'
import {ShopProductAddVariantForm} from 'src/types/domain/shop/variant'
import {ShopSelectorTypeDetailResponse} from 'src/types/network/response/shop/selector'

interface NewVariantProps {
  modelValue: ShopProductAddVariantForm[]
  selectorType: ShopSelectorTypeDetailResponse
}

const props = defineProps<NewVariantProps>()
const emits = defineEmits<{
  (e: 'update:modelValue', value: ShopProductAddVariantForm[]): void,
}>()

const newVariants = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
})

function handleRemoveSelector(selectorId: number) {
  const index = newVariants.value.map(v => v.selectorValue.id).indexOf(selectorId)
  if (index > -1)
    newVariants.value.splice(index, 1)
}
</script>

<template>
  <q-card
    v-for="(newVar, j) in newVariants"
    :key="j"
    class="bordered no-shadow q-my-lg"
  >
    <q-bar>
      <q-space/>
      <q-btn dense flat icon="close" @click="handleRemoveSelector(newVar.selectorValue.id)"/>
    </q-bar>
    <q-card-section class="row justify-between">
      <q-btn dense class="q-ma-sm selector-btn" outline>
        <div
          v-if="selectorType.code === 'COLOR'"
          class="selector-icon"
          :style="{'background-color': newVar.selectorValue.value}"
        ></div>
        <span class="q-ml-sm">{{ newVar.selectorValue.title }}</span>
      </q-btn>
      <q-checkbox
        v-model="newVar.isActive"
        :label="$t('shop.isActive')"
      />
    </q-card-section>

    <q-card-section class="row q-col-gutter-sm">
      <div class="col col-xs-12 col-sm-6 col-md-4">
        <QInputCommaSeparated
          v-model="newVar.maxInOrder"
          :label="$t('shop.maxInOrder')"
          outlined
          dense
        />
      </div>
      <div class="col col-xs-12 col-sm-6 col-md-4">
        <QInputCommaSeparated
          v-model="newVar.inventory"
          :label="$t('shop.inventory')"
          outlined
          dense
        />
      </div>
      <div class="col col-xs-12 col-sm-6 col-md-4">
        <QInputCommaSeparated
          v-model="newVar.price"
          :label="$t('shop.price')"
          outlined
          dense
        />
      </div>
    </q-card-section>
  </q-card>
</template>
