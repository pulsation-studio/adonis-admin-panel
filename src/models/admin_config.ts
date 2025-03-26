import { Resource, BaseModel } from './index.js'

export interface AdminConfig {
  readonly title: string
  readonly resources: Resource<BaseModel>[]
  readonly logoutPath: string
  readonly defaultPath: string
}
