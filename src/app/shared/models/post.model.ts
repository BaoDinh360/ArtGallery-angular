import { PageFilterSearch } from "./page-filter-search.model"

interface PostAuthor{
    _id : string,
    username : string,
    avatar:{
        path: string,
    }
}

export interface Post{
    _id : string,
    postName : string,
    author : PostAuthor,
    description? : string,
    postImage : string,
    userLikedPost?: string[],
    postTags?: string[],
    likeCount?: number,
    commentCount?: number,
    createdAt : string,
    updatedAt : string
}


export interface PostFilterSearch extends PageFilterSearch{
    postName?: string,
    authorName?: string
}

export interface PostSort{
    postName:string,
    likeCount: string,
    commentCount: string
}

