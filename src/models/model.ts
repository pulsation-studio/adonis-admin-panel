import { LucidModel, ModelAttributes } from '@adonisjs/lucid/types/model'

export type BaseModel = LucidModel

type BaseModelAttributes<Model extends BaseModel> = ModelAttributes<InstanceType<Model>>

export type ModelDto<
  Model extends BaseModel,
  ExtraAttrs extends object = {},
> = {} & BaseModelAttributes<Model> & ExtraAttrs

export type InstanceDto<Model extends LucidModel> = {
  primaryKey: string
} & Partial<ModelDto<Model>>
