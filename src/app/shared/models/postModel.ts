export interface Post{
    _id : string,
    postName : string,
    author : {
        _id : string,
        username : string
    },
    description : string,
    postImage : {
        _id : string,
        fileName : string,
        filePath : string
    },
    postImageUrl? : string,
    createdAt : string,
    updatedAt : string
}

export interface CreatePost{
    postName : string,
    description : string,
    postImage : string,
}

