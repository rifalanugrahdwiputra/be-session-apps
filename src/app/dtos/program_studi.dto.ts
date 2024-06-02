enum OrderBy {
    ASC = "ASC",
    DESC = "DESC"
}
export interface ProgramStudiDTO {
    program_studi: string | null;
    include_inactive: string;
    page: number;
    limit: number;
    sortBy: string | null;
    orderBy: OrderBy | null;
}