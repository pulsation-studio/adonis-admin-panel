export enum SortingType {
  Asc = 'asc',
  Desc = 'desc',
  Null = 'null',
}

export type QuerySortingType = Exclude<SortingType, SortingType.Null>

export type QueryParams = Record<string, any>

export interface ResourceFieldQueryParam {
  readonly fieldKey: string
  readonly sortValue?: SortingType
  readonly filterValue?: string | null
}

// Affiner le typage
export interface ResourceQueryParams extends QueryParams {
  readonly fieldQueryParams?: ResourceFieldQueryParam[]
  readonly extraFilters?: QueryParams
  //   readonly pagination?: Record<string, string>
}
