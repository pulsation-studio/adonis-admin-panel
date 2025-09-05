export enum SortingType {
  Asc = 'asc',
  Desc = 'desc',
  Null = 'null',
}

export type QueryParams = Record<string, any>

export interface ResourceFieldQueryParam {
  readonly fieldKey: string
  readonly sort: SortingType
  //   readonly filterQueryParams?: Record<string, any>
}

// Affiner le typage
export interface ResourceQueryParams extends QueryParams {
  readonly fieldQueryParams?: ResourceFieldQueryParam[]
  readonly extraFilters?: QueryParams
  //   readonly pagination?: Record<string, string>
}
