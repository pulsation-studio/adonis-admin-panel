import { ModelObject } from '@adonisjs/lucid/types/model'
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
    private readonly _getQuerySet: () => Promise<InstanceType<Model>[]>,
    private readonly _instancesSerializer: (
      instances: InstanceType<Model>[]
    ) => Promise<ModelObject[]>
    //filters, pagination, order
  ) {}

  public getFields() {
    return this.fields
  }

  get serializedInstances(): Promise<ModelObject[]> {
    return this.instances.then((instances) => this._instancesSerializer(instances))
  }

  get instances(): Promise<InstanceType<Model>[]> {
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
