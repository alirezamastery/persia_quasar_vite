<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Table from 'src/components/table/Table.vue'
import urls from 'src/urls'
import { TableColumn, TableFilter } from 'components/table/types'
import RouteNames from 'src/router/route-names'
import { formatAsCommaSeparated } from 'src/modules/number-tools'

const { t } = useI18n()

const apiRoot = urls.robotCarList
const columns: TableColumn[] = [
  { name: 'title', label: t('general.title'), field: 'title', align: 'left' },
  { name: 'openLink', label: t('car.link'), field: 'title', align: 'left' },
  { name: 'kilometer', label: t('car.kilometer'), field: 'kilometer', align: 'left' },
  { name: 'year', label: t('car.year'), field: 'year', align: 'left' },
  { name: 'price', label: t('car.price'), field: 'price', align: 'left' },
  { name: 'color', label: t('car.color'), field: 'color', align: 'left' },
  { name: 'location', label: t('car.location'), field: 'location', align: 'left' },
  { name: 'time', label: t('car.time'), field: 'time', align: 'left' },
  { name: 'phone', label: t('car.phone'), field: 'phone', align: 'left' },
  { name: 'status', label: t('car.status'), field: 'status', align: 'left' },
  { name: 'sellerType', label: t('car.sellerType'), field: 'seller_type', align: 'left' },
  {
    name: 'appointment',
    label: t('car.appointment'),
    field: 'appointment',
    align: 'left',
  },
  { name: 'engine', label: t('car.engine'), field: 'engine', align: 'left' },
  { name: 'chassis', label: t('car.chassis'), field: 'chassis', align: 'left' },
  {
    name: 'chassis_front',
    label: t('car.chassisFront'),
    field: 'chassis_front',
    align: 'left',
  },
  {
    name: 'chassis_back',
    label: t('car.chassisBack'),
    field: 'chassis_back',
    align: 'left',
  },
  { name: 'body', label: t('car.body'), field: 'body', align: 'left' },
  {
    name: 'myDescription',
    label: t('car.myDescription'),
    field: 'my_description',
    align: 'left',
  },
]

const callStatusIcon = {
  CALL_WAIT: 'hourglass_top',
  NO_ANSWER: 'phone_missed',
  TALKED: 'phone',
  SOLD: 'event_busy',
}

const callStatusColor = {
  CALL_WAIT: 'grey',
  NO_ANSWER: 'amber',
  TALKED: 'green',
  SOLD: 'red',
}

const sellerTypeIcon = {
  GREEDY: 'mdi-block-helper',
  OK: 'mdi-thumb-up',
  NA: 'question_mark',
}

const sellerTypeColor = {
  GREEDY: 'red',
  OK: 'green',
  NA: 'grey',
}

function getDateTime(val: string) {
  if (!val) return ''
  return new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(val))
}
</script>

<template>
  <Table
    :title="$t('car.cars')"
    :columns="columns"
    :api-root="apiRoot"
    :page-size="100"
    search-word="q"
    xs-grid-card
  >
    <template v-slot:col-title="{ props }">
      <q-btn
        :to="{ name: RouteNames.ROBOT_CAR_EDIT, params: { id: props.row.id } }"
        color="light-blue"
        dense
        flat
      >
        {{ props.row.title }}
      </q-btn>
    </template>

    <template v-slot:col-openLink="{ props }">
      <a :href="`https://divar.ir/v/blank/${props.row.token}`">open link</a>
    </template>

    <template v-slot:col-status="{ props }">
      <q-icon
        :name="callStatusIcon[props.row.status]"
        :color="callStatusColor[props.row.status]"
      />
    </template>

    <template v-slot:col-sellerType="{ props }">
      <q-icon
        :name="sellerTypeIcon[props.row.seller_type]"
        :color="sellerTypeColor[props.row.seller_type]"
      />
    </template>

    <template v-slot:col-appointment="{ props }">
      <span>{{ getDateTime(props.row.appointment) }}</span>
    </template>

    <template v-slot:col-price="{ props }">
      <span>{{ formatAsCommaSeparated(props.row.price) }}</span>
    </template>

    <template v-slot:col-kilometer="{ props }">
      <span>{{ formatAsCommaSeparated(props.row.kilometer) }}</span>
    </template>

    <!-- col-xs -->
    <template v-slot:col-xs-title="{ props }">
      <q-item>
        <q-item-section>
          <q-item-label>{{ $t('general.title') }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ props.row.title }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:col-xs-openLink="{ props }">
      <q-item>
        <q-item-section>
          <q-item-label>{{ $t('car.link') }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <a :href="`https://divar.ir/v/blank/${props.row.token}`">open link</a>
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:col-xs-status="{ props }">
      <q-item>
        <q-item-section>
          <q-item-label>{{ $t('car.status') }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-icon
              :name="callStatusIcon[props.row.status]"
              :color="callStatusColor[props.row.status]"
            />
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:col-xs-sellerType="{ props }">
      <q-item>
        <q-item-section>
          <q-item-label>{{ $t('car.sellerType') }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-icon
              :name="sellerTypeIcon[props.row.seller_type]"
              :color="sellerTypeColor[props.row.seller_type]"
            />
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:col-xs-appointment="{ props }">
      <q-item>
        <q-item-section>
          <q-item-label>{{ $t('car.appointment') }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <span>{{ getDateTime(props.row.appointment) }}</span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:col-xs-price="{ props }">
      <q-item>
        <q-item-section>
          <q-item-label>{{ $t('car.price') }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <span>{{ formatAsCommaSeparated(props.row.price) }}</span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:col-xs-kilometer="{ props }">
      <q-item>
        <q-item-section>
          <q-item-label>{{ $t('car.kilometer') }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <span>{{ formatAsCommaSeparated(props.row.kilometer) }}</span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

  </Table>
</template>
