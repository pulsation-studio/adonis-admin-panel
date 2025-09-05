import { HttpContext } from '@adonisjs/core/http'
import { LucidModel, ModelObject, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import {
  ResourceContext,
  ResourceQueryParams,
  ResourceTableProps,
  SortingType,
  TablePagination,
} from '../models/index.js'
import { ResourceProps } from '../models/resource_props.js'
import { ActionBuilder } from './action_builder.js'

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
    const filteredQuery = this.applyTableQueryParams(query)

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

  applyTableQueryParams(
    query: ModelQueryBuilderContract<Model, InstanceType<Model>>
  ): ModelQueryBuilderContract<Model, InstanceType<Model>> {
    //Vérifier qu'il y a des query params
    const queryParams = this.context.queryParams as ResourceQueryParams
    const sortedQuery = this.applyTableSortParams(query, queryParams)
    //Vérifier qu'il sont corrects, ou gérer une possible erreur
    //Appliquer les query params
    //Renvoyer la query applied par les params
    return sortedQuery as ModelQueryBuilderContract<Model>
  }

  applyTableSortParams(query: ModelQueryBuilderContract<Model>, queryParams: ResourceQueryParams) {
    if (!queryParams.fieldQueryParams) return query

    const resourceFields = this.context.resource.fields
    // applying new sort values
    for (const fieldParam of queryParams.fieldQueryParams) {
      const matchingField = resourceFields.find((f) => f.valueKey === fieldParam.fieldKey)

      if (!matchingField || !matchingField.sortOption) continue

      matchingField.sortOption.value = fieldParam.sort
    }

    const sortedQuery = query
    resourceFields.map((resourceField) => {
      if (resourceField.sortOption && resourceField.sortOption.value !== SortingType.Null) {
        sortedQuery.orderBy(resourceField.sortOption.querySort(), resourceField.sortOption.value)
      }
    })

    return sortedQuery
  }

  public redirect(response: HttpContext['response'], redirectionUrl: string) {
    return response.redirect(redirectionUrl)
  }
}
