export interface User {
    _id : string,
    name : string,
    email : string,
    username : string,
    password : string,
    createdAt? : string,
    updatedAt? : string
    
}

export interface UserRegistration{
    name : string,
    email : string,
    username : string,
    password : string
}

export interface UserLoginCredentials{
    accessToken : string,
    refreshToken : string,
    expiredIn : string
}