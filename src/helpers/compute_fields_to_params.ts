import { BaseModel } from '../models/model.js'
import { QueryParams, ResourceFieldQueryParam, ResourceQueryParams } from '../models/query_param.js'
import { ResourceField } from '../models/resource_field.js'

export function computeFieldsToParams<Model extends BaseModel>(
  resourceFields: ResourceField<Model>[],
  extraResourceFilters: QueryParams
): ResourceQueryParams {
  const fieldQueryParams: ResourceFieldQueryParam[] = resourceFields.map(
    (field) =>
      ({
        fieldKey: field.valueKey,
        sortValue: field.sortOption?.value,
        filterValue: field.filterOption?.value,
      }) as ResourceFieldQueryParam
  )

  const extraFilters: QueryParams = extraResourceFilters
  return {
    extraFilters: extraFilters,
    fieldQueryParams: fieldQueryParams,
  } as ResourceQueryParams
}
