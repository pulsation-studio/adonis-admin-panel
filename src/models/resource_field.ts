import { BaseModel, ModelDto } from './model.js'

// TODO : revoir le typage, celui-ci
// const A = { aaa: { bbb: 'value' }, ccc: 'value' }
// type AKeys = NestedKeyOf<typeof A>
type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string | number ? `${K}` | `${K}.${NestedKeyOf<T[K]>}` : never
    }[keyof T]
  : never

export interface ResourceField<Model extends BaseModel> {
  readonly headerLabel: string
  readonly valueKey: NestedKeyOf<ModelDto<Model>>
  readonly wrapBy?: string
  readonly onHeaderClick?: () => void
  readonly enumLabels?: { [key: string]: string }
  readonly dateFormat?: string // potentiellement pas dans le bon objet
  readonly truncate?: 'start' | 'end'
  readonly longField?: boolean
}
