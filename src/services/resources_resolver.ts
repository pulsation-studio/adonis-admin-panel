import { HttpContext, Request } from '@adonisjs/core/http'
import { LucidModel } from '@adonisjs/lucid/types/model'
import { Action, HttpMethod, Resource, ResourceContext, RouteType } from '../models/index.js'

export class ResourcesResolver {
  constructor(private resources: Resource<LucidModel>[]) {}

  public resolve({ params, request }: HttpContext): ResourceContext<LucidModel> {
    const urlParams = params['*']
    this.assertHasResourceParam(urlParams)
    const resourceKey = urlParams[0]
    const routeType = this.resolveType(urlParams)
    const actionKey = this.resolveActionKey(urlParams, routeType)
    const instanceId = this.resolveInstanceId(urlParams, routeType)

    const resource = this.getResourceOrFail(resourceKey)

    const action = this.getActionOrFail(resource, actionKey)

    const resourcePath = `/admin/${resource.meta.path}`

    const redirectionUrl = this.computeRedirectionUrl(request, urlParams, action, resourcePath)

    const resourceContext: ResourceContext<LucidModel> = {
      instanceId: instanceId,
      routeType: routeType,
      redirectionUrl: redirectionUrl,
      resourcePath: resourcePath,
      resource: resource,
      action: action,
    }

    return resourceContext
  }

  private resolveInstanceId(urlParams: string[], routeType: RouteType): string | undefined {
    const instanceIdByRouteType = {
      [RouteType.Resource]: undefined,
      [RouteType.MultipleOrNoInstanceAction]: undefined,
      [RouteType.SingleInstanceAction]: urlParams[1],
    }

    return instanceIdByRouteType[routeType] ?? undefined
  }

  private resolveActionKey(urlParams: string[], routeType: RouteType): string | undefined {
    const actionKeyByRouteType = {
      [RouteType.Resource]: undefined,
      [RouteType.MultipleOrNoInstanceAction]: urlParams[1],
      [RouteType.SingleInstanceAction]: urlParams[2],
    }

    return actionKeyByRouteType[routeType] ?? undefined
  }

  // Possible URLs:
  // - Table: /<resource>/
  // - MultipleInstance | NoInstance: /<resource>/<string:actionKey>/
  // - SingleInstance: /<resource>/<number:id>/<string:actionKey>/
  public resolveType(urlParams: string[]): RouteType {
    const numberOfUrlParams = urlParams.length
    const routeTypePossibilites = [
      RouteType.Resource,
      RouteType.MultipleOrNoInstanceAction,
      RouteType.SingleInstanceAction,
    ]
    return routeTypePossibilites[numberOfUrlParams - 1]
  }

  private getResourceOrFail(resourceKey: string): Resource<LucidModel> {
    const filteredResource = this.resources.find((resource) => resource.meta.path === resourceKey)

    if (!filteredResource) throw new Error(`Resource not found for key: ${resourceKey}`)

    return filteredResource
  }

  private getActionOrFail(
    resource: Resource<LucidModel>,
    actionKey: string | undefined
  ): Action<LucidModel> | undefined {
    if (actionKey === undefined) return undefined

    const filteredAction = resource.actions.find((action) => action.actionKey === actionKey)

    if (!filteredAction) throw new Error(`Action not found in Resource (action key: ${actionKey})`)

    return filteredAction
  }

  private computeRedirectionUrl(
    request: Request,
    urlParams: string[],
    action: Action<LucidModel> | undefined,
    resourcePath: string
  ): string {
    if (action?.isHeadless()) return resourcePath

    if (action?.isRegular() && request.method() !== HttpMethod.GET)
      if (action.behavior.redirectOnCompletion) return resourcePath
      else `/admin/${urlParams.join('/')}/`

    return resourcePath
  }

  private assertHasResourceParam(urlParams: unknown): asserts urlParams is string[] {
    if (!Array.isArray(urlParams) || urlParams.length === 0) {
      throw Error('Invalid params')
    }
  }
}
