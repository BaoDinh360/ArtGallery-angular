
interface PostAuthor{
    _id : string,
    username : string,
    avatar:{
        path: string,
    }
}

// interface PostImage{
//     // _id?: string,
//     // name: string,
//     // type: string,
//     // size: string,
//     path: string
// }

export interface Post{
    _id : string,
    postName : string,
    author : PostAuthor,
    description? : string,
    postImage : string,
    userLikedPost?: string[],
    likeCount?: number,
    commentCount?: number,
    createdAt : string,
    updatedAt : string
}


// export interface CreatePost{
//     postName? : string,
//     description? : string,
//     postImage : PostImage,
// }

