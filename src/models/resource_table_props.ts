import { ModelObject } from '@adonisjs/lucid/types/model'
import { ActionButton, BaseModel, ResourceField } from './index.js'

export interface TablePagination {
  readonly itemsPerPage: number
  readonly nbPage: number
  readonly currentPage: number
  readonly totalItems: number
}

export interface ResourceTableProps<Model extends BaseModel> {
  readonly items: ModelObject[]
  readonly singleInstanceActionButtons: ActionButton<Model>[]
  readonly columns: ResourceField<Model>[]
  readonly pagination?: TablePagination
}
