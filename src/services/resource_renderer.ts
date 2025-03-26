import { HttpContext } from '@adonisjs/core/http'
import { ResourceContext, ResourceTableProps } from '../models/index.js'
import { LucidModel } from '@adonisjs/lucid/types/model'
import { ActionBuilder } from './action_builder.js'
import { ResourceProps } from '../models/resource_props.js'

export class ResourceRenderer<Model extends LucidModel> {
  constructor(private context: ResourceContext<Model>) {}

  public async computeRessourceProps() {
    const resourceTableProps = await this.computeResourceTableProps()

    const actionProps = this.computeActionsProps()

    const resourceLayoutProps: ResourceProps<Model> = {
      resource: this.context.resource.meta,
      ...actionProps,

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

    const resourceTableProps: ResourceTableProps<Model> = {
      items: await this.context.resource.serializedInstances,
      singleInstanceActionButtons: singleInstanceActionsButtons,
      columns: fields,
    }
    return resourceTableProps
  }

  public redirect(response: HttpContext['response'], redirectionUrl: string) {
    return response.redirect(redirectionUrl)
  }
}
