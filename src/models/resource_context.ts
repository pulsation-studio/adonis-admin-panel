import { Action, Resource, RouteType, BaseModel } from './index.js'

export interface ResourceContext<Model extends BaseModel> {
  readonly instanceId?: string
  readonly routeType: RouteType
  readonly resource: Resource<Model>
  readonly redirectionUrl: string
  readonly resourcePath: string
  readonly action?: Action<Model>
}
