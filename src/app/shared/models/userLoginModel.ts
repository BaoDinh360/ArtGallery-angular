export interface UserLoginInfo{
    _id : string,
    email : string,
    username : string,
    accessToken : string,
    refreshToken : string,
    expiredIn : string
}

export interface CurrentUserLoginInfo{
    id : string,
    email : string,
    username : string
}