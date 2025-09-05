import { DatabaseQueryBuilderContract } from '@adonisjs/lucid/types/querybuilder'
import { SortingType } from './index.js'
import { BaseModel, ModelDto } from './model.js'

// TODO : revoir le typage, celui-ci
// const A = { aaa: { bbb: 'value' }, ccc: 'value' }
// type AKeys = NestedKeyOf<typeof A>
type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string | number ? `${K}` | `${K}.${NestedKeyOf<T[K]>}` : never
    }[keyof T]
  : never

export enum FilterType {
  Contains = 'contains',
  Select = 'select',
  Date = 'date',
}

// export interface FilterOption<Model extends LucidModel> {
//   readonly query: (query: Promise<InstanceType<Model>[]>) => Promise<InstanceType<Model>[]>
//   readonly type: FilterType
//   readonly key: string
//   readonly value: unknown
// }

export type QuerySort = DatabaseQueryBuilderContract<any>

export interface SortOption {
  readonly querySort: () => DatabaseQueryBuilderContract
  value: SortingType
}

export interface ResourceField<Model extends BaseModel> {
  readonly headerLabel: string
  readonly valueKey: NestedKeyOf<ModelDto<Model>>
  readonly wrapBy?: string
  readonly onHeaderClick?: () => void
  readonly enumLabels?: { [key: string]: string }
  readonly dateFormat?: string // potentiellement pas dans le bon objet
  readonly truncate?: 'start' | 'end'
  readonly longField?: boolean
  readonly sortOption?: SortOption
  // readonly filterOption?: FilterOption<Model>
}
