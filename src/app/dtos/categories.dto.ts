enum OrderBy {
    ASC = "ASC",
    DESC = "DESC"
}
export interface JobCategoryDTO {
    category_name: string | null;
    include_inactive: string;
    page: number;
    limit: number;
    sortBy: string | null;
    orderBy: OrderBy | null;
}