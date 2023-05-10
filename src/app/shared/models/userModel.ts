export interface User {
    _id : string,
    name : string,
    email : string,
    username : string,
    password : string,
    avatar?: UserAvatar,
    avatarUrl?: string,
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

export interface UserAvatar{
    _id?: string,
    name: string,
    type: string,
    size: string,
    path: string
}

export interface UpdateUserInfo{
    name: string;
    username: string;
    avatar?: UserAvatar;
}