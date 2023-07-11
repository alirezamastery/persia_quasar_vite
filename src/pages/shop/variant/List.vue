<script setup lang="ts">
import {useI18n} from 'vue-i18n'
import urls from 'src/urls'
import Table from 'src/components/table/Table.vue'
import {TableColumn, TableFilter} from 'components/table/types'
import ListItem from 'pages/shop/variant/ListItem.vue'

const {t} = useI18n()
const apiRoot = urls.shopVariants
const columns: TableColumn[] = [
  {name: 'variant', label: t('shop.variant'), field: 'product', align: 'left'},
]

const filters: TableFilter[] = [
  {
    type: 'boolean',
    queryParam: 'is_active',
    label: 'general.isActive',
  },
]

const gg = {
  'props': {
    'key': 1,
    'row': {
      'id': 1,
      'product': {
        'id': 1,
        'brand': 1,
        'title': '13 اینچ',
        'description': 'خوب',
        'is_active': true,
        'slug': '13',
        'category': 1,
      },
      'selector_value': {
        'id': 1,
        'type': {'id': 1, 'title': 'رنگ', 'code': 'COLOR'},
        'title': 'مشکی',
        'value': '#212121',
        'extra_info': '',
      },
      'is_active': false,
      'price': 1000000,
      'inventory': 23,
      'max_in_order': 3,
    },
    'pageIndex': 0,
    'cols': [
      {
        'name': 'variant',
        'label': 'تنوع',
        'field': 'product',
        'align': 'left',
        '__iconClass': 'q-table__sort-icon q-table__sort-icon--left',
        '__thClass': 'text-left',
        'value': {
          'id': 1,
          'brand': 1,
          'title': '13 اینچ',
          'description': 'خوب',
          'is_active': true,
          'slug': '13',
          'category': 1,
        },
      },
    ],
    'colsMap': {
      'variant': {
        'name': 'variant',
        'label': 'تنوع',
        'field': 'product',
        'align': 'left',
        '__iconClass': 'q-table__sort-icon q-table__sort-icon--left',
        '__thClass': 'text-left',
      },
    },
    'rowIndex': 0,
    'color': 'grey-8',
    'dark': true,
    'dense': true,
    'expand': false,
  },
  'data': {
    'next': null, 'previous': null, 'count': 8, 'page_count': 1, 'items': [
      {
        'id': 1,
        'product': {
          'id': 1,
          'brand': 1,
          'title': '13 اینچ',
          'description': 'خوب',
          'is_active': true,
          'slug': '13',
          'category': 1,
        },
        'selector_value': {
          'id': 1,
          'type': {'id': 1, 'title': 'رنگ', 'code': 'COLOR'},
          'title': 'مشکی',
          'value': '#212121',
          'extra_info': '',
        },
        'is_active': false,
        'price': 1000000,
        'inventory': 23,
        'max_in_order': 3,
      }, {
        'id': 2,
        'product': {
          'id': 1,
          'brand': 1,
          'title': '13 اینچ',
          'description': 'خوب',
          'is_active': true,
          'slug': '13',
          'category': 1,
        },
        'selector_value': {
          'id': 5,
          'type': {'id': 1, 'title': 'رنگ', 'code': 'COLOR'},
          'title': 'زرد',
          'value': '#ffeb3b',
          'extra_info': '',
        },
        'is_active': true,
        'price': 1200000,
        'inventory': 10,
        'max_in_order': 3,
      }, {
        'id': 3,
        'product': {
          'id': 1,
          'brand': 1,
          'title': '13 اینچ',
          'description': 'خوب',
          'is_active': true,
          'slug': '13',
          'category': 1,
        },
        'selector_value': {
          'id': 3,
          'type': {'id': 1, 'title': 'رنگ', 'code': 'COLOR'},
          'title': 'قرمز',
          'value': '#f44336',
          'extra_info': '',
        },
        'is_active': true,
        'price': 1000000,
        'inventory': 10,
        'max_in_order': 3,
      }, {
        'id': 4,
        'product': {
          'id': 1,
          'brand': 1,
          'title': '13 اینچ',
          'description': 'خوب',
          'is_active': true,
          'slug': '13',
          'category': 1,
        },
        'selector_value': {
          'id': 6,
          'type': {'id': 1, 'title': 'رنگ', 'code': 'COLOR'},
          'title': 'سبز',
          'value': '#00e676',
          'extra_info': '',
        },
        'is_active': true,
        'price': 1000000,
        'inventory': 4,
        'max_in_order': 4,
      }, {
        'id': 5,
        'product': {
          'id': 1,
          'brand': 1,
          'title': '13 اینچ',
          'description': 'خوب',
          'is_active': true,
          'slug': '13',
          'category': 1,
        },
        'selector_value': {
          'id': 7,
          'type': {'id': 1, 'title': 'رنگ', 'code': 'COLOR'},
          'title': 'صورتی',
          'value': '#FF80AB',
          'extra_info': '',
        },
        'is_active': true,
        'price': 1000000,
        'inventory': 4,
        'max_in_order': 4,
      }, {
        'id': 7,
        'product': {
          'id': 1,
          'brand': 1,
          'title': '13 اینچ',
          'description': 'خوب',
          'is_active': true,
          'slug': '13',
          'category': 1,
        },
        'selector_value': {
          'id': 13,
          'type': {'id': 1, 'title': 'رنگ', 'code': 'COLOR'},
          'title': 'طلایی',
          'value': '#c99212',
          'extra_info': '',
        },
        'is_active': true,
        'price': 1000000,
        'inventory': 3,
        'max_in_order': 3,
      }, {
        'id': 8,
        'product': {
          'id': 1,
          'brand': 1,
          'title': '13 اینچ',
          'description': 'خوب',
          'is_active': true,
          'slug': '13',
          'category': 1,
        },
        'selector_value': {
          'id': 2,
          'type': {'id': 1, 'title': 'رنگ', 'code': 'COLOR'},
          'title': 'سفید',
          'value': '#FFFFFF',
          'extra_info': '',
        },
        'is_active': true,
        'price': 1000000,
        'inventory': 5,
        'max_in_order': 3,
      }, {
        'id': 6,
        'product': {
          'id': 1,
          'brand': 1,
          'title': '13 اینچ',
          'description': 'خوب',
          'is_active': true,
          'slug': '13',
          'category': 1,
        },
        'selector_value': {
          'id': 14,
          'type': {'id': 1, 'title': 'رنگ', 'code': 'COLOR'},
          'title': 'نارنجی',
          'value': '#ff5722',
          'extra_info': '',
        },
        'is_active': false,
        'price': 1000000,
        'inventory': 3,
        'max_in_order': 3,
      },
    ], 'extra_data': null,
  },
}


</script>

<template>
  <Table
    :title="$t('shop.variants')"
    :columns="columns"
    :api-root="apiRoot"
    :filters="filters"
    :grid="true"
  >

    <template v-slot:grid-item="{props}">
      <ListItem :variant="props.row"/>
    </template>

  </Table>
</template>
