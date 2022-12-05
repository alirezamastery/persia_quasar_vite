import {QTableProps} from 'quasar'

export type QTableColumns = QTableProps['columns']

export type QTableColumn = ArrayElement<Exclude<QTableColumns, undefined>>

export interface TableColumn extends QTableColumn {
  autoWidth?: boolean
}

export interface TableFilter {
  type: 'radioDual' | 'date' | 'boolean' | 'select'
  queryParam: string
  label: string
  options?: any[]
}

export interface TableExtraLink {
  routeName: string
  title: string
}
