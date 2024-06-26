import { Model } from './types';
type SortOrder = 'asc' | 'desc';
export interface SortMap {
    [key: string]: SortOrder | SortMap;
}
export interface SortParamsObject {
    [key: string]: SortOrder | SortParamsObject;
}
type SortParams = string | string[] | SortParamsObject | SortParamsObject[];
type FieldsParams = string | string[];
type FiltersParams = unknown;
export interface PopulateAttributesParams {
    [key: string]: PopulateObjectParams;
}
export interface PopulateObjectParams {
    sort?: SortParams;
    fields?: FieldsParams;
    filters?: FiltersParams;
    populate?: PopulateParams;
    publicationState?: 'live' | 'preview';
    on: PopulateAttributesParams;
}
type PopulateParams = string | string[] | PopulateAttributesParams;
export interface Params {
    sort?: SortParams;
    fields?: FieldsParams;
    filters?: FiltersParams;
    populate?: PopulateParams;
    count?: boolean;
    ordering?: unknown;
    _q?: string;
    limit?: number | string;
    start?: number | string;
    page?: number | string;
    pageSize?: number | string;
    publicationState?: 'live' | 'preview';
}
type FiltersQuery = (options: {
    meta: Model;
}) => WhereQuery | undefined;
type OrderByQuery = SortMap | SortMap[];
type SelectQuery = string | string[];
export interface WhereQuery {
    [key: string]: any;
}
type PopulateQuery = boolean | string[] | {
    [key: string]: PopulateQuery;
};
export interface Query {
    orderBy?: OrderByQuery;
    select?: SelectQuery;
    where?: WhereQuery;
    filters?: FiltersQuery;
    populate?: PopulateQuery;
    count?: boolean;
    ordering?: unknown;
    _q?: string;
    limit?: number;
    offset?: number;
    page?: number;
    pageSize?: number;
}
declare const _default: {
    convertSortQueryParams: (sortQuery: SortParams) => OrderByQuery;
    convertStartQueryParams: (startQuery: unknown) => number;
    convertLimitQueryParams: (limitQuery: unknown) => number | undefined;
    convertPopulateQueryParams: (populate: PopulateParams, schema?: Model | undefined, depth?: number) => PopulateQuery;
    convertFiltersQueryParams: (filters: unknown, schema?: Model | undefined) => WhereQuery;
    convertFieldsQueryParams: (fields: FieldsParams, depth?: number) => SelectQuery | undefined;
    convertPublicationStateParams: (schema?: Model | undefined, params?: {
        publicationState?: "live" | "preview" | undefined;
    }, query?: Query) => void;
    transformParamsToQuery: (uid: string, params: Params) => Query;
};
export default _default;
//# sourceMappingURL=convert-query-params.d.ts.map