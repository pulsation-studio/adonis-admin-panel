import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { QuerySortingType, SortingType } from './index.js'
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

export interface FilterOption<Model extends BaseModel> {
  readonly queryFilter: (
    query: ModelQueryBuilderContract<Model>,
    filter: string
  ) => ModelQueryBuilderContract<Model>
  readonly type: FilterType
  value?: string | null
  options?: string[]
}

export interface SortOption<Model extends BaseModel> {
  readonly querySort: (
    query: ModelQueryBuilderContract<Model>,
    sort: QuerySortingType
  ) => ModelQueryBuilderContract<Model>
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
  readonly sortOption?: SortOption<Model>
  readonly filterOption?: FilterOption<Model>
}
