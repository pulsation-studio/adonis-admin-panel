import { ModelObject, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import {
  Action,
  MultipleInstanceAction,
  NoInstanceAction,
  ResourceField,
  ResourceMeta,
  SingleInstanceAction,
  BaseModel,
} from './index.js'

export class Resource<Model extends BaseModel> {
  constructor(
    readonly model: Model,
    readonly actions: Action<Model>[],
    readonly fields: ResourceField<Model>[],
    readonly meta: ResourceMeta,
    private readonly _getQuerySet: () => ModelQueryBuilderContract<Model>,
    private readonly _instancesSerializer: (
      instances: InstanceType<Model>[]
    ) => Promise<ModelObject[]>
    //filters, pagination, order
  ) {}

  public getFields() {
    return this.fields
  }

  public async serializeInstances(query: ModelQueryBuilderContract<Model>): Promise<ModelObject[]> {
    return query.then((instances) => this._instancesSerializer(instances))
  }

  get instances(): ModelQueryBuilderContract<Model> {
    return this._getQuerySet()
  }

  get noInstanceActions(): NoInstanceAction<Model>[] {
    return this.actions.filter((action) => action instanceof NoInstanceAction)
  }

  get singleInstanceActions(): SingleInstanceAction<Model>[] {
    return this.actions.filter((action) => action instanceof SingleInstanceAction)
  }

  get multipleInstanceActions(): MultipleInstanceAction<Model>[] {
    return this.actions.filter((action) => action instanceof MultipleInstanceAction)
  }
}
