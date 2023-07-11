import {QTableProps, QTableSlots} from 'quasar'


type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type QTableColumns = QTableProps['columns']
export type QTableColumn = ArrayElement<Exclude<QTableColumns, undefined>>

export type QTableSlotItemProps = Parameters<QTableSlots['item']>[0]

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
