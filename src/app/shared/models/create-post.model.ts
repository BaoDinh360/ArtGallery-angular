import { Image } from "./image.model";

export interface CreatePost{
    postName? : string,
    description? : string,
    postImage? : Image,
}