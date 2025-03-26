import { HttpContext } from '@adonisjs/core/http'
import {
  BaseModel,
  ResourceContext,
  Action,
  MultipleInstanceAction,
  NoInstanceAction,
  SingleInstanceAction,
} from '../models/index.js'
import db from '@adonisjs/lucid/services/db'

export default class ActionResolver<Model extends BaseModel> {
  constructor(
    private ctx: HttpContext,
    private resourceCtx: ResourceContext<Model>
  ) {}

  async resolve(action: Action<Model>) {
    const model = this.resourceCtx.resource.model
    const request = this.ctx.request

    switch (true) {
      case action instanceof NoInstanceAction:
        return action.handle({ model, request, db })

      case action instanceof SingleInstanceAction:
        const instance = await model.findOrFail(this.resourceCtx.instanceId)
        return action.handle({ model, request, instance, db })

      case action instanceof MultipleInstanceAction:
        // TODO : si il y a un body, check pour récupérer les ids, sinon model.all()
        // faire attention au query parameters
        return action.handle({ model, request, instances: [], db })

      default:
        throw new Error('Unkonw Action type')
    }
  }
}
