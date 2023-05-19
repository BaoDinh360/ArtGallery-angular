

export interface PostComment{
    _id: string;
    userCommented: {
        _id: string;
        username: string;
        avatar: {
            path: string;
        }; 
    }
    postCommented: string;
    comment: string;
    createdAt: Date;
}