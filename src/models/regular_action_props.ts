import { ResourceMeta } from './resource_meta.js'

export interface RegularActionProps {
  readonly title: string
  readonly resource: ResourceMeta
  readonly actionProps: unknown
}
