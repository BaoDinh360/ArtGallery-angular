
interface PostAuthor{
    id : string,
    username : string,
    avatar:{
        path: string,
    }
}

interface PostImage{
    // _id?: string,
    // name: string,
    // type: string,
    // size: string,
    path: string
}

export interface Post{
    id : string,
    postName : string,
    author : PostAuthor,
    description? : string,
    postImage : PostImage,
    userLikedPost?: string[],
    likes?: number,
    // postImageUrl? : string,
    createdAt : string,
    updatedAt : string
}


// export interface CreatePost{
//     postName? : string,
//     description? : string,
//     postImage : PostImage,
// }

