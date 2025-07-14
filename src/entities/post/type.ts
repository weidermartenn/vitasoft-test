import type { Comment } from "../comment/type"

export interface Post {
    briefDescription: string
    comments: Comment[]
    dateTime: string
    fullDescription: string
    id: number
    title: string
}