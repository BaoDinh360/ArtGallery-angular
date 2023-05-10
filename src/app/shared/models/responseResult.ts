export interface ResponseResult<T> {
    status : number,
    statusCode : number,
    data : T,
    message : string,
    stack : string
}

export interface PagedResponseResult<T> {
    status : number,
    statusCode : number,
    data : {
        totalCount: number,
        itemsPerPage: number,
        pageIndex: number,
        totalPage: number,
        items : T[]
    },
    message : string,
    stack : string
}