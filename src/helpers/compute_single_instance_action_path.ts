import { LucidModel, ModelObject } from '@adonisjs/lucid/types/model'
import { ActionButton } from '../models/index.js'

export function computeSingleInstanceActionPath(
  action: ActionButton<LucidModel>,
  instance: ModelObject,
  resourcePath: string
) {
  return `/admin/${resourcePath}/${instance.primaryKeyValue}/${action.actionKey}`
}
