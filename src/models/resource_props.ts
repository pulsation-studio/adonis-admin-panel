import {
  ActionButton,
  BaseModel,
  FilterType,
  ModelDto,
  ResourceMeta,
  ResourceTableProps,
} from './index.js'

export interface ExtraResourceFilter<Model extends BaseModel> {
  readonly key: keyof ModelDto<Model>
  readonly type: FilterType
  readonly label: string
  readonly value?: unknown
}

export interface ResourceProps<Model extends BaseModel> {
  readonly resource: ResourceMeta
  readonly extraResourceFilters: ExtraResourceFilter<Model>[]
  readonly noInstanceActions: ActionButton<Model>[]
  readonly multipleInstanceActions: ActionButton<Model>[]
  readonly tableProps: ResourceTableProps<Model>
}
