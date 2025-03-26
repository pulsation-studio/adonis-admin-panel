import { ActionButton, ResourceMeta, ResourceTableProps, BaseModel } from './index.js'

export interface ResourceProps<Model extends BaseModel> {
  readonly resource: ResourceMeta
  readonly noInstanceActions: ActionButton<Model>[]
  readonly multipleInstanceActions: ActionButton<Model>[]
  readonly tableProps: ResourceTableProps<Model>
}
