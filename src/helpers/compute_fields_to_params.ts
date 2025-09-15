import { BaseModel } from '../models/model.js'
import { QueryParams, ResourceFieldQueryParam, ResourceQueryParams } from '../models/query_param.js'
import { ResourceField } from '../models/resource_field.js'

export function computeFieldsToParams<Model extends BaseModel>(
  resourceFields: ResourceField<Model>[],
  extraResourceFilters: QueryParams
): ResourceQueryParams {
  const fieldQueryParams: ResourceFieldQueryParam[] = resourceFields
    .filter((field) => field.sortOption !== undefined)
    .map(
      (field) =>
        ({
          fieldKey: field.valueKey,
          sort: field.sortOption?.value,
        }) as ResourceFieldQueryParam
    )

  const extraFilters: QueryParams = extraResourceFilters
  return {
    extraFilters: extraFilters,
    fieldQueryParams: fieldQueryParams,
  } as ResourceQueryParams
}
