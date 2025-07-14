import type { Comment } from "../comment/type"

export interface GetPostDto {
    briefDescription: string
    comments: Comment[]
    dateTime: string
    fullDescription: string
    id: number
    title: string
    userInfoId: number
}