import { HttpContext } from '@adonisjs/core/http'
import { LucidModel, ModelObject } from '@adonisjs/lucid/types/model'
import { ResourceContext, ResourceTableProps, TablePagination } from '../models/index.js'
import { ResourceProps } from '../models/resource_props.js'
import { ActionBuilder } from './action_builder.js'
import { QueryManager } from './query_manager.js'

export class ResourceRenderer<Model extends LucidModel> {
  constructor(private context: ResourceContext<Model>) {}

  public async computeRessourceProps() {
    const resourceTableProps = await this.computeResourceTableProps()

    const actionProps = this.computeActionsProps()

    const resourceLayoutProps: ResourceProps<Model> = {
      resource: this.context.resource.meta,
      ...actionProps,
      extraResourceFilters: [],
      tableProps: resourceTableProps,
    }
    return resourceLayoutProps
  }

  private computeActionsProps() {
    const noInstanceActionButtons = ActionBuilder.convertToActionButtons<Model>(
      this.context.resource.noInstanceActions
    )
    const multipleInstanceActionsButtons = ActionBuilder.convertToActionButtons<Model>(
      this.context.resource.multipleInstanceActions
    )

    return {
      noInstanceActions: noInstanceActionButtons,
      multipleInstanceActions: multipleInstanceActionsButtons,
    }
  }

  private async computeResourceTableProps() {
    const fields = this.context.resource.getFields()

    const singleInstanceActionsButtons = ActionBuilder.convertToActionButtons<Model>(
      this.context.resource.singleInstanceActions
    )
    const query = this.context.resource.instances
    //Si il y a des query params, on apply le filtrage/sort/pagination avant de serializer
    const queryManager = new QueryManager(this.context, query)
    const filteredQuery = queryManager.applyTableQueryParams()
    const serializedInstances: ModelObject[] =
      await this.context.resource.serializeInstances(filteredQuery)
    const resourceTableProps: ResourceTableProps<Model> = {
      items: serializedInstances,
      singleInstanceActionButtons: singleInstanceActionsButtons,
      columns: fields,
      pagination: {} as TablePagination,
    }
    return resourceTableProps
  }

  public redirect(response: HttpContext['response'], redirectionUrl: string) {
    return response.redirect(redirectionUrl)
  }
}
