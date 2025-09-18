import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { BaseModel, ResourceContext, ResourceQueryParams, SortingType } from '../models/index.js'

export class QueryManager<Model extends BaseModel> {
  constructor(
    private context: ResourceContext<Model>,
    private query: ModelQueryBuilderContract<Model, InstanceType<Model>>
  ) {}

  getQuery(): ModelQueryBuilderContract<Model, InstanceType<Model>> {
    return this.query
  }

  applyTableQueryParams(): ModelQueryBuilderContract<Model, InstanceType<Model>> {
    const queryParams = this.context.queryParams as ResourceQueryParams
    let sortedQuery = this.applyTableSortParams(queryParams)
    sortedQuery = this.applyTableFilterParams(queryParams)
    return sortedQuery
  }

  private applyTableFilterParams(queryParams: ResourceQueryParams) {
    const resourceFields = this.context.resource.fields
    if (queryParams.fieldQueryParams) {
      // applying new sort values
      for (const fieldParam of queryParams.fieldQueryParams) {
        const matchingField = resourceFields.find((f) => f.valueKey === fieldParam.fieldKey)

        if (!matchingField || !matchingField.filterOption || fieldParam.filterValue === undefined)
          continue
        matchingField.filterOption.value = fieldParam.filterValue
      }
    }
    let sortedQuery: ModelQueryBuilderContract<Model> = this.query

    resourceFields.map((resourceField) => {
      if (resourceField.filterOption && resourceField.filterOption.value) {
        sortedQuery = resourceField.filterOption.queryFilter(
          this.query,
          resourceField.filterOption.value
        )
      }
    })

    return sortedQuery
  }

  private applyTableSortParams(queryParams: ResourceQueryParams) {
    const resourceFields = this.context.resource.fields
    if (queryParams.fieldQueryParams) {
      // applying new sort values
      for (const fieldParam of queryParams.fieldQueryParams) {
        const matchingField = resourceFields.find((f) => f.valueKey === fieldParam.fieldKey)

        if (!matchingField || !matchingField.sortOption || !fieldParam.sortValue) continue

        matchingField.sortOption.value = fieldParam.sortValue
      }
    }
    let sortedQuery: ModelQueryBuilderContract<Model> = this.query
    resourceFields.map((resourceField) => {
      if (resourceField.sortOption && resourceField.sortOption.value !== SortingType.Null) {
        sortedQuery = resourceField.sortOption.querySort(this.query, resourceField.sortOption.value)
      }
    })

    return sortedQuery
  }
}
