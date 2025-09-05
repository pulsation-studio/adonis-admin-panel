import { HttpContext } from '@adonisjs/core/http'
import { LucidModel } from '@adonisjs/lucid/types/model'
import { Action, HttpMethod, ResourceContext, ResourceProps } from '../models/index.js'
import { RegularActionProps } from '../models/regular_action_props.js'
import { RouteType } from '../models/route_type.js'
import ActionResolver from '../services/action_resolver.js'
import { adminConfigService, ResourceRenderer, ResourcesResolver } from '../services/index.js'

export default class ResourceController {
  public async index(ctx: HttpContext) {
    const adminConfig = await adminConfigService.getConfig()
    const resources = adminConfig.resources
    const resourcesResolver = new ResourcesResolver(resources, adminConfig)
    const resourceContext = resourcesResolver.resolve(ctx)

    switch (resourceContext.routeType) {
      case RouteType.Resource:
        return this.handleResourceRequest(ctx, resourceContext)
      case RouteType.SingleInstanceAction:
      case RouteType.MultipleOrNoInstanceAction:
        return this.handleActionRequest(ctx, resourceContext)
      default:
        throw new Error('Not handled')
    }
  }

  private async handleActionRequest(
    ctx: HttpContext,
    resourceContext: ResourceContext<LucidModel>
  ) {
    const action = resourceContext.action
    this.assertHasAction(action)

    const handleAction = async () => {
      try {
        this.assertHttpMethodsAreMatching(action, ctx)
        const actionResolver = new ActionResolver(ctx, resourceContext)
        await actionResolver.resolve(action)

        return ctx.response.redirect(resourceContext.redirectionUrl)
      } catch (error) {
        if (action.onError !== undefined) {
          return action.onError(error, ctx)
        }

        return ctx.response.redirect(ctx.request.url(true))
      }
    }

    if (action.isHeadless()) await handleAction()

    if (action.isRegular()) {
      const isGetMethod = ctx.request.method() === HttpMethod.GET

      if (!isGetMethod) await handleAction()
      else {
        const instance = await this.getInstance(
          resourceContext.resource.model,
          resourceContext.instanceId
        )
        const actionProps = await action.behavior.propsComputing(
          resourceContext.resource,
          action,
          instance
        )
        const regularActionProps: RegularActionProps = {
          title: action.behavior.componentTitle,
          resource: resourceContext.resource.meta,
          actionProps: actionProps,
        }
        return ctx.inertia.render(action.behavior.componentPath, {
          ...regularActionProps,
        })
      }
    }
  }
  private async getInstance(
    model: LucidModel,
    instanceId: string | undefined
  ): Promise<InstanceType<LucidModel> | undefined> {
    if (instanceId === undefined) return undefined
    return await model.findOrFail(instanceId)
  }

  private async handleResourceRequest(
    ctx: HttpContext,
    resourceContext: ResourceContext<LucidModel>
  ) {
    const resourceResolver = new ResourceRenderer(resourceContext)

    const props: ResourceProps<LucidModel> = await resourceResolver.computeRessourceProps()
    return ctx.inertia.render('admin/resource', {
      ...props,
    })
  }

  private assertHasAction(
    action: Action<LucidModel> | undefined
  ): asserts action is Action<LucidModel> {
    if (action === undefined) throw new Error('An Action is expected')
  }

  private assertHttpMethodsAreMatching(action: Action<LucidModel>, ctx: HttpContext) {
    if (action.method !== ctx.request.method())
      throw new Error('unexpected Http Method for this action')
  }
}
