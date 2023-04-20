export interface ResponseResult<T> {
    status : string,
    statusCode : number,
    data : T,
    message : string,
    stack : string
}

export interface PagedResponseResult<T> {
    status : string,
    statusCode : number,
    data : {
        items : T[],
        total : number 
    },
    message : string,
    stack : string
}