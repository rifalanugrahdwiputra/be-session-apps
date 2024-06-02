enum OrderBy {
    ASC = "ASC",
    DESC = "DESC"
}
export interface SkripsiDTO {
    nim: string | null;
    include_inactive: string;
    page: number;
    limit: number;
    sortBy: string | null;
    orderBy: OrderBy | null;
}